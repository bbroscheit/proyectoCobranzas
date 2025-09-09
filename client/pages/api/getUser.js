export async function getUser(input) {
   
    try {
        const response = await fetch(`http://${process.env.NEXT_PUBLIC_LOCALHOST}:3001/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(input)
        });

        const data = await response.json();
        return data;
        
      } catch (error) {
        console.error('Error al querer tomar el usuario:', error);
      }
    
    
  }