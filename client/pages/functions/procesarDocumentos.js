export function procesarDocumentos(documentos) {
    //console.log("procesar documentos :", documentos)
    if (documentos === null ){
       return {
            recibosMes: {
              cantidad: 0,
              total: 0,
            },
            facturasNoVencidas: {
              cantidad: 0,
              total: 0,
            },
            facturasVencidas: {
              cantidad: 0,
              total: 0,
            },
          };
    }
       

    // Obtener fecha actual y el primer día del mes actual
    const ahora = new Date();
    const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
  
    let recibosMesCantidad = 0;
    let recibosMesTotal = 0;
    let facturasNoVencidasCantidad = 0;
    let facturasNoVencidasTotal = 0;
    let facturasVencidasCantidad = 0;
    let facturasVencidasTotal = 0;
  
    documentos.forEach(doc => {
      //const fechaDocumento = new Date(doc.FechaDocumento);
      //const fechaVencimiento = new Date(doc.FechaVencimiento);

      const fechaDocumento = new Date(doc.fechadocumento);
      const fechaVencimiento = new Date(doc.fechavencimiento);

      // Tipo 9: Recibos
      //8if (doc.TipoDocumento === 9) { 
      if (doc.tipodocumento === 9) { 
        if (fechaDocumento >= inicioMes && fechaDocumento <= ahora) {
          recibosMesCantidad++;
          //recibosMesTotal += doc.MontoOriginal;
          recibosMesTotal += doc.montooriginal;
        }
      //} else if (doc.TipoDocumento === 1 || doc.TipoDocumento === 3 || doc.TipoDocumento === 7) { 
      } else if (doc.tipodocumento === 1 || doc.tipodocumento === 3 || doc.tipodocumento === 7) { 
        // Tipo 1: Facturas; Tipo 2: Notas de débito/crédito
        //if (doc.MontoPendiente > 0) { 
        if (doc.montopendiente > 0) { 
          if (fechaVencimiento >= ahora) {
            // No vencidas
            facturasNoVencidasCantidad++;
            //facturasNoVencidasTotal += doc.MontoPendiente;
            facturasNoVencidasTotal += doc.montopendiente;
          } else {
            // Vencidas
            facturasVencidasCantidad++;
            //facturasVencidasTotal += doc.MontoPendiente;
            facturasVencidasTotal += doc.montopendiente;
          }
        }
      }
    });
  
    return {
      recibosMes: {
        cantidad: recibosMesCantidad,
        total: recibosMesTotal,
      },
      facturasNoVencidas: {
        cantidad: facturasNoVencidasCantidad,
        total: facturasNoVencidasTotal,
      },
      facturasVencidas: {
        cantidad: facturasVencidasCantidad,
        total: facturasVencidasTotal,
      },
    };
  }

