const { Client, Clienturuguay, Clientchile, Clientecopatagonico } = require("../../../bd");

// Devolvemos todos los clientes de un usuario por sucursal
const getClientesPorUsuario = async (usuario) => {
  try {
    let clientesModel;
    const gestorNombre = `${usuario.firstname} ${usuario.lastname}`;
    let sucursal = usuario.sucursal;
    // Elegir la tabla de clientes según sucursal
    switch (sucursal) {
      case 1:
        clientesModel = Client;
        break;
      case 2:
        clientesModel = Clienturuguay;
        break;
      case 3:
        clientesModel = Clientchile;
        break;
      // case 4:
      //   clientesModel = Clientrosario;
      //   break;
      case 5:
        clientesModel = Clientecopatagonico;
        break;
      default:
        return {
          gestor: `${usuario.firstname} ${usuario.lastname}`,
          clientes: [],
          sucursal: sucursal,
        };
    }

    // Buscar todos los clientes donde el campo gestor coincida con el username del usuario
    const clientes = await clientesModel.findAll({
      where: { gestor: gestorNombre },
      attributes: ["id", "name", "contacto1", "email", "nuevo"],
    });

    //console.log(" listado de clientes: ", clientes);

     
    return {
      gestor: gestorNombre,
      // clientes: clientes.map((c) => c.id, c.name, c.contacto1, c.email),
      clientes: clientes.map((c) => ({
        id: c.id,
        name: c.name,
        contacto: c.contacto1,
        email: c.email,
      })),
      sucursal: sucursal,
    };
  } catch (error) {
    console.error(
      `❌ Error obteniendo clientes para usuario ${gestorNombre}:`,
      error
    );
    return {
      gestor: gestorNombre,
      clientes: [],
      sucursal: sucursal,
    };
  }
};

module.exports = getClientesPorUsuario;
