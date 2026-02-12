// const calcularDiasCalle = (documentos) => {
//   const hoy = new Date();

//   let totalPonderado = 0;
//   let totalMonto = 0;

//   for (const doc of documentos) {
//     if (![1, 3, 7, 8].includes(doc.tipodocumento)) continue;
//     if (doc.montopendiente <= 0) continue;

//     const fechaVenc = new Date(doc.fechavencimiento);
//     const dias = Math.floor(
//       (hoy - fechaVenc) / (1000 * 60 * 60 * 24)
//     );

//     if (dias <= 0) continue; // solo vencidas

//     const signo = doc.tipodocumento === 8 ? -1 : 1;

//     totalPonderado += signo * dias * doc.montopendiente;
//     totalMonto += signo * doc.montopendiente;
//   }

//   if (totalMonto === 0) return 0;

//   return Math.round(totalPonderado / totalMonto);
// };

// module.exports = calcularDiasCalle;

const calcularDiasCalle = (documentos) => {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const inicioMesActual = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
  const inicioMesAnterior = new Date(hoy.getFullYear(), hoy.getMonth() - 1, 1);
  const finMesAnterior = new Date(hoy.getFullYear(), hoy.getMonth(), 0);

  let cuentasPorCobrar = 0;
  let ventasMesAnterior = 0;

  for (const doc of documentos) {
    const fechaDoc = new Date(doc.fechadocumento);
    fechaDoc.setHours(0,0,0,0);

    
    // Cuentas por cobrar actuales
    
    if ([1,3,7,8].includes(doc.tipodocumento) && doc.montopendiente > 0) {
      const signo = doc.tipodocumento === 8 ? -1 : 1;
      cuentasPorCobrar += signo * doc.montopendiente;
    }

   
    // Ventas del mes anterior
   
    if (
      [1,3,7,8].includes(doc.tipodocumento) &&
      fechaDoc >= inicioMesAnterior &&
      fechaDoc <= finMesAnterior
    ) {
      const signo = doc.tipodocumento === 8 ? -1 : 1;
      ventasMesAnterior += signo * doc.montooriginal;
    }
  }

  const ventasDiariasPromedio = ventasMesAnterior / 30;

  const dias = ventasDiariasPromedio > 0
    ? cuentasPorCobrar / ventasDiariasPromedio
    : 0;

  return {
    dias: Math.round(dias),
    cuentasPorCobrar,
    ventasMesAnterior,
    ventasDiariasPromedio
  };
};

module.exports = calcularDiasCalle;


