export const calcularDiasCalle = (facturas) => {
    // Filtramos facturas pendientes y quitamos documentos con TipoDocumento === 9
    const facturasPendientes = facturas.filter(factura => factura.MontoPendiente > 0 && factura.TipoDocumento !== 9)
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