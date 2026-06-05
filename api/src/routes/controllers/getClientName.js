const {
  Usuario,
  Document,
  Documenturuguay,
  Documentchile,
  Documentecopatagonico,
  Documentecobahia,
  Documentecoportatiles,

  Client,
  Clienturuguay,
  Clientchile,
  Clientecopatagonico,
  Clientecobahia,
  Clientecoportatiles,
} = require("../../bd");

const getClientName = async (userId, clienteId) => {
  const usuario = await Usuario.findOne({
    where: {
      id: userId,
      isdelete: false,
    },
  });

  let ClienteModel, DocumentoModel, includeAlias;

  // Seleccionamos modelos según sucursal
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
    case 4:
      ClienteModel = Clientrosario;
      DocumentoModel = Documentrosario;
      includeAlias = "documentorosario";
      break;
    case 5:
      ClienteModel = Clientecopatagonico;
      DocumentoModel = Documentecopatagonico;
      includeAlias = "documentoecopatagonico";
      break;
    case 6:
      ClienteModel = Clientecobahia;
      DocumentoModel = Documentecobahia;
      includeAlias = "documentoecobahia";
      break;
    case 7:
      ClienteModel = Clientecoportatiles;
      DocumentoModel = Documentecoportatiles;
      includeAlias = "documentoecoportatiles";
    default:
      return;
  }

  try {
    const clients = await ClienteModel.findAll({
      where: { id: clienteId },
    });

    if (clients.length > 0) {
      return { nombre: clients[0].name };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching clients by gestor:", error);
    throw error;
  }
};

module.exports = getClientName;
