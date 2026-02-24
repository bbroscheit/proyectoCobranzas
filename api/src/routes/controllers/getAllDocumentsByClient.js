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
  Note
} = require("../../bd");

const getAllDocumentsByClient = async (userId, clientId) => {
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
    const documentos = await DocumentoModel.findAll(
      {
        where: { clientId: clientId },
        as: includeAlias,
      })
    
    const documentosTimeline = documentos.map(doc => ({
      tipo: "documento",
      fechaOrden: new Date(doc.fechadocumento),
      payload: doc
    }));

    const notes = await Note.findAll(
      {
        model: Note,
        as: 'notes'
      }
    );

    const notasTimeline = notes.map(note => ({
      tipo: "nota",
      fechaOrden: new Date(note.createdAt),
      payload: note
    }));
    
    const timeline = [...documentosTimeline, ...notasTimeline]
      .sort((a, b) => b.fechaOrden - a.fechaOrden);

  return timeline;
  } catch (err) {
    console.error("Error al ejecutar la consulta:", err);
    throw err;
  }
};

module.exports = getAllDocumentsByClient;
