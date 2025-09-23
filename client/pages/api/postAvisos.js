export async function postAvisos(avisosData) {
   
    try {
        const response = await fetch(`http://${process.env.NEXT_PUBLIC_LOCALHOST}:3001/newAvisos`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(avisosData)
        });
    
        const data = await response.json();
        return data;
        
      } catch (error) {
        console.error('Error al enviar el aviso:', error);
      }
    
    
  }