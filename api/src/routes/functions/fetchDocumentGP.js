const getAllDocuments = require("../controllers/getAllDocuments.js");
const { Document, sequelize } = require("../../bd.js");
const { Op } = require("sequelize");
const getAllClients = require("../controllers/getAllClients.js");

const fetchDocumentFromGP = async () => {
  const t = await sequelize.transaction();

  try {
    console.log("Sincronizando documentos GP → Postgres", new Date());

    // 1. Obtener documentos de GP
    const docs = await getAllDocuments();
    console.log(`Documentos obtenidos: ${docs.length}`);
    //console.log('Muestra de documento obtenido:', docs[0]);

    // 2. Obtener clientes de la BD
    const clientes = await getAllClients();
    console.log(`Clientes obtenidos: ${clientes.length}`);
    //console.log('Muestra de cliente obtenido:', clientes[0]);

    const mapClientes = new Set(clientes.map((c) => String(c.id).trim()));

    // 3. Mapear documentos a formato de inserción
    const docsParaGuardar = docs
      .filter((d) => mapClientes.has(String(d.NumeroCliente).trim()))
      .map((d) => ({
        clientId: parseInt(String(d.NumeroCliente).trim(), 10),
        numerocliente: parseInt(String(d.NumeroCliente).trim(), 10),
        numerodocumento: d.NumeroDocumento.trim(),
        tipodocumento: parseInt(d.TipoDocumento),
        fechadocumento: d.FechaDocumento.toISOString().slice(0, 10),
        montooriginal: parseFloat(d.MontoOriginal),
        montopendiente: parseFloat(d.MontoPendiente),
        fechavencimiento: d.FechaVencimiento.toISOString().slice(0, 10),
      }));

    console.log(`Documentos a guardar: ${docsParaGuardar.length}`);

    if (docsParaGuardar.length > 0) {
      // Usamos ON CONFLICT para actualizar solo "montopendiente" si ya existe
      const query = `
        INSERT INTO "Document" 
          ("clientId", "numerocliente", "numerodocumento", "tipodocumento", "fechadocumento", 
           "montooriginal", "montopendiente", "fechavencimiento", "createdAt", "updatedAt")
        VALUES ${docsParaGuardar
          .map(
            (_, i) =>
              `(:clientId${i}, :numerocliente${i}, :numerodocumento${i}, :tipodocumento${i}, :fechadocumento${i}, 
            :montooriginal${i}, :montopendiente${i}, :fechavencimiento${i}, NOW(), NOW())`
          )
          .join(",")}
        ON CONFLICT ("numerodocumento", "clientId")
        DO UPDATE SET
          "montopendiente" = EXCLUDED."montopendiente",
          "fechadocumento" = EXCLUDED."fechadocumento",
          "updatedAt" = NOW();
      `;

      // Generamos un objeto de reemplazo con los valores
      const replacements = {};
      docsParaGuardar.forEach((d, i) => {
        replacements[`clientId${i}`] = d.clientId;
        replacements[`numerocliente${i}`] = d.numerocliente;
        replacements[`numerodocumento${i}`] = d.numerodocumento;
        replacements[`tipodocumento${i}`] = d.tipodocumento;
        replacements[`fechadocumento${i}`] = d.fechadocumento;
        replacements[`montooriginal${i}`] = d.montooriginal;
        replacements[`montopendiente${i}`] = d.montopendiente;
        replacements[`fechavencimiento${i}`] = d.fechavencimiento;
      });

      await sequelize.query(query, {
        replacements,
        transaction: t,
      });
    }
    // 5. Limpieza anual
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
    console.log("Sincronización completada ✅");
  } catch (err) {
    await t.rollback();
    console.error("Error en sincronización GP:", err);
  }
};

module.exports = fetchDocumentFromGP;
