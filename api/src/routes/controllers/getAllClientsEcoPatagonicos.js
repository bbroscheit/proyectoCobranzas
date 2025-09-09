const { Clientecopatagonico } = require('../../bd');

const getAllClientsEcoPatagonico = async () => {
    try {
      const clients = await Clientecopatagonico.findAll();
        if (clients.length > 0) {
            //console.log('Clients fetched successfully:', clients);
            return clients;
        } else {
            return null;
        }
      
    } catch (error) {
      console.error('Error fetching Clientecopatagonico:', error);
      throw error;
    }
  };

module.exports = getAllClientsEcoPatagonico;