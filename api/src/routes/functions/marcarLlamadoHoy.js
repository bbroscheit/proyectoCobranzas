const { Listadellamadas } = require("../../bd");
const { Op } = require("sequelize");

const marcarLlamadoHoy = async (clienteId) => {
  try {
    const hoy = new Date();
    const dayStart = new Date(hoy.setHours(0, 0, 0, 0));
    const dayEnd = new Date(hoy.setHours(23, 59, 59, 999));

    // Buscar lista de hoy
    const listaHoy = await Listadellamadas.findOne({
      where: {
        fecha: {
          [Op.between]: [dayStart, dayEnd],
        },
      },
    });

    if (!listaHoy) {
      console.log("📭 No existe lista de llamadas para hoy");
      return null;
    }

    // Actualizar cliente dentro del array
    const clientes = listaHoy.clientes || [];
    const idx = clientes.findIndex((c) => c.id === clienteId);

    if (idx !== -1) {
      clientes[idx].llamado = true;
      await listaHoy.update({ clientes });
      console.log(`Cliente ${clienteId} marcado como llamado en la lista de hoy`);
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
