export function montosPorAntiguedad(facturas) {
  const hoy = new Date();
  
  if (facturas === null){
    return [0,0,0,0,0,0,0,0]
  };

  const resultado = {
    hasta7Dias: { monto: 0 },
    entre8y15Dias: { monto: 0 },
    entre16y30Dias: { monto: 0 },
    entre31y60Dias: { monto: 0 },
    entre61y90Dias: { monto: 0 },
    entre91y120Dias: { monto: 0 },
    masDe121Dias: { monto: 0 },
  };

  let totalSinVencer = 0;

  facturas.forEach(doc => {
    const fechaVencimiento = new Date(doc.FechaVencimiento);
    if (doc.TipoDocumento === 1 || doc.TipoDocumento === 3 || doc.TipoDocumento === 7) {
      if (doc.MontoPendiente > 0 && fechaVencimiento >= hoy) {
        totalSinVencer += doc.MontoPendiente;
      }
    }
  });

  // Luego, procesar las facturas vencidas
  facturas.forEach(doc => {
    const fechaVencimiento = new Date(doc.FechaVencimiento);
    if (doc.TipoDocumento === 1 || doc.TipoDocumento === 3 || doc.TipoDocumento === 7) {
      if (doc.MontoPendiente > 0 && fechaVencimiento < hoy) {
        const diasVencido = (hoy - fechaVencimiento) / (1000 * 60 * 60 * 24);

        if (diasVencido >= 1 && diasVencido <= 7) {
          resultado.hasta7Dias.monto += doc.MontoPendiente;
        } else if (diasVencido <= 15) {
          resultado.entre8y15Dias.monto += doc.MontoPendiente;
        } else if (diasVencido <= 30) {
          resultado.entre16y30Dias.monto += doc.MontoPendiente;
        } else if (diasVencido <= 60) {
          resultado.entre31y60Dias.monto += doc.MontoPendiente;
        } else if (diasVencido <= 90) {
          resultado.entre61y90Dias.monto += doc.MontoPendiente;
        } else if (diasVencido <= 120) {
          resultado.entre91y120Dias.monto += doc.MontoPendiente;
        } else {
          resultado.masDe121Dias.monto += doc.MontoPendiente;
        }
      }
    }
  });

  //console.log("Contenido de resultado antes del mapeo:", resultado);

  const montos = [
    parseFloat(totalSinVencer.toFixed(2)), // Primer elemento: Total sin vencer
    ...Object.values(resultado).map(({ monto }) => {
      if (typeof monto === "number" && !isNaN(monto)) {
        return parseFloat(monto.toFixed(2));
      }
      return 0; // Asegura que siempre sea un número
    })
  ];

  return montos;
  
}
