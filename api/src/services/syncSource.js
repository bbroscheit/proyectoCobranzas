const dataSources = require("../config/dataSources");
const sequelize = require("../config/dataSources")._sequelize;

async function syncSource(source) {
  console.log("Sincronizando fuente:", source.name);
  
  const { name, clientModel, documentModel , getAllClients, getAllDocuments } = source;
  

  console.log(`⏳ [${name}] Iniciando sync → Postgres`, new Date());

  // 1) Traer clientes y documentos en paralelo y tolerante a fallos
  const [clientsRes, docsRes] = await Promise.allSettled([
    getAllClients(),
    getAllDocuments(),
  ]);

  console.log("Resultados de fetch:", { clientsRes });

  const clientes = clientsRes.status === "fulfilled" ? clientsRes.value : [];
  const documentos = docsRes.status === "fulfilled" ? docsRes.value : [];

  if (clientsRes.status === "rejected")
    console.error(`❌ [${name}] Error al traer clientes:`, clientsRes.reason);
  if (docsRes.status === "rejected")
    console.error(`❌ [${name}] Error al traer documentos:`, docsRes.reason);

  // Si no hay nada, no hacemos nada (pero no rompemos)
  if (!clientes.length && !documentos.length) {
    console.log(`⚠️ [${name}] No hay datos para guardar`);
    return { name, ok: true, savedClients: 0, savedDocs: 0 };
  }

  // 2) Guardar TODO en una transacción por fuente (aislada)
  const t = await sequelize.transaction();
  try {
    let savedClients = 0;
    let savedDocs = 0;

    if (clientes.length) {
      await clientModel.bulkCreate(clientes, {
        updateOnDuplicate: ["name", "gestor", "contacto1", "email"], // campos a actualizar
        transaction: t,
      });
      savedClients = clientes.length;
      console.log(`✅ [${name}] Clientes guardados: ${savedClients}`);
    }

    if (documentos.length) {
      await documentModel.bulkCreate(documentos, {
        updateOnDuplicate: [
          "numerodocumento",
          "fechadocumento",
          "fechavencimiento",
          "numerocliente",
          "montopendiente",
          "montooriginal",
          "tipodocumento",
          "clientId",
        ],
        transaction: t,
      });
      savedDocs = documentos.length;
      console.log(`✅ [${name}] Documentos guardados: ${savedDocs}`);
    }

    const hoy = new Date();
    if (hoy.getDate() === 1 && hoy.getMonth() === 0) {
      const cutoff = new Date(hoy.getFullYear() - 2, 0, 1);
      const deleted = await Document.destroy({
        where: { fecha: { [Op.lt]: cutoff } },
        transaction: t,
      });
      console.log(`Registros eliminados por limpieza anual: ${deleted}`);
    }

    await t.commit();
    return { name, ok: true, savedClients, savedDocs };
  } catch (err) {
    await t.rollback();
    console.error(`💥 [${name}] Error guardando en Postgres:`, err);
    // NO lanzamos para no romper el allSettled global
    return { name, ok: false, error: err.message };
  }
}

module.exports = syncSource;
