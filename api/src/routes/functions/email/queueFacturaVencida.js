const { Op } = require("sequelize");
const { Mailqueue } = require("../../../bd");
const { SUCURSAL_MODELS, TIPOS_DEUDA } = require("../../helpers/sucursalModels");
const facturaVencidaTemplate = require("../../mailModels/facturaVencida");

/**
 * Encola emails de "Factura Vencida" para facturas cuyo vencimiento fue ayer.
 * Un solo email por cliente agrupando todas las facturas que vencieron ayer.
 * Se ejecuta diariamente.
 */
const queueFacturaVencida = async () => {
  console.log("📧 Iniciando queue de Factura Vencida...");

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const referenceDate = hoy.toISOString().split("T")[0];

  const ayer = new Date(hoy);
  ayer.setDate(ayer.getDate() - 1);
  const ayerStr = ayer.toISOString().split("T")[0];

  let totalEncolados = 0;

  for (const sucursal of SUCURSAL_MODELS) {
    try {
      // Facturas cuyo vencimiento fue ayer con montopendiente > 0
      const docs = await sucursal.docModel.findAll({
        where: {
          fechavencimiento: ayerStr,
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
          where: { clientId, sucursal: sucursal.id, tipo: "facturaVencida", referenceDate },
        });
        if (yaEncolado) continue;

        const cliente = await sucursal.clientModel.findByPk(clientId, { attributes: ["id", "name", "email"] });
        if (!cliente?.email || cliente.email === "Sin asignar") continue;

        const html = facturaVencidaTemplate({
          clienteNombre: cliente.name,
          gestoraNombre: "Área de Cobranzas",
          facturas,
          sucursalNombre: sucursal.nombre,
        });

        await Mailqueue.create({
          to: cliente.email,
          from: `"Cobranzas - ${sucursal.nombre}" <${process.env.MAIL_USER}>`,
          subject: `Aviso de Factura Vencida - ${sucursal.nombre}`,
          html,
          tipo: "facturaVencida",
          clientId,
          sucursal: sucursal.id,
          referenceDate,
          status: "pending",
        });

        totalEncolados++;
      }
    } catch (err) {
      console.error(`❌ Error procesando sucursal ${sucursal.id} en queueFacturaVencida:`, err.message);
    }
  }

  console.log(`✅ queueFacturaVencida: ${totalEncolados} emails encolados`);
};

module.exports = queueFacturaVencida;
