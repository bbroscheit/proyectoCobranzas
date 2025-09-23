const { Gestion } = require("../../bd");
const { Op } = require("sequelize");

const incrementarGestionCompletada = async (usuarioId) => {
  try {
    const hoyInicio = new Date();
    hoyInicio.setHours(0, 0, 0, 0);

    const hoyFin = new Date();
    hoyFin.setHours(23, 59, 59, 999);

    // Buscamos la gestión del día para este usuario
    const gestionDelDia = await Gestion.findOne({
      where: {
        usuarioId,
        fecha: {
          [Op.between]: [hoyInicio, hoyFin],
        },
      },
    });

    if (!gestionDelDia) {
      console.warn(`No se encontró gestión del día para el usuario ${usuarioId}`);
      return null;
    }

    // Incrementamos gestioncompletada en 1
    gestionDelDia.gestioncompletada += 1;
    await gestionDelDia.save();

    console.log(
      `Gestión completada incrementada para usuario ${usuarioId}. Nuevo valor: ${gestionDelDia.gestioncompletada}`
    );
    return gestionDelDia;
  } catch (error) {
    console.error("❌ Error incrementando gestioncompletada:", error);
    throw error;
  }
};

module.exports = incrementarGestionCompletada;
