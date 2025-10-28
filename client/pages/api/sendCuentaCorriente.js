export async function sendCuentaCorriente(cuentaCorrienteData) {
   //console.log("Enviando cuenta corriente con los siguientes datos:", cuentaCorrienteData);
    try {
        const response = await fetch(`http://${process.env.NEXT_PUBLIC_LOCALHOST}:3001/sendCuentaCorriente`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(cuentaCorrienteData)
        });
    
        const data = await response.json();
        return data;
        
      } catch (error) {
        console.error('Error al enviar el aviso:', error);
      }
    
    
  }