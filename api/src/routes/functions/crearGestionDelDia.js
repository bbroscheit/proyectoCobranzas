const { Gestion } = require("../../bd");
const { Op } = require("sequelize");

const crearGestionDelDia = async (usuario, listadoHoy) => {
  try {
    const cantidadClientes = listadoHoy.clientes.length;

    // Si la lista se regenera en el día, se actualiza la gestión existente en vez de duplicarla
    const hoy = new Date();
    const inicioDia = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate(), 0, 0, 0, 0);
    const finDia = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate(), 23, 59, 59, 999);

    const existente = await Gestion.findOne({
      where: { usuarioId: usuario.id, fecha: { [Op.between]: [inicioDia, finDia] } },
    });

    if (existente) {
      await existente.update({ gestion: cantidadClientes });
      console.log(`Gestión actualizada para usuario ${usuario.id} con ${cantidadClientes} clientes`);
      return existente;
    }

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
