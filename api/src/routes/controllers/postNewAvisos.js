const {
  Client,
  Note,
  Usuario,
  Document,
  Documenturuguay,
  Documentchile,
  Documentecopatagonico,
  Clienturuguay,
  Clientchile,
  Clientecopatagonico,
} = require("../../bd");

const reprogramacion = require("../functions/reprogramacion");
const sendAvisoEmail = require("../functions/sendEmailAvisos");
const marcarLLamadoHoy = require("../functions/marcarLlamadoHoy");

const postNewAvisos = async (
  nota,
  comunicacion,
  emailText,
  cuentaCorriente,
  reprogram,
  numeroCliente,
  user
) => {

  //console.log("📝 cuentaCorriente :" , cuentaCorriente);
  try {
    // No crear si nota es null/undefined/empty
    if (!nota || String(nota).trim() === "") {
      return null;
    }

    const usuario = await Usuario.findOne({
      where: {
        id: user,
        isdelete: false,
      },
    });

    //let username = `${usuario.firstname} ${usuario.lastname}`;

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

    //Validamos que exista el cliente (clientId)
    if (!numeroCliente) {
      throw new Error("Falta numeroCliente para asociar la nota");
    }

    const cliente = await ClienteModel.findByPk(numeroCliente);
    if (!cliente) {
      throw new Error(`Cliente con id ${numeroCliente} no encontrado`);
    }

    // Crea la nota asociada al cliente (   )
    const nuevaNota = await Note.create({
      detail: String(nota),
      typecontact: comunicacion || "correo electronico",
      user: usuario.id,
      sucursal: usuario.sucursal,
      client: cliente.id,
    });

    // Envia email si EmailText tiene informacion
    if (emailText && emailText.trim() !== "") {
      await sendAvisoEmail(cliente.id, usuario.id, emailText, cuentaCorriente);
    }

    await reprogramacion(cliente, reprogram, usuario.id);
    
    //cambiamos el estado del cliente a llamado:true
    await marcarLLamadoHoy(cliente.id, usuario.id);

    return nuevaNota;
  } catch (error) {
    console.error("❌ Error en postNewAvisos:", error);
    throw error;
  }
};

module.exports = postNewAvisos;
