const {
  Usuario,
  Document,
  Documenturuguay,
  Documentchile,
  Documentecopatagonico,
  Client,
  Clienturuguay,
  Clientchile,
  Clientecopatagonico,
} = require("../../bd");
const calcularMontosPorAntiguedad = require("../helpers/calculaMontosPorAntiguedad");
const calcularDiasCalle = require("../helpers/calcularDiasEnCalle");
const calcularVentasVsCobranzas = require("../helpers/calcularVentasVsCobranzas");

const getAllDocumentsByGestor = async (gestor) => {
  const usuario = await Usuario.findOne({
    where: { id: gestor, isdelete: false },
  });

  if (!usuario) throw new Error("Usuario no encontrado");

  let username = `${usuario.firstname} ${usuario.lastname}`;

  let ClienteModel, DocumentoModel, includeAlias;

  switch (usuario.sucursal) {
    case 1:
      ClienteModel = Client;
      DocumentoModel = Document;
      includeAlias = "clientdocumento";
      break;
    case 2:
      ClienteModel = Clienturuguay;
      DocumentoModel = Documenturuguay;
      includeAlias = "clientdocumentouruguay";
      break;
    case 3:
      ClienteModel = Clientchile;
      DocumentoModel = Documentchile;
      includeAlias = "clientdocumentochile";
      break;
    case 5:
      ClienteModel = Clientecopatagonico;
      DocumentoModel = Documentecopatagonico;
      includeAlias = "clientdocumentoecopatagonico";
      break;
    default:
      return;
  }

  try {
    const documentos = await DocumentoModel.findAll({
      include: [
        {
          model: ClienteModel,
          as: includeAlias,
          where: { gestor: username },
          attributes: [],
          required: true,
        },
      ],
    });

    const hoy = new Date();
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    const mesActual = hoy.getMonth();
    const anioActual = hoy.getFullYear();

    let totalCobradoMes = 0;
    let saldoPendiente = 0;
    let saldoVencido = 0;
    let totalFacturadoMes = 0;

    documentos.forEach((doc) => {
      const fechaDocumento = new Date(doc.fechadocumento);
      const fechaVencimiento = new Date(doc.fechavencimiento);

      // RECIBOS (código 9) cobrados en el mes actual
      if (doc.tipodocumento === 9) {
        if (fechaDocumento >= inicioMes && fechaDocumento <= hoy) {
          totalCobradoMes += doc.montooriginal;
        }
      }

      // FACTURAS / ND / NC
      else if ([1, 3, 7, 8].includes(doc.tipodocumento)) {

        const signo = doc.tipodocumento === 8 ? -1 : 1;

        // SALDOS (solo si hay pendiente)
        if (doc.montopendiente > 0) {

          if (fechaVencimiento >= hoy) {
            saldoPendiente += signo * doc.montopendiente;
          } else {
            saldoVencido += signo * doc.montopendiente;
          }
        }

        // FACTURACIÓN DEL MES (solo código 1 menos 8)
        if (
          (doc.tipodocumento === 1 || doc.tipodocumento === 8) &&
          fechaDocumento.getMonth() === mesActual &&
          fechaDocumento.getFullYear() === anioActual
        ) {
          totalFacturadoMes += signo * (doc.montooriginal || 0);
        }
      }
    });

    return {
      totalCobradoMes: parseFloat(totalCobradoMes.toFixed(2)),
      saldoPendiente: parseFloat(saldoPendiente.toFixed(2)),
      saldoVencido: parseFloat(saldoVencido.toFixed(2)),
      totalFacturadoMes: parseFloat(totalFacturadoMes.toFixed(2)),
      antiguedad: calcularMontosPorAntiguedad(documentos),
      diasCalle: calcularDiasCalle(documentos),
      ventasVsCobranzas: calcularVentasVsCobranzas(documentos)
    };

  } catch (err) {
    console.error("Error al ejecutar la consulta:", err);
    throw err;
  }
};

module.exports = getAllDocumentsByGestor;
