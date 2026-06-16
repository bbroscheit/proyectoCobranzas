const { Op } = require("sequelize");
const { Mailqueue } = require("../../../bd");
const { SUCURSAL_MODELS, TIPOS_DEUDA, TIPOS_CREDITO } = require("../../helpers/sucursalModels");
const estadoDeCuentaTemplate = require("../../mailModels/estadoDeCuenta");
const { getConfigSucursal } = require("../../mailModels/sucursalConfig");

/**
 * Encola emails de "Estado de Cuenta" para todos los clientes con deuda > 0.
 * Se ejecuta el día 5 de cada mes.
 */
const queueEstadoCuenta = async () => {
  console.log("📧 Iniciando queue de Estado de Cuenta...");
  const hoy = new Date().toISOString().split("T")[0]; // referenceDate = hoy

  let totalEncolados = 0;

  for (const sucursal of SUCURSAL_MODELS) {
    try {
      // Obtener todos los documentos con montopendiente > 0 de tipos de deuda
      const docs = await sucursal.docModel.findAll({
        where: {
          montopendiente: { [Op.gt]: 0 },
          tipodocumento: { [Op.in]: TIPOS_DEUDA },
        },
        attributes: ["clientId", "numerocliente", "numerodocumento", "fechadocumento", "fechavencimiento", "montopendiente", "tipodocumento"],
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

        // Verificar deuda neta positiva
        const deudaNeta = facturas.reduce((acc, d) => {
          if (TIPOS_DEUDA.includes(d.tipodocumento)) return acc + parseFloat(d.montopendiente);
          if (TIPOS_CREDITO.includes(d.tipodocumento)) return acc - parseFloat(d.montopendiente);
          return acc;
        }, 0);
        if (deudaNeta <= 0) continue;

        // Evitar duplicados: ya enviado hoy para este cliente+sucursal+tipo
        const yaEncolado = await Mailqueue.findOne({
          where: { clientId, sucursal: sucursal.id, tipo: "estadoCuenta", referenceDate: hoy },
        });
        if (yaEncolado) continue;

        // Obtener email del cliente
        const cliente = await sucursal.clientModel.findByPk(clientId, { attributes: ["id", "name", "email"] });
        if (!cliente?.email || cliente.email === "Sin asignar") continue;

        const config = getConfigSucursal(sucursal.id);
        const html = estadoDeCuentaTemplate({
          clienteNombre: cliente.name,
          gestoraNombre: "Área de Cobranzas",
          facturas,
          sucursalNombre: sucursal.nombre,
          cuentas: config.cuentas,
          telefono: config.telefono,
        });

        await Mailqueue.create({
          to: cliente.email,
          from: `"Cobranzas - ${sucursal.nombre}" <${process.env.MAIL_USER}>`,
          subject: `Estado de Cuenta - ${sucursal.nombre}`,
          html,
          tipo: "estadoCuenta",
          clientId,
          sucursal: sucursal.id,
          referenceDate: hoy,
          status: "pending",
        });

        totalEncolados++;
      }
    } catch (err) {
      console.error(`❌ Error procesando sucursal ${sucursal.id} en queueEstadoCuenta:`, err.message);
    }
  }

  console.log(`✅ queueEstadoCuenta: ${totalEncolados} emails encolados`);
};

module.exports = queueEstadoCuenta;
