const getStatusClient = async (clientId) => {
    try {
      const response = await fetch(`http://172.19.31.20:52144/api/client/${clientId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();
        return data;
          
      
    } catch (error) {
        console.error('Error fetching client status:', error);
      throw error;
    }
  };

module.exports = getStatusClient;