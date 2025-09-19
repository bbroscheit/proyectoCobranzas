// const limpiarClientesSinDeuda = async (listadoHoy, datosConDocumentos) => {
//   try {
//     const clientesValidados = [];

//     for (const cliente of listadoHoy.clientes) {
//       // Buscar el cliente en la estructura con documentos
//       const clienteConDocs = datosConDocumentos.clientes.find(
//         (c) => c.id === cliente.id
//       );

//       if (!clienteConDocs) continue;

//       const totalDeuda = clienteConDocs.documents.reduce(
//         (acc, doc) => acc + (parseFloat(doc.montopendiente) || 0),
//         0
//       );

//       if (totalDeuda > 0) {
//         // Mantener el cliente en la lista
//         clientesValidados.push(cliente);
//       } else {
//         console.log(
//           `🧹 Cliente ${cliente.id} removido de la lista (sin deuda pendiente)`
//         );
//       }
//     }

//     listadoHoy.clientes = clientesValidados;
//     await listadoHoy.update({ clientes: clientesValidados });
//   } catch (error) {
//     console.error(`❌ Error limpiando clientes sin deuda:`, error);
//   }
// };

// module.exports = limpiarClientesSinDeuda;

const limpiarClientesSinDeuda = async (listadoHoy, datosConDocumentos) => {
  console.log("🧼 Iniciando limpieza de clientes sin deuda...,",datosConDocumentos);
  try {
    const clientesValidados = [];

    for (const cliente of listadoHoy.clientes) {
      // Buscar cliente completo en datosConDocumentos
      const clienteConDocs = datosConDocumentos.clientes.find(                                                                                                                                                                
        (c) => c.id === cliente.id
      );

      console.log("🔍 Procesando cliente:", cliente);

      if (!clienteConDocs) continue;

      // Calcular deuda total
      const documentosConDeuda = clienteConDocs.documents.filter(
        (doc) => parseFloat(doc.montopendiente) > 0
      );

      const totalDeuda = documentosConDeuda.reduce(
        (acc, doc) => acc + parseFloat(doc.montopendiente || 0),
        0
      );

      if (totalDeuda > 0) {
        // Cliente enriquecido y estandarizado
        clientesValidados.push({
          id: clienteConDocs.id,
          name: clienteConDocs.name,
          cuit: clienteConDocs.cuit,
          contacto: clienteConDocs.contacto,
          deudaTotal: totalDeuda,
          documentos: documentosConDeuda.map((doc) => ({
            id: doc.id,
            numero: doc.numero || null,
            fecha: doc.fechadocumento || null,
            montopendiente: parseFloat(doc.montopendiente),
            diasVencido: doc.diasVencido || 0
          })),
          llamado: cliente.llamado || false
        });
      } else {
        console.log(`🧹 Cliente ${cliente.id} removido de la lista (sin deuda pendiente)`);
      }
    }

    // Actualizamos listado con los clientes enriquecidos
    listadoHoy.clientes = clientesValidados;
    await listadoHoy.update({ clientes: clientesValidados });

    return clientesValidados; // 👈 devuelve el array limpio y enriquecido
  } catch (error) {
    console.error(`❌ Error limpiando clientes sin deuda:`, error);
  }
};

module.exports = limpiarClientesSinDeuda;

