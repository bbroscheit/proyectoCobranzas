const { Gestion } = require("../../bd");
const { Op } = require("sequelize");

const sumaGestiones = async function (usuarioId) {
      try {
    // Normalizar fecha de hoy (inicio y fin del día)
    const hoy = new Date();
    const inicioDia = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate(), 0, 0, 0, 0);
    const finDia = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate(), 23, 59, 59, 999);

    // Buscar gestión del usuario para hoy
    const gestionHoy = await Gestion.findOne({
      where: {
        usuarioId,
        fecha: {
          [Op.between]: [inicioDia, finDia],
        },
      },
    });

    if (!gestionHoy) {
      console.log(`📭 No existe gestión para el usuario ${usuarioId} en el día de hoy, no se suma nada.`);
      return null;
    }

    // Sumar una gestión
    gestionHoy.gestioncompletada = (gestionHoy.gestioncompletada || 0) + 1;
    await gestionHoy.save({ fields: ["gestioncompletada"] });

    console.log(`✅ Gestión actualizada: usuario ${usuarioId}, total = ${gestionHoy.gestioncompletada}`);
    return gestionHoy;
  } catch (error) {
    console.error("❌ Error en sumaGestiones:", error);
    throw error;
  }

}

module.exports = sumaGestiones;