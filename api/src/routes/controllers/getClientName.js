const { Client } = require('../../bd');

const getClientName = async (clienteId) => {
    try {
      const clients = await Client.findAll({
        where: { id : clienteId }
      });
  
      if (clients.length > 0) {
        return { nombre: clients[0].name }; 
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error fetching clients by gestor:', error);
      throw error;
    }
  };

module.exports = getClientName;