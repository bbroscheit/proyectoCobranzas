const { Client, Clienturuguay, Clientchile } = require("../../../bd");

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
      default:
        return {
          gestor: `${usuario.firstname} ${usuario.lastname}`,
          clientes: [],
          sucursal: sucursal
        };
    }

    // Buscar todos los clientes donde el campo gestor coincida con el username del usuario
    const clientes = await clientesModel.findAll({
      where: { gestor: gestorNombre },
      attributes: ["id","name","contacto1","email","nuevo"]
    });

    return {
      gestor: gestorNombre,
      clientes: clientes.map((c) => c.id),
      sucursal: sucursal
    };

  } catch (error) {
    console.error(`❌ Error obteniendo clientes para usuario ${gestorNombre}:`, error);
    return {
      gestor: gestorNombre,
      clientes: [],
      sucursal: sucursal
    };
  }
};

module.exports = getClientesPorUsuario;