const FormData = require("form-data");
const Mailgun = require("mailgun.js");

const mailgun = new Mailgun(FormData);

/**
 * Envía un email via Mailgun según la sucursal.
 * Por ahora todos salen desde basani.com.ar (mesadeayuda@basani.com.ar).
 * Cuando estén configurados los dominios en Mailgun, descomentar el bloque
 * correspondiente y agregar las variables de entorno en el .env.
 *
 * @param {object} opts
 * @param {number} opts.sucursal
 * @param {string} opts.from       - Dirección "Nombre <email>" del remitente visible
 * @param {string|string[]} opts.to
 * @param {string|string[]} [opts.cc]
 * @param {string} opts.replyTo    - Dirección a la que responde el cliente
 * @param {string} opts.subject
 * @param {string} opts.html
 */
async function sendMailgunMessage({ sucursal, from, to, cc, replyTo, subject, html }) {

  /* ─── SUCURSAL 2 – Cylius ─────────────────────────────────────────────────
  if (sucursal === 2 && process.env.MAILGUN_DOMAIN_2) {
    const mg2 = mailgun.client({ username: "api", key: process.env.API_KEY_2 || process.env.API_KEY, url: "https://api.mailgun.net" });
    return mg2.messages.create(process.env.MAILGUN_DOMAIN_2, buildPayload({ from: process.env.MAIL_FROM_2 || from, to, cc, replyTo, subject, html }));
  }
  ─────────────────────────────────────────────────────────────────────────── */

  /* ─── SUCURSAL 3 – Baebsa ────────────────────────────────────────────────
  if (sucursal === 3 && process.env.MAILGUN_DOMAIN_3) {
    const mg3 = mailgun.client({ username: "api", key: process.env.API_KEY_3 || process.env.API_KEY, url: "https://api.mailgun.net" });
    return mg3.messages.create(process.env.MAILGUN_DOMAIN_3, buildPayload({ from: process.env.MAIL_FROM_3 || from, to, cc, replyTo, subject, html }));
  }
  ─────────────────────────────────────────────────────────────────────────── */

  /* ─── SUCURSAL 4 – Baxpa ─────────────────────────────────────────────────
  if (sucursal === 4 && process.env.MAILGUN_DOMAIN_4) {
    const mg4 = mailgun.client({ username: "api", key: process.env.API_KEY_4 || process.env.API_KEY, url: "https://api.mailgun.net" });
    return mg4.messages.create(process.env.MAILGUN_DOMAIN_4, buildPayload({ from: process.env.MAIL_FROM_4 || from, to, cc, replyTo, subject, html }));
  }
  ─────────────────────────────────────────────────────────────────────────── */

  /* ─── SUCURSAL 5 – Ecosistemas Patagónicos ───────────────────────────────
  if (sucursal === 5 && process.env.MAILGUN_DOMAIN_5) {
    const mg5 = mailgun.client({ username: "api", key: process.env.API_KEY_5 || process.env.API_KEY, url: "https://api.mailgun.net" });
    return mg5.messages.create(process.env.MAILGUN_DOMAIN_5, buildPayload({ from: process.env.MAIL_FROM_5 || from, to, cc, replyTo, subject, html }));
  }
  ─────────────────────────────────────────────────────────────────────────── */

  /* ─── SUCURSAL 6 – Ecobahia ──────────────────────────────────────────────
  if (sucursal === 6 && process.env.MAILGUN_DOMAIN_6) {
    const mg6 = mailgun.client({ username: "api", key: process.env.API_KEY_6 || process.env.API_KEY, url: "https://api.mailgun.net" });
    return mg6.messages.create(process.env.MAILGUN_DOMAIN_6, buildPayload({ from: process.env.MAIL_FROM_6 || from, to, cc, replyTo, subject, html }));
  }
  ─────────────────────────────────────────────────────────────────────────── */

  /* ─── SUCURSAL 7 – Ecoportatiles ─────────────────────────────────────────
  if (sucursal === 7 && process.env.MAILGUN_DOMAIN_7) {
    const mg7 = mailgun.client({ username: "api", key: process.env.API_KEY_7 || process.env.API_KEY, url: "https://api.mailgun.net" });
    return mg7.messages.create(process.env.MAILGUN_DOMAIN_7, buildPayload({ from: process.env.MAIL_FROM_7 || from, to, cc, replyTo, subject, html }));
  }
  ─────────────────────────────────────────────────────────────────────────── */

  // Default: dominio Basani para todas las sucursales hasta que se configuren en Mailgun
  console.log(`Mailgun: enviando para sucursal ${sucursal} con dominio basani.com.ar`);
  const mgDefault = mailgun.client({
    username: "api",
    key: process.env.API_KEY,
    url: "https://api.mailgun.net",
  });

  return mgDefault.messages.create(
    process.env.MAILGUN_DOMAIN || "basani.com.ar",
    buildPayload({ from, to, cc, replyTo, subject, html })
  );
}

function buildPayload({ from, to, cc, replyTo, subject, html }) {
  const payload = {
    from,
    to: Array.isArray(to) ? to : [to],
    subject,
    html,
  };
  if (cc) payload.cc = Array.isArray(cc) ? cc : [cc];
  if (replyTo) payload["h:Reply-To"] = replyTo;
  return payload;
}

module.exports = sendMailgunMessage;
