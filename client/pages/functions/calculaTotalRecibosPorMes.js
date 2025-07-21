export function calculaTotalRecibosPorMes(documentos) {
    if(documentos === null || documentos === undefined){
        return [0,0,0,0,0,0,0,0,0,0,0,0,0]
    }
    const hoy = new Date();
    const anioActual = hoy.getFullYear();
    const meses = Array(13).fill(0); // 13 posiciones: índice 0 = diciembre del año pasado, índice 12 = diciembre del año actual
  
    documentos.forEach(doc => {
      if (doc.TipoDocumento === 9) { 
        const fechaDocumento = new Date(doc.FechaDocumento);
        const mes = fechaDocumento.getMonth(); // 0 = enero, 11 = diciembre
        const anio = fechaDocumento.getFullYear();
  
        if (anio === anioActual - 1 && mes === 11) {
          // Diciembre del año pasado
          meses[0] += doc.MontoOriginal || 0;
        } else if (anio === anioActual) {
          // Meses del año actual (enero a diciembre)
          meses[mes + 1] += doc.MontoOriginal || 0;
        }
      }
    });
  
    
    return meses.map(total => parseFloat(total.toFixed(2)));
  }