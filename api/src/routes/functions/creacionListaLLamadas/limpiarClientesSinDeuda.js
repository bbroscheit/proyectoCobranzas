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

      console.log("Procesando cliente:", cliente);

      if (!clienteConDocs) continue;

      let deudaTotal = 0;
      let deudaVencida = 0;
      let deudaNoVencida = 0;

      // Tipos que suman deuda: facturas (1), notas de débito (3)
      const TIPOS_DEUDA = [1, 3];
      // Tipos que restan deuda: notas de crédito (7, 8), recibos (9)
      const TIPOS_CREDITO = [7, 8, 9];

      const documentosConDeuda = clienteConDocs.documents.filter(
        (doc) => parseFloat(doc.montopendiente || 0) > 0
      );

      for (const doc of documentosConDeuda) {
        const monto = parseFloat(doc.montopendiente);
        const vencimiento = doc.fechavencimiento
          ? new Date(doc.fechavencimiento)
          : null;

        if (TIPOS_DEUDA.includes(doc.tipodocumento)) deudaTotal += monto;
        if (TIPOS_CREDITO.includes(doc.tipodocumento)) deudaTotal -= monto;

        // Clasificar deuda vencida / no vencida
        if (vencimiento) {
          if (vencimiento < hoy) deudaVencida += monto;
          else deudaNoVencida += monto;
        }
      }

      if (parseFloat(deudaTotal.toFixed(2)) !== 0) {
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
            numero: doc.numerodocumento || null,
            fecha: doc.fechadocumento || null,
            montopendiente: parseFloat(doc.montopendiente),
            diasVencido: doc.diasVencido || 0,
            fechavencimiento: doc.fechavencimiento || null,
            tipodocumento: doc.tipodocumento,
          })),
          llamado: cliente.llamado === true,
        });
      } else {
        console.log(
          `Cliente ${cliente.id} removido de la lista (sin deuda pendiente)`
        );
      }
    }

    // Deduplicar por id (por si entraron duplicados en pasos anteriores)
    const seen = new Set();
    const clientesUnicos = clientesValidados.filter(c => {
      if (seen.has(c.id)) return false;
      seen.add(c.id);
      return true;
    });

    // aplicar orden de dos niveles
    clientesUnicos.sort((a, b) => {
      if (b.deudaTotal !== a.deudaTotal) {
        return b.deudaTotal - a.deudaTotal;
      }
      return b.deudaNoVencida - a.deudaNoVencida;
    });

    // Actualizamos listado con los clientes enriquecidos y deduplicados
    listadoHoy.clientes = clientesUnicos;
    await listadoHoy.update({ clientes: clientesUnicos });

    return clientesUnicos;
  } catch (error) {
    console.error(`❌ Error limpiando clientes sin deuda:`, error);
  }
};

module.exports = limpiarClientesSinDeuda;
