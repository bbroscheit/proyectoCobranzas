const { Listadellamada } = require("../../../bd");
const { Op } = require("sequelize");

const crearListaDeLlamadas = async (usuario) => {
  try {
    // Fecha de hoy sin horas
    const inicioDia = new Date();
    inicioDia.setHours(0, 0, 0, 0);

    const finDia = new Date();
    finDia.setHours(23, 59, 59, 999);

    // Revisar si ya existe un registro hoy
    const existente = await Listadellamada.findOne({
      where: {
        usuarioId: usuario.id,
        fecha: {
          [Op.between]: [inicioDia, finDia],
        },
      },
    });

    if (existente) {
      console.log(`✔ Registro de hoy ya existe para ${usuario.firstname} ${usuario.lastname}`);
      return existente; // no hacemos nada
    }

    // Si no existe, crear uno nuevo (clientes se deja vacío por ahora)
    const nuevoListado = await Listadellamada.create({
      clientes: [],
      usuarioId: usuario.id,
      fecha: new Date(),
    });

    console.log(`✅ Se creó listado para ${usuario.firstname} ${usuario.lastname}`);
    return nuevoListado;
  } catch (error) {
    console.error(`❌ Error creando listado para ${usuario.firstname} ${usuario.lastname}:`, error);
    return null;
  }
};

module.exports = crearListaDeLlamadas;