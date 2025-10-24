export const calculaVentasVsCobranzas = (documentos) => {
  //console.log("documentos en calculaVentasVsCobranzas", documentos)
    const meses = generarEtiquetasMeses();
    const facturasVencidas = Array(12).fill(0);
    const recibosRecibidos = Array(12).fill(0);
    const facturasNoVencidas = Array(12).fill(0);

    documentos.forEach((documento) => {
       
        const fechaDocumento = new Date(documento.fechadocumento);
        const mesIndex = (new Date().getFullYear() - fechaDocumento.getFullYear()) * 12 + new Date().getMonth() - fechaDocumento.getMonth();
    
        if (mesIndex >= 0 && mesIndex < 12) {
          if (documento.tipodocumento === 9) {
            recibosRecibidos[11 - mesIndex] += documento.montooriginal;
          } else if (documento.montopendiente > 0) {
            if (documento.fechavencimiento && new Date(documento.fechavencimiento) < new Date()) {
              facturasVencidas[11 - mesIndex] += documento.montopendiente;
            } else {
              facturasNoVencidas[11 - mesIndex] += documento.montopendiente;
            }
          }
        }
      });

    //console.log("meses en calculaVentasVsCobranzas", facturasVencidas, recibosRecibidos, facturasNoVencidas)
    return { meses, facturasVencidas, recibosRecibidos, facturasNoVencidas };
  };

// Función para generar etiquetas de los últimos 12 meses
const generarEtiquetasMeses = () => {
    const meses = [];
    const date = new Date();
    for (let i = 11; i >= 0; i--) {
      const mes = new Date(date.getFullYear(), date.getMonth() - i, 1);
      meses.push(mes.toLocaleString('es-ES', { month: 'numeric', year: 'numeric' }));
    }
    return meses;
  };