require("dotenv").config({path: "../../../.env"});
const FormData = require("form-data");
const Mailgun = require("mailgun.js");

const { API_KEY, MAILGUN_DOMAIN } = process.env;

// =====================
// Configurables
// =====================

const CONFIG = {
  domain: "mail.basani.com.ar",         
  apiKey: process.env.API_KEY,                
  from: 'Carlos Broscheit <bernardo.broscheit@basani.com.ar>',
  subject: "Cuenta corriente del mes",
  // Control de envío
  batchSize: 100,        // cuántos correos por lote
  concurrency: 15,       // cuántos correos a la vez dentro del lote (10–25 es razonable)
  maxRetries: 5,         // reintentos por destinatario en errores transitorios
  initialBackoffMs: 1500,// backoff inicial (ms)
  dryRun: true,         // true => no envía, solo simula
};

// =====================
// Cliente Mailgun
// =====================
const mailgun = new Mailgun(FormData);
const mg = mailgun.client({
  username: "api",
  key: CONFIG.apiKey,
  url: "https://api.mailgun.net",
});

// =====================
// Helpers
// =====================
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function chunk(arr, size) {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) chunks.push(arr.slice(i, i + size));
  return chunks;
}

function isTransientError(err) {
  // Mailgun lanza error.response.status para HTTP; si es 429/5xx es transitorio
  const status = err?.status || err?.response?.status;
  return status === 429 || (status >= 500 && status <= 599) ||
         ["ETIMEDOUT","ECONNRESET","EAI_AGAIN"].includes(err?.code);
}

async function withRetries(taskFn, { maxRetries, initialBackoffMs }, label = "") {
  let attempt = 0;
  let backoff = initialBackoffMs;
  while (true) {
    try {
      return await taskFn();
    } catch (err) {
      attempt++;
      if (!isTransientError(err) || attempt > maxRetries) {
        // No transitorio o agotamos reintentos
        err.attempts = attempt;
        throw err;
      }
      console.warn(
        `Aviso: fallo transitorio${label ? " (" + label + ")" : ""}. ` +
        `Reintentando ${attempt}/${maxRetries} en ${backoff}ms. Status: ${err?.response?.status || err?.status || err?.code}`
      );
      await sleep(backoff);
      backoff = Math.min(backoff * 2, 30000); // máx 30s
    }
  }
}

// =====================
// Plantillas simples
// =====================
function renderText({ name }) {
  return `Hola${name ? " " + name : ""},

Adjuntamos/Detallamos tu estado de cuenta corriente correspondiente al período actual.

Saludos,
Equipo Basani`;
}

function renderHtml({ name }) {
  return `
    <div style="font-family:Arial, Helvetica, sans-serif; line-height:1.5; font-size:14px">
      <p>Hola${name ? " " + name : ""},</p>
      <p>Adjuntamos/Detallamos tu <strong>estado de cuenta corriente</strong> del período actual.</p>
      <p>Saludos,<br/>Equipo Basani</p>
    </div>
  `;
}

// =====================
// Envío individual
// =====================
async function sendOne({ email, name }) {
  if (CONFIG.dryRun) {
    return { id: "dry-run", to: email };
  }
  const payload = {
    from: CONFIG.from,
    to: [email], // envío individual
    subject: CONFIG.subject,
    text: renderText({ name }),
    html: renderHtml({ name }),
    // Si tenés PDF adjunto por cliente, agregalo así (Buffer o ruta):
    // attachment: [{ data: fs.createReadStream('/ruta/estado.pdf'), filename: `estado-${email}.pdf` }]
  };

  return await mg.messages.create(CONFIG.domain, payload);
}

// =====================
// Ejecutor con concurrencia
// =====================

async function runConcurrent(items, concurrency, worker) {
  let index = 0;
  const results = new Array(items.length);
  const runners = new Array(Math.min(concurrency, items.length)).fill(null).map(async () => {
    while (index < items.length) {
      const current = index++;
      try {
        results[current] = await worker(items[current], current);
      } catch (err) {
        results[current] = { error: err };
      }
    }
  });
  await Promise.all(runners);
  return results;
}

// =====================
// API principal
// =====================
/**
 * recipients: Array<{ email: string, name?: string }>
 */
async function sendBulkIndividualEmails(recipients) {
  if (!CONFIG.apiKey || !CONFIG.domain) {
    throw new Error("Config incompleta: faltan MAILGUN_DOMAIN o API_KEY");
  }

  console.log(`Iniciando envío individual a ${recipients.length} destinatarios`);
  console.log(`BatchSize=${CONFIG.batchSize} | Concurrency=${CONFIG.concurrency} | DryRun=${CONFIG.dryRun}`);

  const batches = chunk(recipients, CONFIG.batchSize);
  let totalOk = 0;
  let totalFail = 0;
  const failures = [];

  for (let b = 0; b < batches.length; b++) {
    const batch = batches[b];
    console.log(`Procesando lote ${b + 1}/${batches.length} (${batch.length} destinatarios)...`);

    const results = await runConcurrent(batch, CONFIG.concurrency, async (recipient) => {
      const label = `to=${recipient.email}`;
      try {
        const res = await withRetries(
          () => sendOne(recipient),
          { maxRetries: CONFIG.maxRetries, initialBackoffMs: CONFIG.initialBackoffMs },
          label
        );
        console.log(`✅ OK: ${recipient.email} -> ${res?.id || "sent"}`);
        return { ok: true, id: res?.id || null, to: recipient.email };
      } catch (err) {
        const status = err?.response?.status || err?.status || err?.code || "unknown";
        const message = err?.message || JSON.stringify(err);
        console.error(`❌ FAIL: ${recipient.email} (status=${status}) ${message}`);
        return { ok: false, to: recipient.email, status, message };
      }
    });

    // Acumular métricas del lote
    for (const r of results) {
      if (r?.ok) totalOk++;
      else {
        totalFail++;
        failures.push(r);
      }
    }

    // Pequeña pausa entre lotes para ser amables con la API
    if (b < batches.length - 1) {
      await sleep(1500);
    }
  }

  console.log("=====================================");
  console.log(`Resumen envío: OK=${totalOk} | FAIL=${totalFail} | Total=${recipients.length}`);
  if (failures.length) {
    console.log("Fallidos (primeros 10):", failures.slice(0, 10));
  }

  return { ok: totalOk, fail: totalFail, failures };
}


// Ejemplo de uso

// Normalmente vas a construir esta lista desde tu BD (clientes con email != null)

if (require.main === module) {
  const recipients = [
    { email: "lucas.llamanzarez@basani.com.ar", name: "Lucas" },
    { email: "bernardo.broscheit@basani.com.ar", name: "Bernardo" },
    { email: "bernardo.broscheit@gmail.com", name: "Bernardo Gmail" },
    // ... hasta ~2000
  ];

  sendBulkIndividualEmails(recipients)
    .then((res) => {
      console.log("Envío finalizado", res);
      process.exit(0);
    })
    .catch((err) => {
      console.error("Error general en el envío:", err);
      process.exit(1);
    });
}

module.exports = { sendBulkIndividualEmails };
