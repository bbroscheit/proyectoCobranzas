const { Listadellamada, Usuario } = require("../../bd");
const { Op } = require("sequelize");

const marcarLlamadoHoy = async (clienteId, usuarioId) => {
  console.log("clienteId", clienteId)
  try {
    const hoy = new Date();
    const dayStart = new Date(hoy.setHours(0, 0, 0, 0));
    const dayEnd = new Date(hoy.setHours(23, 59, 59, 999));

    // Buscar lista de hoy
    const listaHoy = await Listadellamada.findOne({
  where: {
    fecha: {
      [Op.between]: [dayStart, dayEnd],
    },
  },
  include: [
    {
      model: Usuario,
      as: "usuarioagenda",   // 👈 usa el alias que definiste en la relación
      where: { id: usuarioId },
    },
  ],
});

    if (!listaHoy) {
      console.log("📭 No existe lista de llamadas para hoy");
      return null;
    }

    // Actualizar cliente dentro del array
    const clientes = listaHoy.clientes || [];
    const idx = clientes.findIndex((c) => Number(c.id) === Number(clienteId));

    if (idx !== -1) {
      clientes[idx].llamado = true;
      await listaHoy.update({ clientes });
      console.log(
        `Cliente ${clienteId} marcado como llamado en la lista de hoy`
      );
    } else {
      console.log(`Cliente ${clienteId} no está en la lista de hoy`);
    }

    return listaHoy;
  } catch (error) {
    console.error("❌ Error en marcarLlamadoHoy:", error);
    throw error;
  }
};

module.exports = marcarLlamadoHoy;
