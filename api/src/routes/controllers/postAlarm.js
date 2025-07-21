const { Client, Alarma } = require('../../bd');
const { parseISO, formatISO } = require('date-fns');

const postAlarm = async (texto, fecha, hora, numeroCliente, user) => {
    
    try {
        const client = await Client.findByPk(numeroCliente);

        if (!client) {
            return "Cliente no encontrado" 
        }

        // Combinar fecha y hora en un solo campo de tipo timestamp with timezone
        const fechaHora = formatISO(parseISO(`${fecha}T${hora}:00`));
        //console.log("Fecha y hora de la alarma:", fechaHora);
        const newAlarma = await Alarma.create({
            detail : texto,
            fecha: fechaHora,
            usuario: user,
        });

        await client.addAlarma(newAlarma);

        return newAlarma;
        
    } catch (error) {
        console.error("Error al crear la alarma en controller:", error);
       
    }
};

module.exports = postAlarm;