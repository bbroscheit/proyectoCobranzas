
const { Documentecobahia, sequelize } = require('../../bd.js');
const { Op } = require('sequelize');
const getAllClients = require('../controllers/getAllClientsEcobahia.js');
const getAllDocuments = require('../controllers/getAllDocumentsEcobahia.js');
const { esDocumentoExcluido } = require('../helpers/documentosExcluidos.js');
const cerrarDocumentosAusentesEnGP = require('../helpers/cerrarDocumentosAusentesEnGP.js');

// Extrae la fecha como string YYYY-MM-DD usando UTC para evitar corrimiento
// de zona horaria: mssql devuelve fechas de GP como Date UTC.
function toUTCDateString(date) {
  if (!date) return null;
  const d = new Date(date);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

const fetchDocumentFromGPEcobahia =  async () => {
  const t = await sequelize.transaction();

  try {
    console.log('Sincronizando documentos GP → Postgres', new Date());

    // 1. Obtener documentos de GP
    const docs = (await getAllDocuments()).filter(d => !esDocumentoExcluido(d.NumeroDocumento));
    console.log(`Documentos obtenidos: ${docs.length}`);
    //console.log('Muestra de documento obtenido:', docs[0]);

    // 2. Obtener clientes de la BD
    const clientes = await getAllClients()
    console.log(`Clientes obtenidos: ${clientes.length}`);
    //console.log('Muestra de cliente obtenido:', clientes[0]);
    
    const mapClientes = new Set(clientes.map(c => String(c.id).trim()));
        
    // 3. Mapear documentos a formato de inserción
    const docsParaGuardar = docs
      .filter(d => mapClientes.has(String(d.NumeroCliente).trim()))
      .filter(d => {
        // Recibos (tipo 9) no llevan "P" en el nombre → siempre pasan
        if (parseInt(d.TipoDocumento) === 9) return true;
        // Los demás deben tener "P" en el nombre para ser documentos válidos (pasaron por impuestos)
        return String(d.NumeroDocumento).trim().includes("P");
      })
      .map(d => ({
        clientId: parseInt(String(d.NumeroCliente).trim(), 10),
        numerocliente: parseInt(String(d.NumeroCliente).trim(), 10),
        numerodocumento: d.NumeroDocumento.trim(),
        tipodocumento: parseInt(d.TipoDocumento),
        fechadocumento: toUTCDateString(d.FechaDocumento),
        montooriginal: parseFloat(d.MontoOriginal),
        montopendiente: parseFloat(d.MontoPendiente),
        fechavencimiento: toUTCDateString(d.FechaVencimiento),
       })); 

    console.log(`Documentos a guardar: ${docsParaGuardar.length}`);

    // //4. Guardar / Actualizar en bloque
    // if (docsParaGuardar.length > 0) {
    //   await Document.bulkCreate(docsParaGuardar, {
    //     updateOnDuplicate: [
    //       'montopendiente'],
    //     transaction: t
    //   })
    // } 
    if (docsParaGuardar.length > 0) {
      // Usamos ON CONFLICT para actualizar solo "montopendiente" si ya existe
    
        const query = `
        INSERT INTO "documentecobahia" 
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
    // 5. Saldo en 0 para los documentos que GP ya no devuelve.
    // Se compara contra todo lo que devuelve GP (no solo los que tienen "P") para no cerrar
    // documentos sin "P" importados antes del filtro que siguen abiertos en GP
    await cerrarDocumentosAusentesEnGP({ tabla: "documentecobahia", docsGP: docs, transaction: t, etiqueta: "Ecobahia" });

    // 6. Limpieza anual
    const hoy = new Date();
    if (hoy.getDate() === 1 && hoy.getMonth() === 0) {
      const cutoff = new Date(hoy.getFullYear() - 2, 0, 1);
      const deleted = await Documentecobahia.destroy({
        where: { fecha: { [Op.lt]: cutoff } },
        transaction: t
      });
      console.log(`Registros eliminados por limpieza anual: ${deleted}`);
    }

    await t.commit();
    console.log('Sincronización completada ✅ Ecobahia');
  } catch (err) {
    await t.rollback();
    console.error('Error en sincronización GP Ecobahia:', err);
  }
};

module.exports = fetchDocumentFromGPEcobahia