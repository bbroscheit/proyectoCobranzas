const { Client } = require('../../bd');

const getAllClients = async () => {
    try {
      const clients = await Client.findAll();
        if (clients.length > 0) {
            //console.log('Clients fetched successfully:', clients);
            return clients;
        } else {
            return null;
        }
      
    } catch (error) {
      console.error('Error fetching clients:', error);
      throw error;
    }
  };

module.exports = getAllClients;