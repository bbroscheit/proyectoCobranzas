const { Listadellamada } = require("../../../bd");
const { Op } = require("sequelize");

const obtenerClientesPendientes = async (usuario) => {
  try {
    // Fecha de ayer (solo día, sin horas)
    const ayerInicio = new Date();
    ayerInicio.setDate(ayerInicio.getDate() - 1);
    ayerInicio.setHours(0, 0, 0, 0);

    const ayerFin = new Date();
    ayerFin.setDate(ayerFin.getDate() - 1);
    ayerFin.setHours(23, 59, 59, 999);

    // Buscar el registro de ayer
    const listadoAyer = await Listadellamada.findOne({
      where: {
        usuarioId: usuario.id,
        fecha: {
          [Op.between]: [ayerInicio, ayerFin],
        },
      },
    });

    if (!listadoAyer) return []; // no hay registro ayer

    // Filtrar clientes con llamado = false
    const clientesPendientes = listadoAyer.clientes.filter(
      (c) => c.llamado === false
    );

    return clientesPendientes;
  } catch (error) {
    console.error(`❌ Error obteniendo clientes pendientes de ayer para ${usuario.firstname} ${usuario.lastname}:`, error);
    return [];
  }
};

module.exports = obtenerClientesPendientes;