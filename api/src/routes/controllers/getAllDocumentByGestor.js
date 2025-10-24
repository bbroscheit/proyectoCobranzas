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

const getAllDocumentsByGestor = async (gestor) => {
  const usuario = await Usuario.findOne({
    where: {
      id: gestor,
      isdelete: false,
    },
  });

  let username = `${usuario.firstname} ${usuario.lastname}`;

  let ClienteModel, DocumentoModel, includeAlias;

  switch (usuario.sucursal) {
    case 1:
      ClienteModel = Client;
      DocumentoModel = Document;
      includeAlias = "documento";
      break;
    case 2:
      ClienteModel = Clienturuguay;
      DocumentoModel = Documenturuguay;
      includeAlias = "documentouruguay";
      break;
    case 3:
      ClienteModel = Clientchile;
      DocumentoModel = Documentchile;
      includeAlias = "documentochile";
      break;
    // case 4:
    //   ClienteModel = Clientrosario;
    //   DocumentoModel = Documentrosario;
    //   includeAlias = "documentorosario";
    //   break;
    case 5:
      ClienteModel = Clientecopatagonico;
      DocumentoModel = Documentecopatagonico;
      includeAlias = "documentoecopatagonico";
      break;
    default:
      return;
  }

  try {
    const documentos = await ClienteModel.findAll({
      where: { gestor: username },
      include: [{ model: DocumentoModel, as: includeAlias }],
    });

    return documentos;
  } catch (err) {
    console.error("Error al ejecutar la consulta:", err);
    throw err;
  }
};

module.exports = getAllDocumentsByGestor;
