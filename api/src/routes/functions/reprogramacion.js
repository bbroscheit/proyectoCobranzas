const { Listadellamadas } = require("../../bd");
const { Op } = require("sequelize");

const reprogramacion = async (client, reprogram, usuarioId) => {
  try {
    let targetDate;

    if (reprogram && reprogram !== false) {
      targetDate = new Date(reprogram);
    } else {
      targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + 7);
    }

    // Normalizamos fecha al inicio del día
    const dayStart = new Date(targetDate.setHours(0, 0, 0, 0));
    const dayEnd = new Date(targetDate.setHours(23, 59, 59, 999));

    // Buscar lista existente para ese día
    const lista = await Listadellamadas.findOne({
      where: {
        fecha: {
          [Op.between]: [dayStart, dayEnd],
        },
        usuarioId, // 👈 se ajusta al campo real de la relación
      },
    });

    if (lista) {
      // Ya existe → agregamos cliente (si no está ya)
      const clientes = lista.clientes || [];
      const existe = clientes.some((c) => c.id === client.id);

      if (!existe) {
        clientes.push(client);
        await lista.update({ clientes });
      }
    } else {
      // No existe → creamos nueva lista con este cliente
      lista = await Listadellamadas.create({
        fecha: dayStart,
        clientes: [client],
      });
    }

    console.log(`Cliente ${client.id} agendado para el ${dayStart}`);

    return lista;
  } catch (error) {
    console.error("Error en handleReprogramacion:", error);
    throw error;
  }
};

module.exports = reprogramacion;
