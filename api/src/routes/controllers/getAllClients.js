const { Client } = require('../../bd');

const getAllClients = async () => {
    try {
      const clients = await Client.findAll();
        if (clients.length > 0) {
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