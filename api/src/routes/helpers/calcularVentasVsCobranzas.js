const calcularVentasVsCobranzas = (documentos) => {

  const meses = {};
  const hoy = new Date();
  hoy.setHours(0,0,0,0);

  const limite = new Date(hoy.getFullYear(), hoy.getMonth() - 11, 1);
  const claveAnteriores = "Anteriores";

  for (const doc of documentos) {

    if (![1,3,7,8].includes(doc.tipodocumento)) continue;

    const fecha = new Date(doc.fechadocumento);
    fecha.setHours(0,0,0,0);

    const fechaVenc = new Date(doc.fechavencimiento);
    fechaVenc.setHours(0,0,0,0);

    const signo = doc.tipodocumento === 8 ? -1 : 1;

    let mesKey = fecha < limite
      ? claveAnteriores
      : `${fecha.getMonth() + 1}/${fecha.getFullYear()}`;

    if (!meses[mesKey]) {
      meses[mesKey] = {
        facturasVencidas: 0,
        facturasPendientes: 0,
        facturasCobradas: 0,
      };
    }

    // Si es anterior al límite → solo interesa lo vencido
if (mesKey === claveAnteriores) {

  if (doc.montopendiente > 0 && fechaVenc < hoy) {
    meses[mesKey].facturasVencidas += signo * doc.montopendiente;
  }

} else {

  // COBRADAS
  if (doc.montopendiente === 0) {
    meses[mesKey].facturasCobradas += signo * doc.montooriginal;
  }

  // VENCIDAS
  else if (fechaVenc < hoy) {
    meses[mesKey].facturasVencidas += signo * doc.montopendiente;
  }

  // PENDIENTES
  else {
    meses[mesKey].facturasPendientes += signo * doc.montopendiente;
  }
}
  }

  const mesesOrdenados = Object.keys(meses).sort((a, b) => {

    if (a === claveAnteriores) return -1;
    if (b === claveAnteriores) return 1;

    const [ma, ya] = a.split("/");
    const [mb, yb] = b.split("/");

    return new Date(ya, ma - 1) - new Date(yb, mb - 1);
  });

  return {
    meses: mesesOrdenados,
    facturasVencidas: mesesOrdenados.map(m => meses[m].facturasVencidas),
    facturasNoVencidas: mesesOrdenados.map(m => meses[m].facturasPendientes),
    facturasCobradas: mesesOrdenados.map(m => meses[m].facturasCobradas),
  };
};

module.exports = calcularVentasVsCobranzas;


