export async function calculaTotalesPorGestor(documentos) {

    if (documentos === null || documentos === undefined) {
      return {
        recibosMes: 0,
        facturasNoVencidas: 0,
        facturasVencidas: 0,
        facturasMes: 0,
      };
    }
    let gestor = "Belen Soria";

    // Obtener clientes del gestor
    const response = await fetch(`http://localhost:3001/clientsByGestor?gestor=${gestor}`);
    const clientes = await response.json();
    const clientesIds = clientes.map(cliente => cliente.id.toString().trim());
    //console.log("id de clientes calculaTotales", clientesIds);
    // Filtrar documentos por clientes del gestor
    const documentosFiltrados = documentos.filter(doc => clientesIds.includes(doc.NumeroCliente.trim()));
    
    //console.log("documentos filtrados", documentosFiltrados);
    const hoy = new Date();
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    const mesActual = hoy.getMonth();
    const anioActual = hoy.getFullYear();
  
    let recibosMesTotal = 0;
    let facturasNoVencidasTotal = 0;
    let facturasVencidasTotal = 0;
    let facturasMesTotal = 0;
  
    documentosFiltrados.forEach(doc => {
      const fechaDocumento = new Date(doc.FechaDocumento);
      const fechaVencimiento = new Date(doc.FechaVencimiento);
  
      // Tipo 9: Recibos
      if (doc.TipoDocumento === 9) {
        if (fechaDocumento >= inicioMes && fechaDocumento <= hoy) {
          recibosMesTotal += doc.MontoOriginal;
        }
      } else if (doc.TipoDocumento === 1 || doc.TipoDocumento === 3 || doc.TipoDocumento === 7) {
        // Tipo 1: Facturas; Tipo 2: Notas de débito/crédito
        if (doc.MontoPendiente > 0) {
          if (fechaVencimiento >= hoy) {
            // No vencidas
            facturasNoVencidasTotal += doc.MontoPendiente;
          } else {
            // Vencidas
            facturasVencidasTotal += doc.MontoPendiente;
          }
        }
        // Facturas creadas en el mes en curso
        if (fechaDocumento.getMonth() === mesActual && fechaDocumento.getFullYear() === anioActual) {
          facturasMesTotal += doc.MontoOriginal || 0;
        }
      }
    });
  
    return {
      recibosMes: parseFloat(recibosMesTotal.toFixed(2)),
      facturasNoVencidas: parseFloat(facturasNoVencidasTotal.toFixed(2)),
      facturasVencidas: parseFloat(facturasVencidasTotal.toFixed(2)),
      facturasMes: parseFloat(facturasMesTotal.toFixed(2)),
    };
  }