const { Gestion, Usuario } = require('../../bd');
const { Op } = require('sequelize');

const getGestionesByGestor = async (gestor) => {
    console.log("gestor: ", gestor)
  try {
    // Primero buscamos el usuario por su identificador (puede ser id o username según tu caso)
    const usuario = await Usuario.findOne({ where: { id: gestor } }); 
    if (!usuario) {
      console.warn(`No se encontró usuario con id: ${gestor}`);
      return null;
    }

    // Rango de hoy
    const hoyInicio = new Date();
    hoyInicio.setHours(0, 0, 0, 0);

    const hoyFin = new Date();
    hoyFin.setHours(23, 59, 59, 999);

    // Buscamos la gestión del día
    const gestionDelDia = await Gestion.findOne({
      where: {
        usuarioId: usuario.id,
        fecha: {
          [Op.between]: [hoyInicio, hoyFin],
        },
      },
    });

    if (!gestionDelDia) {
      console.log(`No hay gestión registrada hoy para el gestor ${gestor}`);
      return null;
    }

    return gestionDelDia;
  } catch (error) {
    console.error(`❌ Error obteniendo gestiones del gestor ${gestor}:`, error);
    throw error;
  }
};

module.exports = getGestionesByGestor;
