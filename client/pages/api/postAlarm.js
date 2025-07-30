export async function postAlarm(alarmaData) {
   
    try {
        const response = await fetch(`http://${process.env.NEXT_PUBLIC_LOCALHOST}:3001/newAlarm`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(alarmaData)
        });
    
        // if (!response.ok) {
        //   throw new Error('Error en la solicitud');
        // }
    
        const data = await response.json();
        return data;
        
      } catch (error) {
        console.error('Error al enviar la alarma:', error);
      }
    
    
  }