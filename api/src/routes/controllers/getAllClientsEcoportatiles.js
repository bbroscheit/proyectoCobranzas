const { Clientecoportatiles } = require('../../bd');

const getAllClientsEcoportatiles = async () => {
  try {
    const clients = await Clientecoportatiles.findAll();
    if (clients.length > 0) {
      return clients;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching Clientecoportatiles:', error);
    throw error;
  }
};

module.exports = getAllClientsEcoportatiles;
