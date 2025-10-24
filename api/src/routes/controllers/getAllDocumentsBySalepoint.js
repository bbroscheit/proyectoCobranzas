const { 
 Usuario, Document, Documenturuguay, Documentchile, Documentecopatagonico
} = require("../../bd");
const sql = require("mssql");

const getAllDocumentsBySalepoint = async (gestor) => {

    // Buscamos clientes con "nuevo = true" que pertenezcan al gestor
    const usuario = await Usuario.findOne({
      where: {
        id: gestor,
        isdelete: false,
      }
    });

    let ClienteModel, DocumentoModel, includeAlias;

    // Seleccionamos modelos según sucursal
    switch (usuario.sucursal) {
      case 1:
        //ClienteModel = Client;
        DocumentoModel = Document;
        includeAlias = "documento";
        break;
      case 2:
        //ClienteModel = Clienturuguay;
        DocumentoModel = Documenturuguay;
        includeAlias = "documentouruguay";
        break;
      case 3:
        //ClienteModel = Clientchile;
        DocumentoModel = Documentchile;
        includeAlias = "documentochile";
        break;
      // case 4:
      //   ClienteModel = Clientrosario;
      //   DocumentoModel = Documentrosario;
      //   includeAlias = "documentorosario";
      //   break;
      case 5:
        //ClienteModel = Clientecopatagonico;
        DocumentoModel = Documentecopatagonico;
        includeAlias = "documentoecopatagonico";
        break;
      default:
        return;
    }
    
    
    try {
        
        const documentos = await DocumentoModel.findAll()
        //console.log("documentos desde getAllDocumentsBySalepoint", documentos)
        return documentos;        


    } catch (err) {
        console.error('Error al ejecutar la consulta:', err);
        throw err;
    } 
};

module.exports = getAllDocumentsBySalepoint;