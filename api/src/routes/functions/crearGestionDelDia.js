const { Gestion } = require("../../bd");

const crearGestionDelDia = async (usuario, listadoHoy) => {
  try {
    const cantidadClientes = listadoHoy.clientes.length;

    const gestion = await Gestion.create({
      gestion: cantidadClientes,
      gestioncompletada: 0,
      fecha: new Date(), // fecha de hoy
      usuarioId: usuario.id,
    });

    console.log(`Gestión creada para usuario ${usuario.id} con ${cantidadClientes} clientes`);
    return gestion;
  } catch (error) {
    console.error("❌ Error creando la gestión del día:", error);
    throw error;
  }
};

module.exports = crearGestionDelDia;
