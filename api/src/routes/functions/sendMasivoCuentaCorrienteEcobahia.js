const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../../.env") });
const sql = require("mssql");
const { Op } = require("sequelize");
const { Documentecobahia } = require("../../bd");
const estadoDeCuentaTemplate = require("../mailModels/estadoDeCuenta");
const { getConfigSucursal } = require("../mailModels/sucursalConfig");
const sendMailgunMessage = require("../helpers/getMailTransporter");
const { TIPOS_DEUDA } = require("../helpers/sucursalModels");

const crmConfig = {
  user: process.env.CRM_USER,
  password: process.env.CRM_PASSWORD,
  server: process.env.CRM_SERVER,
  database: process.env.CRM_DATABASE_ECOBAHIA,
  options: {
    encrypt: true,
    enableArithAbort: true,
    trustServerCertificate: true,
  },
};

async function sendMasivoCuentaCorrienteEcobahia() {
  console.log("Inicio de envío masivo de cuenta corriente para Ecobahia...");

  // 1. Traer clientes activos del CRM con los campos necesarios
  const pool = await sql.connect(crmConfig);
  const result = await pool.request().query(`
    SELECT
      new_codigodecliente                      AS codigocliente,
      new_apellidonombrerazonsocial            AS razonsocial,
      new_facturacionelectronica               AS email,
      new_correoelectronicodecobranzas         AS emailCobranzas,
      new_envioautomaticodegestiondesdelaapp   AS envioAutomatico
    FROM Account
    WHERE statecode = 0
  `);
  await pool.close();

  console.log(`Total clientes activos en CRM: ${result.recordset.length}`);

  // 2. Filtrar solo los que tienen envío automático habilitado
  const clientes = result.recordset.filter(
    (c) => c.envioAutomatico === true || c.envioAutomatico === 1
  );
  console.log(`Con envío automático habilitado: ${clientes.length}`);

  const config = getConfigSucursal(6);
  let enviados = 0;
  let sinDeuda = 0;
  let sinEmail = 0;
  let errores  = 0;

  for (const cliente of clientes) {
    try {
      // 3. Armar lista de emails combinando ambos campos
      const emails = [];

      if (cliente.email && cliente.email.trim() && cliente.email.trim() !== "Sin asignar") {
        emails.push(cliente.email.trim());
      }

      if (cliente.emailCobranzas && cliente.emailCobranzas.trim()) {
        const extras = cliente.emailCobranzas
          .split(/[,/;]/)
          .map((e) => e.trim())
          .filter(Boolean);
        for (const e of extras) {
          if (!emails.includes(e)) emails.push(e);
        }
      }

      if (!emails.length) {
        console.log(`⚠️  Sin emails: ${cliente.codigocliente} — ${cliente.razonsocial}`);
        sinEmail++;
        continue;
      }

      // 4. Buscar documentos con deuda pendiente en Postgres
      const docs = await Documentecobahia.findAll({
        where: {
          clientId: parseInt(cliente.codigocliente),
          montopendiente: { [Op.gt]: 0 },
          tipodocumento: { [Op.in]: TIPOS_DEUDA },
        },
      });

      if (!docs.length) {
        sinDeuda++;
        continue;
      }

      const facturas = docs.map((d) => {
        const doc = d.toJSON();
        return { ...doc, numero: doc.numerodocumento, fecha: doc.fechadocumento };
      });
      const deudaNeta = facturas.reduce((acc, d) => acc + parseFloat(d.montopendiente), 0);

      if (deudaNeta <= 0) {
        sinDeuda++;
        continue;
      }

      // 5. Generar HTML del mail
      const html = estadoDeCuentaTemplate({
        clienteNombre: cliente.razonsocial || "Cliente",
        gestoraNombre: "",
        facturas,
        sucursalNombre: "Ecobahia",
        cuentas: config.cuentas,
        telefonos: config.telefonos,
      });

      // 6. Enviar: primer email en "to", el resto en "cc"
      const [to, ...cc] = emails;

      await sendMailgunMessage({
        sucursal: 6,
        from: `"Ecobahia - Cobranzas" <${process.env.MAIL_USER_6}>`,
        to,
        cc: cc.length ? cc : undefined,
        subject: "Estado de Cuenta",
        html,
      });

      console.log(`✅ Enviado → ${emails.join(", ")} | ${cliente.razonsocial} (${cliente.codigocliente})`);
      enviados++;

      // Pausa breve para no saturar la API de Mailgun
      await new Promise((r) => setTimeout(r, 300));

    } catch (err) {
      console.error(`❌ Error con cliente ${cliente.codigocliente}: ${err.message}`);
      errores++;
    }
  }

  console.log("\n━━━━━━━ Resumen ━━━━━━━");
  console.log(`✅ Enviados:   ${enviados}`);
  console.log(`💰 Sin deuda:  ${sinDeuda}`);
  console.log(`📭 Sin email:  ${sinEmail}`);
  console.log(`❌ Errores:    ${errores}`);
}

sendMasivoCuentaCorrienteEcobahia().catch(console.error);
