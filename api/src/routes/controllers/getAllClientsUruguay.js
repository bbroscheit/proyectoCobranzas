const { Clienturuguay } = require('../../bd');

const getAllClientsUruguay = async () => {
    try {
      const clients = await Clienturuguay.findAll();
        if (clients.length > 0) {
            //console.log('Clients fetched successfully:', clients);
            return clients;
        } else {
            return null;
        }
      
    } catch (error) {
      console.error('Error fetching Clienturuguay:', error);
      throw error;
    }
  };

module.exports = getAllClientsUruguay;