const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../../.env") });
const { Op } = require("sequelize");
const { Documentecobahia, Clientecobahia } = require("../../bd");
const estadoDeCuentaTemplate = require("../mailModels/estadoDeCuenta");
const { getConfigSucursal } = require("../mailModels/sucursalConfig");
const sendMailgunMessage = require("../helpers/getMailTransporter");
const { TIPOS_DEUDA } = require("../helpers/sucursalModels");

const CLIENT_ID   = 20123;
const TEST_EMAIL  = "bernardo.broscheit@gmail.com";

async function testMailEcobahia() {
  console.log(`🧪 Test mail Ecobahia — cliente ${CLIENT_ID} → ${TEST_EMAIL}`);

  const cliente = await Clientecobahia.findByPk(CLIENT_ID);
  if (!cliente) {
    console.error(`❌ Cliente ${CLIENT_ID} no encontrado en Postgres`);
    process.exit(1);
  }
  console.log(`Cliente: ${cliente.name} | Email real: ${cliente.email}`);

  const docs = await Documentecobahia.findAll({
    where: {
      clientId: CLIENT_ID,
      montopendiente: { [Op.gt]: 0 },
      tipodocumento: { [Op.in]: TIPOS_DEUDA },
    },
  });

  if (!docs.length) {
    console.log("⚠️  El cliente no tiene documentos con deuda pendiente");
    process.exit(0);
  }

  const facturas = docs.map((d) => {
    const doc = d.toJSON();
    return { ...doc, numero: doc.numerodocumento, fecha: doc.fechadocumento };
  });
  const deudaNeta = facturas.reduce((acc, d) => acc + parseFloat(d.montopendiente), 0);
  console.log(`Facturas encontradas: ${facturas.length} | Deuda neta: $${deudaNeta.toLocaleString("es-AR")}`);

  const config = getConfigSucursal(6);
  const html = estadoDeCuentaTemplate({
    clienteNombre: cliente.name,
    gestoraNombre: "",
    facturas,
    sucursalNombre: "Ecobahia",
    cuentas: config.cuentas,
    telefonos: config.telefonos,
  });

  await sendMailgunMessage({
    sucursal: 6,
    from: `"Ecobahia - Cobranzas" <${process.env.MAIL_USER_6}>`,
    to: TEST_EMAIL,
    subject: "[TEST] Estado de Cuenta — Ecobahia",
    html,
  });

  console.log(`✅ Mail de prueba enviado a ${TEST_EMAIL}`);
}

testMailEcobahia().catch(console.error);
