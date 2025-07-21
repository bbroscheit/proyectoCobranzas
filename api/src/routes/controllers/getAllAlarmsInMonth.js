const { Op } = require('sequelize');
const { Client, Alarma } = require('../../bd');

const getAllAlarmsInMonth = async (gestor) => {
    try {
        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0, 23, 59, 59, 999);
    
        const alarms = await Alarma.findAll({
          where: {
            usuario: gestor,
            createdAt: {
              [Op.between]: [startOfMonth, endOfMonth],
            },
          },
        });

        console.log("alarma : ", alarms);
        if (alarms.length > 0) {
            return alarms;
        } else {
            return null;
        }

    } catch (error) {
      console.error('Error fetching alarms:', error);
      throw error;
    }
  };

module.exports = getAllAlarmsInMonth;