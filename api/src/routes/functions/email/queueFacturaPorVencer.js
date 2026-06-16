const { Op } = require("sequelize");
const { Mailqueue } = require("../../../bd");
const { SUCURSAL_MODELS, TIPOS_DEUDA } = require("../../helpers/sucursalModels");
const facturaPorVencerTemplate = require("../../mailModels/facturaPorVencer");
const { getConfigSucursal } = require("../../mailModels/sucursalConfig");

/**
 * Encola emails de "Factura Por Vencer" para facturas que vencen en exactamente 3 días.
 * Un solo email por cliente agrupando todas las facturas que cumplen la condición.
 * Se ejecuta diariamente.
 */
const queueFacturaPorVencer = async () => {
  console.log("📧 Iniciando queue de Factura Por Vencer...");

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const referenceDate = hoy.toISOString().split("T")[0];

  const en3dias = new Date(hoy);
  en3dias.setDate(en3dias.getDate() + 3);
  const en3diasStr = en3dias.toISOString().split("T")[0];

  let totalEncolados = 0;

  for (const sucursal of SUCURSAL_MODELS) {
    try {
      // Facturas que vencen exactamente en 3 días con montopendiente > 0
      const docs = await sucursal.docModel.findAll({
        where: {
          fechavencimiento: en3diasStr,
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
          where: { clientId, sucursal: sucursal.id, tipo: "facturaPorVencer", referenceDate },
        });
        if (yaEncolado) continue;

        const cliente = await sucursal.clientModel.findByPk(clientId, { attributes: ["id", "name", "email"] });
        if (!cliente?.email || cliente.email === "Sin asignar") continue;

        const config = getConfigSucursal(sucursal.id);
        const html = facturaPorVencerTemplate({
          facturas,
          sucursalNombre: sucursal.nombre,
          cuentas: config.cuentas,
          telefono: config.telefono,
        });

        await Mailqueue.create({
          to: cliente.email,
          from: `"Cobranzas - ${sucursal.nombre}" <${process.env.MAIL_USER}>`,
          subject: `Aviso: Factura Próxima a Vencer - ${sucursal.nombre}`,
          html,
          tipo: "facturaPorVencer",
          clientId,
          sucursal: sucursal.id,
          referenceDate,
          status: "pending",
        });

        totalEncolados++;
      }
    } catch (err) {
      console.error(`❌ Error procesando sucursal ${sucursal.id} en queueFacturaPorVencer:`, err.message);
    }
  }

  console.log(`✅ queueFacturaPorVencer: ${totalEncolados} emails encolados`);
};

module.exports = queueFacturaPorVencer;
