const { Client, Note, Usuario } = require('../../bd');
const reprogramacion = require('../functions/reprogramacion');
const sendAvisoEmail = require("../functions/sendEmailAvisos")
const marcarLLamadoHoy = require("../functions/marcarLlamadoHoy")

const postNewAvisos  = async (nota, comunicacion, emailText, cuentaCorriente, reprogram, numeroCliente, user) => {
     try {
    // No crear si nota es null/undefined/empty
    if (!nota || String(nota).trim() === '') {
      return null; 
    }

    // Validamos que exista el cliente (clientId)
    if (!numeroCliente) {
      throw new Error('Falta numeroCliente para asociar la nota');
    }
    const cliente = await Client.findByPk(numeroCliente);
    if (!cliente) {
      throw new Error(`Cliente con id ${numeroCliente} no encontrado`);
    }

    let usuarioStr = String(user);
    if (user) {
      try {
        const usuario = await Usuario.findByPk(user);
        if (usuario) {
          usuarioStr =
            `${usuario.firstname || ''} ${usuario.lastname || ''}`.trim() ||
            usuario.username ||
            String(user);
        }
      } catch (err) {
       
        console.warn('No se pudo obtener Usuario para el campo user de la nota:', err.message);
      }
    }

    // Crea la nota asociada al cliente (   )
    const nuevaNota = await Note.create({
      detail: String(nota),
      typecontact: comunicacion || 'correo electronico',
      user: usuarioStr,
      clientId: numeroCliente, 
    });

    // Envia email si EmailText tiene informacion
    if (emailText && emailText.trim() !== "") {
      await sendAvisoEmail(numeroCliente, user, emailText, cuentaCorriente);
    }

    if (reprogram && reprogram.trim() !== "") {
      await reprogramacion(cliente, reprogram, user);
    }

    //cambiamos el estado del cliente a llamado:true
    await marcarLLamadoHoy(numeroCliente, user)
  

    return nuevaNota;
  } catch (error) {
    console.error('❌ Error en postNewAvisos:', error);
    throw error;
  }
    
};

module.exports = postNewAvisos;