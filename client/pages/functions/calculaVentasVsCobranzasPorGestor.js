export const calculaVentasVsCobranzasPorGestor = (documentos, usuario) => {
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


    const meses = generarEtiquetasMeses();
    const facturasVencidas = Array(12).fill(0);
    const recibosRecibidos = Array(12).fill(0);
    const facturasNoVencidas = Array(12).fill(0);

    documentos.forEach((cliente) => {
    const docs = cliente[includeAlias];

    if (!docs || docs.length === 0) return;

    docs.forEach((doc) => {
       
        const fechaDocumento = new Date(doc.fechadocumento);
        const mesIndex = (new Date().getFullYear() - fechaDocumento.getFullYear()) * 12 + new Date().getMonth() - fechaDocumento.getMonth();
    
        if (mesIndex >= 0 && mesIndex < 12) {
          if (doc.tipodocumento === 9) {
            recibosRecibidos[11 - mesIndex] += doc.montooriginal;
          } else if (doc.montopendiente > 0) {
            if (doc.fechavencimiento && new Date(doc.fechavencimiento) < new Date()) {
              facturasVencidas[11 - mesIndex] += doc.montopendiente;
            } else {
              facturasNoVencidas[11 - mesIndex] += doc.montopendiente;
            }
          }
        }
      });
    })
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