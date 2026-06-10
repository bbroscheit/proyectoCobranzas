const { Op } = require("sequelize");
const { Mailqueue } = require("../../../bd");
const { SUCURSAL_MODELS, TIPOS_DEUDA } = require("../../helpers/sucursalModels");
const facturaEmitidaTemplate = require("../../mailModels/facturaEmitida");

/**
 * Encola emails de "Factura Emitida" para clientes cuyas facturas se emitieron ayer.
 * Un solo email por cliente agrupando todas las facturas emitidas ayer.
 * Se ejecuta diariamente.
 */
const queueFacturaEmitida = async () => {
  console.log("📧 Iniciando queue de Factura Emitida...");

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const referenceDate = hoy.toISOString().split("T")[0];

  const ayer = new Date(hoy);
  ayer.setDate(ayer.getDate() - 1);
  const ayerStr = ayer.toISOString().split("T")[0];

  let totalEncolados = 0;

  for (const sucursal of SUCURSAL_MODELS) {
    try {
      // Facturas emitidas ayer con montopendiente > 0
      const docs = await sucursal.docModel.findAll({
        where: {
          fechadocumento: ayerStr,
          montopendiente: { [Op.gt]: 0 },
          tipodocumento: { [Op.in]: TIPOS_DEUDA },
        },
        attributes: ["clientId", "numerodocumento", "fechadocumento", "fechavencimiento", "montopendiente", "tipodocumento"],
      });

      if (!docs.length) continue;

      // Agrupar por clientId
      const porCliente = {};
      for (const doc of docs) {
        const cid = doc.clientId;
        if (!porCliente[cid]) porCliente[cid] = [];
        porCliente[cid].push(doc.toJSON());
      }

      for (const [clientIdStr, facturas] of Object.entries(porCliente)) {
        const clientId = parseInt(clientIdStr, 10);

        const yaEncolado = await Mailqueue.findOne({
          where: { clientId, sucursal: sucursal.id, tipo: "facturaEmitida", referenceDate },
        });
        if (yaEncolado) continue;

        const cliente = await sucursal.clientModel.findByPk(clientId, { attributes: ["id", "name", "email"] });
        if (!cliente?.email || cliente.email === "Sin asignar") continue;

        const html = facturaEmitidaTemplate(facturas, sucursal.nombre);

        await Mailqueue.create({
          to: cliente.email,
          from: `"Cobranzas - ${sucursal.nombre}" <${process.env.MAIL_USER}>`,
          subject: `Nueva Factura Emitida - ${sucursal.nombre}`,
          html,
          tipo: "facturaEmitida",
          clientId,
          sucursal: sucursal.id,
          referenceDate,
          status: "pending",
        });

        totalEncolados++;
      }
    } catch (err) {
      console.error(`❌ Error procesando sucursal ${sucursal.id} en queueFacturaEmitida:`, err.message);
    }
  }

  console.log(`✅ queueFacturaEmitida: ${totalEncolados} emails encolados`);
};

module.exports = queueFacturaEmitida;
