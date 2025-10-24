const { Listadellamada, Usuario } = require("../../bd");
const { Op } = require("sequelize");

const marcarLlamadoHoy = async (clienteId, usuarioId) => {
  console.log("clienteId", clienteId);

  try {
    const hoy = new Date();
    // Normalizamos fecha al inicio del día
    const year = hoy.getFullYear();
    const month = hoy.getMonth(); // 0-11
    const date = hoy.getDate();

    // dayStart: local midnight del día target
    const dayStart = new Date(year, month, date, 0, 0, 0, 0);
    // dayEnd: último milisegundo del día target
    const dayEnd = new Date(year, month, date, 23, 59, 59, 999);

    // Buscar lista de hoy
    let listaJoin  = await Listadellamada.findOne({
      where: {
        fecha: {
          [Op.between]: [dayStart, dayEnd],
        },
      },
      include: [
        {
          model: Usuario,
          as: "usuarioagenda",
          where: { id: usuarioId },
        },
      ],
    });

    //console.log("📭 Lista de llamadas de hoy encontrada:", listaHoy);

    if (!listaJoin ) {
      console.log("📭 No existe lista de llamadas para hoy");
      return null;
    }

    const listaHoy = await Listadellamada.findByPk(listaJoin.id);

    // Actualizar cliente dentro del array
   const clientes = Array.isArray(listaHoy.clientes) ? [...listaHoy.clientes] : [];
    const idx = clientes.findIndex((c) => Number(c.id) === Number(clienteId));

    //console.log(" Índice del cliente en la lista de hoy:", idx);

    if (idx === -1) {
      console.log(`Cliente ${clienteId} no está en la lista de hoy`);
      return listaHoy;
    }

    clientes[idx] = {
      ...clientes[idx],
      llamado: true,
    };

    listaHoy.set("clientes", clientes);
    await listaHoy.save({ fields: ["clientes"] });

    return listaHoy;
  } catch (error) {
    console.error("❌ Error en marcarLlamadoHoy:", error);
    throw error;
  }
};

module.exports = marcarLlamadoHoy;
