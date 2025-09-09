const { Clientcordoba } = require('../../bd');

const getAllClientsCordoba = async () => {
    try {
      const clients = await Clientcordoba.findAll();
        if (clients.length > 0) {
            //console.log('Clients fetched successfully:', clients);
            return clients;
        } else {
            return null;
        }
      
    } catch (error) {
      console.error('Error fetching Clientcordoba:', error);
      throw error;
    }
  };

module.exports = getAllClientsCordoba;