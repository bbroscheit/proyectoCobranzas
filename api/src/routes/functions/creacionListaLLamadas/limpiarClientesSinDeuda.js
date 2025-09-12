// Limpia de la lista de hoy los clientes que ya no tienen deuda
const limpiarClientesSinDeuda = async (listadoHoy, datosConDocumentos) => {
  try {
    const clientesValidados = [];

    for (const cliente of listadoHoy.clientes) {
      // Buscar el cliente en la estructura con documentos
      const clienteConDocs = datosConDocumentos.clientes.find(
        (c) => c.id === cliente.id
      );

      if (!clienteConDocs) continue;

      const totalDeuda = clienteConDocs.documents.reduce(
        (acc, doc) => acc + (parseFloat(doc.montopendiente) || 0),
        0
      );

      if (totalDeuda > 0) {
        // Mantener el cliente en la lista
        clientesValidados.push(cliente);
      } else {
        console.log(
          `🧹 Cliente ${cliente.id} removido de la lista (sin deuda pendiente)`
        );
      }
    }

    listadoHoy.clientes = clientesValidados;
    await listadoHoy.update({ clientes: clientesValidados });
  } catch (error) {
    console.error(`❌ Error limpiando clientes sin deuda:`, error);
  }
};

module.exports = limpiarClientesSinDeuda;
