const { Client, Alarma } = require('../../bd');

const getAllAlarms = async () => {
    try {
      const alarms = await Alarma.findAll();
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

module.exports = getAllAlarms;