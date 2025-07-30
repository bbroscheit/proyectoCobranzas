export const calcularDiasCallePorGestor = async (facturas) => {
    let gestor = "Belen Soria" // se hardcodea para tener resultados pero luego se cambiara
    
    // Obtener clientes del gestor
    const response = await fetch(`http://${process.env.NEXT_PUBLIC_LOCALHOST}:3001/clientsByGestor?gestor=${gestor}`);
    const clientes = await response.json();
    const clientesIds = clientes.map(cliente => cliente.id.toString().trim());
    
    // Filtramos facturas que pertenezcan a los clientes que obtuvimos
    const facturasFiltradas = facturas.filter(factura => clientesIds.includes(factura.NumeroCliente.trim()));
    
    // Filtramos facturas pendientes y quitamos documentos con TipoDocumento === 9
    const facturasPendientes = facturasFiltradas.filter(factura => factura.MontoPendiente > 0 && factura.TipoDocumento !== 9)
    const totalPendiente = facturasPendientes.reduce((sum, factura) => sum + factura.MontoPendiente, 0);
  
    const fechaActual = new Date();
    const mesAnterior = new Date(fechaActual.getFullYear(), fechaActual.getMonth() - 1, 1);
    const diasMesAnterior = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 0).getDate();
    
    // Filtramos facturas del mes anterior y quitamos documentos con TipoDocumento === 9
    const facturasMesAnterior = facturas.filter(factura => {
      const fechaFactura = new Date(factura.FechaDocumento);
      return fechaFactura.getMonth() === mesAnterior.getMonth() && 
                fechaFactura.getFullYear() === mesAnterior.getFullYear() &&
                    factura.TipoDocumento !== 9;
    });
  
    // Calcular la facturación total del mes anterior
  const totalFacturacionMesAnterior = facturasMesAnterior.reduce((sum, factura) => sum + factura.MontoOriginal, 0);

  // Calcular el promedio diario de facturación del mes anterior
  const promedioDiarioFacturacionMesAnterior = totalFacturacionMesAnterior / diasMesAnterior;

  // Calcular los días calle
  const diasCalle = totalPendiente / promedioDiarioFacturacionMesAnterior;

  return diasCalle.toFixed(2);
  };