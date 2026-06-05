const {
  Usuario,
  Client,
  Clienturuguay,
  Clientchile,
  Clientecopatagonico,
  Clientecobahia,
  Clientrosario,
  Clientecoportatiles,
} = require("../../bd");

const getAllClientBySucursal = async (userId) => {
  console.log("Obteniendo clientes para usuario ID:", userId);
  const usuario = await Usuario.findOne({
    where: {
      id: userId,
      isdelete: false,
    },
  });

  let ClienteModel;

  // Seleccionamos modelos según sucursal
  switch (usuario.sucursal) {
    case 1:
      ClienteModel = Client;
      break;
    case 2:
      ClienteModel = Clienturuguay;
      break;
    case 3:
      ClienteModel = Clientchile;
      break;
    case 4:
      ClienteModel = Clientrosario;
      break;
    case 5:
      ClienteModel = Clientecopatagonico;
      break;
    case 6:
      ClienteModel = Clientecobahia;
      break;
    case 7:
      ClienteModel = Clientecoportatiles;
      break;
    default:
      return;
  }

  try {
    const clientes = await ClienteModel.findAll();
    if (clientes.length > 0) {
      //console.log('Clients fetched successfully:', clients);
      return clientes;
    } else {
      return null;
    }
  } catch (err) {
    console.error("Error al ejecutar la consulta de clientes:", err);
    throw err;
  }
};

module.exports = getAllClientBySucursal;
