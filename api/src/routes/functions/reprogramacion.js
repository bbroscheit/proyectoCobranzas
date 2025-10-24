const { Listadellamada } = require("../../bd");
const { Op } = require("sequelize");

const reprogramacion = async (client, reprogram, usuarioId) => {
  //console.log("Reprogramando cliente:", client.id, "con reprogramación:", reprogram, "para usuario:", usuarioId);
  try {
    let targetDate;

    if (reprogram && reprogram !== false) {
      const [year, month, day] = reprogram.split("-").map(Number);
      targetDate = new Date(year, month - 1, day); // mes va de 0 a 11
    } else {
      targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + 7);
    }

    
    // Normalizamos fecha al inicio del día
    const year = targetDate.getFullYear();
    const month = targetDate.getMonth(); // 0-11
    const date = targetDate.getDate();

    // dayStart: local midnight del día target
    const dayStart = new Date(year, month, date, 0, 0, 0, 0);
    // dayEnd: último milisegundo del día target
    const dayEnd = new Date(year, month, date, 23, 59, 59, 999);

    //console.log(`${reprogram} Buscando/creando lista para el día: ${dayStart} y usuarioId: ${usuarioId} con fecha objetivo: ${targetDate} y fin de día: ${dayEnd}`);

    // Buscar lista existente para ese día
    let lista = await Listadellamada.findOne({
      where: {
        fecha: {
          [Op.between]: [dayStart, dayEnd],
        },
        usuarioId, // se ajusta al campo real de la relación
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
      //console.log(`No se encontró lista para el día ${dayStart}, creando una nueva para el usuario ${usuarioId}.`);
      // No existe → creamos nueva lista con este cliente
      lista = await Listadellamada.create({
        fecha: dayStart,
        clientes: [client],
        usuarioId
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
