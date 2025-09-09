const { Clientecobahia } = require('../../bd');

const getAllClientsEcobahia = async () => {
    try {
      const clients = await Clientecobahia.findAll();
        if (clients.length > 0) {
            //console.log('Clients fetched successfully:', clients);
            return clients;
        } else {
            return null;
        }
      
    } catch (error) {
      console.error('Error fetching Clientecobahia:', error);
      throw error;
    }
  };

module.exports = getAllClientsEcobahia;