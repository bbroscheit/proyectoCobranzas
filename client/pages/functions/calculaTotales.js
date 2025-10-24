export function calculaTotales(documentos) {
  
  if (documentos === null || documentos === undefined) {
    return {
      recibosMes: 0,
      facturasNoVencidas: 0,
      facturasVencidas: 0,
      facturasMes: 0,
    };
  }

  const hoy = new Date();
  const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
  const mesActual = hoy.getMonth();
  const anioActual = hoy.getFullYear();

  let recibosMesTotal = 0;
  let facturasNoVencidasTotal = 0;
  let facturasVencidasTotal = 0;
  let facturasMesTotal = 0;

  documentos.forEach((doc) => {
      const fechaDocumento = new Date(doc.fechadocumento);
      const fechaVencimiento = new Date(doc.fechavencimiento);

      // Tipo 9: Recibos
      if (doc.tipodocumento === 9) {
        if (fechaDocumento >= inicioMes && fechaDocumento <= hoy) {
          recibosMesTotal += doc.montooriginal;
        }
      } else if (
        doc.tipodocumento === 1 ||
        doc.tipodocumento === 3 ||
        doc.tipodocumento === 7
      ) {
        // Tipo 1: Facturas; Tipo 2: Notas de débito/crédito
        if (doc.montopendiente > 0) {
          if (fechaVencimiento >= hoy) {
            // No vencidas
            facturasNoVencidasTotal += doc.montopendiente;
          } else {
            // Vencidas
            facturasVencidasTotal += doc.montopendiente;
          }
        }
        // Facturas creadas en el mes en curso
        if (
          fechaDocumento.getMonth() === mesActual &&
          fechaDocumento.getFullYear() === anioActual
        ) {
          facturasMesTotal += doc.montooriginal || 0;
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
