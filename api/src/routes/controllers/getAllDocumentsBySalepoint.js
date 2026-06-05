const {
  Usuario,
  Document,
  Documenturuguay,
  Documentchile,
  Documentecopatagonico,
  Documentecobahia,
  Documentecoportatiles,
} = require("../../bd");
const calcularMontosPorAntiguedad = require("../helpers/calculaMontosPorAntiguedad");
const calcularDiasEnCalle = require("../helpers/calcularDiasEnCalle");
const calcularVentasVsCobranzas = require("../helpers/calcularVentasVsCobranzas");
const filtrarDocumentosValidos = require("../helpers/filtraDocumentos");
const exportarDocumentosExcel = require("../helpers/exportarDocumentosExcel");
const exportarDocumentosMes = require("../helpers/exportarDocumentosMes");

const getAllDocumentsBySalepoint = async (gestor) => {
  const usuario = await Usuario.findOne({
    where: { id: gestor, isdelete: false },
  });

  let DocumentoModel;

  switch (usuario.sucursal) {
    case 1:
      DocumentoModel = Document;
      break;
    case 2:
      DocumentoModel = Documenturuguay;
      break;
    case 3:
      DocumentoModel = Documentchile;
      break;
    case 5:
      DocumentoModel = Documentecopatagonico;
      break;
    case 6:
      DocumentoModel = Documentecobahia;
      break;
    case 7:
      DocumentoModel = Documentecoportatiles;
    break;
    default:
      return null;
  }

  const documentos = await DocumentoModel.findAll({
    attributes: [
      "numerodocumento",
      "tipodocumento",
      "fechadocumento",
      "fechavencimiento",
      "montooriginal",
      "montopendiente",
    ],
  });

  const ahora = new Date();
  const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);

  const resumen = {
    recibosMes: { cantidad: 0, total: 0 },
    facturasNoVencidas: { cantidad: 0, total: 0 },
    facturasVencidas: { cantidad: 0, total: 0 },
  };

  //const documentosFiltrados = filtrarDocumentosValidos(documentos);
  
  const documentosFiltrados = documentos.filter((doc) => {
    const numero = doc.numerodocumento || "";
    if(doc.tipodocumento === 9) return true; // dejamos los recibos sin filtrar
    // quitamos NDI y NCI
    if (numero.startsWith("NDI") || numero.startsWith("NCI")) {
      return false;
    }

    // quitamos documentos sin la P (no validados por AFIP)
    if (!numero.includes("P")) {
      return false;
    }

    return true;
  });

  //exportarDocumentosExcel(documentosFiltrados);
  //exportarDocumentosMes(documentosFiltrados, "3/2026");

  console.log(`Documentos totales: ${documentos.length}, Documentos filtrados: ${documentosFiltrados.length}`);

  for (const doc of documentosFiltrados) {
    const fechaDocumento = new Date(doc.fechadocumento);
    const fechaVencimiento = new Date(doc.fechavencimiento);

    if (doc.tipodocumento === 9) {
      if (fechaDocumento >= inicioMes && fechaDocumento <= ahora) {
        resumen.recibosMes.cantidad++;
        resumen.recibosMes.total += doc.montooriginal;
      }
    }

    if ([1, 3, 7, 8].includes(doc.tipodocumento) && doc.montopendiente > 0) {
      const signo = doc.tipodocumento === 8 ? -1 : 1;
      if (fechaVencimiento >= ahora) {
        resumen.facturasNoVencidas.cantidad++;
        resumen.facturasNoVencidas.total += signo * doc.montopendiente;
      } else {
        resumen.facturasVencidas.cantidad++;
        resumen.facturasVencidas.total += signo * doc.montopendiente;
      }
    }
  }

  return {
    resumen,
    antiguedad: calcularMontosPorAntiguedad(documentosFiltrados),
    diasCalle: calcularDiasEnCalle(documentosFiltrados),
    ventasVsCobranzas: calcularVentasVsCobranzas(documentosFiltrados),
  };
};

module.exports = getAllDocumentsBySalepoint;
