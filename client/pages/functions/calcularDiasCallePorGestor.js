export const calcularDiasCallePorGestor = (facturas, usuario) => {
  if (!facturas || facturas.length === 0) {
    return 0;
  }

  let includeAlias;

  switch (usuario.sucursal) {
    case 1:
      includeAlias = "documento";
      break;
    case 2:
      includeAlias = "documentouruguay";
      break;
    case 3:
      includeAlias = "documentochile";
      break;
    // case 4:
    //   includeAlias = "documentorosario";
    //   break;
    case 5:
      includeAlias = "documentoecopatagonico";
      break;
    default:
      return;
  }

  const todasLasFacturas = facturas.flatMap(
    (cliente) => cliente[includeAlias] || []
  );

  // Filtramos facturas pendientes y quitamos documentos con TipoDocumento === 9
  const facturasPendientes = todasLasFacturas.filter(
    (factura) => factura.montopendiente > 0 && factura.tipodocumento !== 9
  );
  const totalPendiente = facturasPendientes.reduce(
    (sum, factura) => sum + factura.montopendiente,
    0
  );

  const fechaActual = new Date();
  const mesAnterior = new Date(
    fechaActual.getFullYear(),
    fechaActual.getMonth() - 1,
    1
  );
  const diasMesAnterior = new Date(
    fechaActual.getFullYear(),
    fechaActual.getMonth(),
    0
  ).getDate();

  // Filtramos facturas del mes anterior y quitamos documentos con TipoDocumento === 9
  const facturasMesAnterior = todasLasFacturas.filter((factura) => {
    const fechaFactura = new Date(factura.fechadocumento);
    return (
      fechaFactura.getMonth() === mesAnterior.getMonth() &&
      fechaFactura.getFullYear() === mesAnterior.getFullYear() &&
      factura.tipodocumento !== 9
    );
  });

  // Calcular la facturación total del mes anterior
  const totalFacturacionMesAnterior = facturasMesAnterior.reduce(
    (sum, factura) => sum + factura.montooriginal,
    0
  );

  // Calcular el promedio diario de facturación del mes anterior
  const promedioDiarioFacturacionMesAnterior =
    totalFacturacionMesAnterior / diasMesAnterior;

  // Calcular los días calle
  const diasCalle = totalPendiente / promedioDiarioFacturacionMesAnterior;
  console.log("totalPendiente:", totalPendiente);

  return diasCalle.toFixed(2);
};
