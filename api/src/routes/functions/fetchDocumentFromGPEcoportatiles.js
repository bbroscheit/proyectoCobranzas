const { Documentecoportatiles, sequelize } = require('../../bd.js');
const { Op } = require('sequelize');
const getAllClients = require('../controllers/getAllClientsEcoportatiles.js');
const getAllDocuments = require('../controllers/getAllDocumentsEcoportatiles.js');

const fetchDocumentFromGPEcoportatiles = async () => {
  const t = await sequelize.transaction();

  try {
    console.log('Sincronizando documentos GP → Postgres Ecoportatiles', new Date());

    const docs = await getAllDocuments();
    console.log(`Ecoportatiles - Documentos obtenidos: ${docs.length}`);

    const clientes = await getAllClients();
    if (!clientes || clientes.length === 0) {
      console.log('Ecoportatiles - No hay clientes, saltando sincronización de documentos');
      await t.commit();
      return;
    }
    console.log(`Ecoportatiles - Clientes obtenidos: ${clientes.length}`);

    const mapClientes = new Set(clientes.map(c => String(c.id).trim()));

    const docsParaGuardar = docs
      .filter(d => mapClientes.has(String(d.NumeroCliente).trim()))
      .map(d => ({
        clientId: parseInt(String(d.NumeroCliente).trim(), 10),
        numerocliente: parseInt(String(d.NumeroCliente).trim(), 10),
        numerodocumento: d.NumeroDocumento.trim(),
        tipodocumento: parseInt(d.TipoDocumento),
        fechadocumento: d.FechaDocumento,
        montooriginal: parseFloat(d.MontoOriginal),
        montopendiente: parseFloat(d.MontoPendiente),
        fechavencimiento: d.FechaVencimiento,
      }));

    console.log(`Ecoportatiles - Documentos a guardar: ${docsParaGuardar.length}`);

    if (docsParaGuardar.length > 0) {
      const query = `
        INSERT INTO "documentecoportatiles"
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
          "montooriginal" = EXCLUDED."montooriginal",
          "montopendiente" = EXCLUDED."montopendiente",
          "fechadocumento" = EXCLUDED."fechadocumento",
          "updatedAt" = NOW();
      `;

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

      await sequelize.query(query, { replacements, transaction: t });
    }

    const hoy = new Date();
    if (hoy.getDate() === 1 && hoy.getMonth() === 0) {
      const cutoff = new Date(hoy.getFullYear() - 2, 0, 1);
      const deleted = await Documentecoportatiles.destroy({
        where: { fecha: { [Op.lt]: cutoff } },
        transaction: t
      });
      console.log(`Ecoportatiles - Registros eliminados por limpieza anual: ${deleted}`);
    }

    await t.commit();
    console.log('Sincronización completada ✅ Ecoportatiles');
  } catch (err) {
    await t.rollback();
    console.error('Error en sincronización GP Ecoportatiles:', err);
  }
};

module.exports = fetchDocumentFromGPEcoportatiles;
