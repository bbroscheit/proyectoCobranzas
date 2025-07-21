const { Client } = require('../../bd');

const getClientsByGestor = async (gestor) => {
    
  try {
    const clients = await Client.findAll({
      where: { gestor }
    });

    return clients;
  } catch (error) {
    console.error('Error fetching clients by gestor:', error);
    throw error;
  }
};

module.exports = getClientsByGestor;