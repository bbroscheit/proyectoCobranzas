const { Listadellamada, Usuario } = require("../../bd");
const { Op } = require("sequelize");

const getListaDeLlamadas = async (usuarioId) => {
  console.log("usuarioId recibido en controlador:", usuarioId);

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0); 

  const manana = new Date(hoy);
  manana.setDate(hoy.getDate() + 1); 

  try {
    const listado = await Listadellamada.findOne({
      where: { usuarioId, fecha: { [Op.gte]: hoy, [Op.lt]: manana } }, 
      order: [["createdAt", "DESC"]],
      //include: ["clientes"],
    });

    if (!listado) {
      console.log("No se encontró lista de llamadas para el usuario hoy.");
    }

    return listado
  } catch (error) {
    console.error("❌ Error obteniendo listado hoy:", error);
  }
};

module.exports = getListaDeLlamadas;
