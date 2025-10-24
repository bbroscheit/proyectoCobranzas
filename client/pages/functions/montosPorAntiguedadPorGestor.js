export function montosPorAntiguedadPorGestor(documentos, usuario) {
  
  const hoy = new Date();

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

  if (documentos === null || documentos === undefined) {
    return [0, 0, 0, 0, 0, 0, 0, 0];
  }

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

  documentos.forEach((cliente) => {
    const docs = cliente[includeAlias];

    if (!docs || docs.length === 0) return;

    docs.forEach((doc) => {
      const fechaVencimiento = new Date(doc.fechavencimiento);
      if (
        doc.tipodocumento === 1 ||
        doc.tipodocumento === 3 ||
        doc.tipodocumento === 7
      ) {
        if (doc.montopendiente > 0 && fechaVencimiento >= hoy) {
          totalSinVencer += doc.montopendiente;
        }
      }
    });
  });

  documentos.forEach((cliente) => {
    const docs = cliente[includeAlias];

    if (!docs || docs.length === 0) return;

    docs.forEach((doc) => {
      const fechaVencimiento = new Date(doc.fechavencimiento);
      if (
        doc.tipodocumento === 1 ||
        doc.tipodocumento === 3 ||
        doc.tipodocumento === 7
      ) {
        if (doc.montopendiente > 0 && fechaVencimiento < hoy) {
          const diasVencido = (hoy - fechaVencimiento) / (1000 * 60 * 60 * 24);

          if (diasVencido >= 1 && diasVencido <= 7) {
            resultado.hasta7Dias.monto += doc.montopendiente;
          } else if (diasVencido <= 15) {
            resultado.entre8y15Dias.monto += doc.montopendiente;
          } else if (diasVencido <= 30) {
            resultado.entre16y30Dias.monto += doc.montopendiente;
          } else if (diasVencido <= 60) {
            resultado.entre31y60Dias.monto += doc.montopendiente;
          } else if (diasVencido <= 90) {
            resultado.entre61y90Dias.monto += doc.montopendiente;
          } else if (diasVencido <= 120) {
            resultado.entre91y120Dias.monto += doc.montopendiente;
          } else {
            resultado.masDe121Dias.monto += doc.montopendiente;
          }
        }
      }
    });
  });

  const montos = [
    parseFloat(totalSinVencer.toFixed(2)), // Primer elemento: Total sin vencer
    ...Object.values(resultado).map(({ monto }) => {
      if (typeof monto === "number" && !isNaN(monto)) {
        return parseFloat(monto.toFixed(2));
      }
      return 0; // Asegura que siempre sea un número
    }),
  ];

  return montos;
}
