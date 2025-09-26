const limpiarClientesSinDeuda = async (listadoHoy, datosConDocumentos) => {
  console.log(
    "Iniciando limpieza de clientes sin deuda...,",
    datosConDocumentos
  );
  try {
    const clientesValidados = [];
    const hoy = new Date();

    for (const cliente of listadoHoy.clientes) {
      // Buscar cliente completo en datosConDocumentos
      const clienteConDocs = datosConDocumentos.clientes.find(
        (c) => c.id === cliente.id
      );

      console.log("🔍 Procesando cliente:", cliente);

      if (!clienteConDocs) continue;

      let deudaTotal = 0;
      let deudaVencida = 0;
      let deudaNoVencida = 0;

      const documentosConDeuda = clienteConDocs.documents.filter(
        (doc) => parseFloat(doc.montopendiente || 0) > 0
      );

      for (const doc of documentosConDeuda) {
        const monto = parseFloat(doc.montopendiente);
        const vencimiento = doc.fechavencimiento
          ? new Date(doc.fechavencimiento)
          : null;

        // Ajuste total según tipo de documento
        if (doc.tipodocumento === 1) deudaTotal += monto; 
        if (doc.tipodocumento === 9) deudaTotal -= monto; 

        // Clasificar deuda vencida / no vencida
        if (vencimiento) {
          if (vencimiento < hoy) deudaVencida += monto;
          else deudaNoVencida += monto;
        }
      }

      if (deudaTotal !== 0) {
        clientesValidados.push({
          id: clienteConDocs.id,
          name: clienteConDocs.name,
          cuit: clienteConDocs.cuit,
          contacto: clienteConDocs.contacto,
          email:clienteConDocs.email,
          deudaTotal,
          deudaVencida,
          deudaNoVencida,
          documentos: documentosConDeuda.map((doc) => ({
            id: doc.id,
            numero: doc.numero || null,
            fecha: doc.fechadocumento || null,
            montopendiente: parseFloat(doc.montopendiente),
            diasVencido: doc.diasVencido || 0,
            tipodocumento: doc.tipodocumento,
          })),
          llamado: false,
        });
      } else {
        console.log(
          `Cliente ${cliente.id} removido de la lista (sin deuda pendiente)`
        );
      }
    }

    // aplicar orden de dos niveles
    clientesValidados.sort((a, b) => {
      if (b.deudaTotal !== a.deudaTotal) {
        return b.deudaTotal - a.deudaTotal;
      }
      return b.deudaNoVencida - a.deudaNoVencida;
    });

    // Actualizamos listado con los clientes enriquecidos
    listadoHoy.clientes = clientesValidados;
    await listadoHoy.update({ clientes: clientesValidados });

    return clientesValidados; // 👈 devuelve el array limpio y enriquecido
  } catch (error) {
    console.error(`❌ Error limpiando clientes sin deuda:`, error);
  }
};

module.exports = limpiarClientesSinDeuda;
