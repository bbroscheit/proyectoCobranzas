export function calculaSaldoDelMes(documentos) {
    const hoy = new Date();
    const mesActual = hoy.getMonth(); // Mes actual (0 = enero, 11 = diciembre)
    const anioActual = hoy.getFullYear(); // Año actual
  
    let saldoMes = 0;
  
    documentos.forEach(doc => {
      const fechaDocumento = new Date(doc.FechaDocumento);
  
      // Verificar si el documento pertenece al mes y año en curso
      if (fechaDocumento.getMonth() === mesActual && fechaDocumento.getFullYear() === anioActual) {
        if (doc.TipoDocumento === 1 || doc.TipoDocumento === 3) { 
          // Facturas (1) o Notas de débito (3) se suman
          saldoMes += doc.MontoOriginal || 0;
        } else if (doc.TipoDocumento === 2) { 
          // Notas de crédito (2) se restan
          saldoMes -= doc.MontoOriginal || 0;
        }
      }
    });
  
    // Redondear el saldo final a dos decimales
    return parseFloat(saldoMes.toFixed(2));
  }