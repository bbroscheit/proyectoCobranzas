const { Listadellamada } = require("../../../bd");
const obtenerClientesPendientes = require("./obtenerClientesDeAyer");
const { Op } = require("sequelize");

const prellenarClientesHoy = async (usuario, listadoHoy) => {
  try {
    // 1️⃣ Obtener clientes pendientes de ayer
    const clientesPendientes = await obtenerClientesPendientes(usuario);

    // 2️⃣ Formatear para el nuevo registro
    const clientesParaHoy = clientesPendientes.map((c) => ({
      id: c.id,
      llamado: false,
    }));

    // 3️⃣ Actualizar el registro del día actual
    listadoHoy.clientes = clientesParaHoy;
    await listadoHoy.save();

    console.log(
      `✅ Clientes pendientes de ayer agregados al listado de hoy para ${usuario.firstname} ${usuario.lastname}`
    );

    return listadoHoy;
  } catch (error) {
    console.error(
      `❌ Error prellenando clientes de hoy para ${usuario.firstname} ${usuario.lastname}:`,
      error
    );
    return listadoHoy;
  }
};

module.exports = prellenarClientesHoy;