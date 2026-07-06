const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../../.env") });

const fs   = require("fs");
const XLSX = require("xlsx");
const FormData = require("form-data");
const Mailgun  = require("mailgun.js");

const EXCEL_PATH = process.argv[2] || "C:\\Users\\broscheitcb\\Desktop\\Envio de facturas con mailgun 2 - desde la casilla de cobranzas de Ecobahia.xlsx";

async function sendDesdeExcel() {
  if (!EXCEL_PATH) {
    console.error(" Uso: node sendDesdeExcel.js <ruta-al-archivo.xlsx>");
    process.exit(1);
  }

  if (!fs.existsSync(EXCEL_PATH)) {
    console.error(` No se encontró el archivo Excel: ${EXCEL_PATH}`);
    process.exit(1);
  }

  // Leer Excel
  const workbook = XLSX.readFile(EXCEL_PATH);
  const sheet    = workbook.Sheets[workbook.SheetNames[0]];
  const rows     = XLSX.utils.sheet_to_json(sheet, { header: 1 });

  // Saltar fila de encabezado y filas vacías
  const dataRows = rows.slice(1).filter((row) => row[0]);
  console.log(`Filas a procesar: ${dataRows.length}`);

  // Inicializar Mailgun con dominio basani.com.ar para evitar
  // problemas de entrega cuando el destinatario es @grupobasani.com
  const mailgun = new Mailgun(FormData);
  const mg = mailgun.client({
    username: "api",
    key: process.env.API_KEY,
    url: "https://api.mailgun.net",
  });

  let enviados = 0;
  let errores  = 0;
  let faltaPdf = 0;

  for (const row of dataRows) {
    const [emailTo, subject, body, pdfPath] = row;

    if (!emailTo || !subject) {
      console.log(` Fila incompleta, saltando: ${JSON.stringify(row)}`);
      continue;
    }

    try {
      const destinatarios = String(emailTo)
        .split(";")
        .map((e) => e.trim())
        .filter(Boolean);

      const messageData = {
        from:          "Ecobahia - Cobranzas <facturacionecobahia@basani.com.ar>",
        to:            destinatarios,
        subject:       String(subject).trim(),
        text:          body ? String(body).trim() : "",
        "h:Reply-To":  process.env.MAIL_USER_6,
      };

      // Adjuntar PDF si la ruta está presente y el archivo existe
      if (pdfPath && String(pdfPath).trim()) {
        const cleanPath = String(pdfPath).trim();
        if (fs.existsSync(cleanPath)) {
          messageData.attachment = [
            {
              filename: path.basename(cleanPath),
              data:     fs.readFileSync(cleanPath),
            },
          ];
        } else {
          console.log(`📄 PDF no encontrado, mail no enviado: ${cleanPath}`);
          faltaPdf++;
          continue;
        }
      }

      await mg.messages.create(process.env.MAILGUN_DOMAIN, messageData);

      console.log(`Enviado → ${destinatarios.join(", ")} | ${subject}`);
      enviados++;

      // Pausa breve para no saturar la API de Mailgun
      await new Promise((r) => setTimeout(r, 300));

    } catch (err) {
      console.error(`❌ Error con ${emailTo}: ${err.message}`);
      errores++;
    }
  }

  console.log("\n━━━━━━━ Resumen ━━━━━━━");
  console.log(`✅ Enviados:   ${enviados}`);
  console.log(`📄 Falta PDF: ${faltaPdf}`);
  console.log(`❌ Errores:   ${errores}`);
}

sendDesdeExcel().catch(console.error);
