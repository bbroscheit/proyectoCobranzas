export async function postNote(noteData) {
   
    try {
        const response = await fetch(`http://${process.env.NEXT_PUBLIC_LOCALHOST}:3001/newNote`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(noteData)
        });
    
        // if (!response.ok) {
        //   throw new Error('Error en la solicitud');
        // }
    
        const data = await response.json();
        return data;
        
      } catch (error) {
        console.error('Error al enviar la nota:', error);
      }
    
    
  }