const { Gestion, Listadellamada } = require("../../bd");
const { Op, fn, col } = require("sequelize");

const getGestionesByGestor = async (usuarioId) => {
  console.log("usuarioId en getGestionesByGestor", usuarioId);
  const hoy = new Date();

  const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
  const inicioDia = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());

  
  const listaHoy  = await Listadellamada.findOne({
    where: {
      usuarioId,
      fecha: {
        [require("sequelize").Op.gte]: inicioDia,
      },
    },
  });

  // Gestiones creadas hoy (lista de llamadas del día)
  const gestionesHoy = listaHoy?.clientes?.length || 0;

 const resumenMes = await Gestion.findAll({
    where: {
      usuarioId,
      fecha: {
        [Op.gte]: inicioMes,
      },
    },
    attributes: [
      [fn("SUM", col("gestion")), "totalGestionesMes"],
      [fn("SUM", col("gestioncompletada")), "totalCompletadasMes"],
    ],
    raw: true,
  });

  const totalGestionesMes = Number(resumenMes[0]?.totalGestionesMes) || 0;
  const totalCompletadasMes = Number(resumenMes[0]?.totalCompletadasMes) || 0;

  const totalNoCompletadasMes = totalGestionesMes - totalCompletadasMes;


  return {
    resumenGestiones: {
      hoy: gestionesHoy,
      completadasMes: totalCompletadasMes,
      noCompletadasMes: totalNoCompletadasMes,
    },
  };
};

module.exports = getGestionesByGestor;
