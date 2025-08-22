const getAllDocuments = require('../controllers/getAllDocuments.js');
const { Document, sequelize } = require('../../bd.js');
const { Op } = require('sequelize');
const getAllClients = require('../controllers/getAllClients.js');

const fetchDocumentFromGP =  async () => {
  const t = await sequelize.transaction();

  try {
    console.log('Sincronizando documentos GP → Postgres', new Date());

    // 1. Obtener documentos de GP
    const docs = await getAllDocuments();
    console.log(`Documentos obtenidos: ${docs.length}`);
    //console.log('Muestra de documento obtenido:', docs[0]);

    // 2. Obtener clientes de la BD
    const clientes = await getAllClients()
    console.log(`Clientes obtenidos: ${clientes.length}`);
    //console.log('Muestra de cliente obtenido:', clientes[0]);
    
    // const mapClientes = new Map(clientes.map(c => [ c.id]));

    //const mapClientes = new Set(clientes.map(c => c.id));
    const mapClientes = new Set(clientes.map(c => String(c.id).trim()));

    //console.log(`Clientes mapeados: ${mapClientes.size}`);
    // 3. Mapear documentos a formato de inserción
    const docsParaGuardar = docs
      //.filter(d => mapClientes.has(d.NumeroCliente)) // solo clientes que existen
      .filter(d => mapClientes.has(String(d.NumeroCliente).trim()))
      .map(d => ({
         clientId: parseInt(String(d.NumeroCliente).trim(), 10),
        numerocliente: parseInt(String(d.NumeroCliente).trim(), 10),
        numerodocumento: d.NumeroDocumento,
        tipodocumento: parseInt(d.TipoDocumento),
        fechadocumento: d.FechaDocumento,
        montooriginal: parseFloat(d.MontoOriginal),
        montopendiente: parseFloat(d.MontoPendiente),
        fechavencimiento: d.FechaVencimiento,
       })); 

    console.log(`Documentos a guardar: ${docsParaGuardar.length}`);

    //4. Guardar / Actualizar en bloque
    if (docsParaGuardar.length > 0) {
      await Document.bulkCreate(docsParaGuardar, {
        updateOnDuplicate: [
          'numerodocumento',
          'fechadocumento',
          'fechavencimiento',
          'numerocliente',
          'montopendiente',
          'montooriginal',
          'tipodocumento',
          'clientId',],
        transaction: t
      });
    }

//     for (const doc of docsParaGuardar) {
//   try {
//     await Document.create(doc, { transaction: t });
//   } catch (err) {
//     console.error('Error al guardar documento:', doc, err);
//     // Puedes decidir si quieres continuar o abortar aquí
//   }
// }

    // 5. Limpieza anual
    const hoy = new Date();
    if (hoy.getDate() === 1 && hoy.getMonth() === 0) {
      const cutoff = new Date(hoy.getFullYear() - 2, 0, 1);
      const deleted = await Document.destroy({
        where: { fecha: { [Op.lt]: cutoff } },
        transaction: t
      });
      console.log(`Registros eliminados por limpieza anual: ${deleted}`);
    }

    await t.commit();
    console.log('Sincronización completada ✅');
  } catch (err) {
    await t.rollback();
    console.error('Error en sincronización GP:', err);
  }
};

module.exports = fetchDocumentFromGP