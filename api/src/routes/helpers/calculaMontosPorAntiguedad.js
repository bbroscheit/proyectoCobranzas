const calcularMontosPorAntiguedad = (documentos) => {
  //console.log("Calculando montos por antigüedad para documentos:", documentos);
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const rangos = [
    { min: -Infinity, max: 0 },   // < 0
    { min: 1, max: 7 },
    { min: 8, max: 15 },
    { min: 16, max: 30 },
    { min: 31, max: 60 },
    { min: 61, max: 90 },
    { min: 91, max: 120 },
    { min: 121, max: Infinity }, // +120
  ];

  const totales = Array(rangos.length).fill(0);

  for (const doc of documentos) {
    if (![1, 3, 7, 8].includes(doc.tipodocumento)) continue;
    if (doc.montopendiente <= 0) continue;

    const fechaVenc = new Date(doc.fechavencimiento);
    fechaVenc.setHours(0, 0, 0, 0);

    const dias = Math.floor(
      (hoy - fechaVenc) / (1000 * 60 * 60 * 24)
    );

    // 🔑 clave del cambio
    const signo = doc.tipodocumento === 8 ? -1 : 1;

    rangos.forEach((rango, index) => {
      if (dias >= rango.min && dias <= rango.max) {
        totales[index] += signo * doc.montopendiente;
      }
    });
  }

  return totales;
};

module.exports = calcularMontosPorAntiguedad;
