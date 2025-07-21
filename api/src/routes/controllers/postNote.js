const { Client, Note } = require('../../bd');

const postNote  = async (nota, comunicacion , numeroCliente, user) => {
    
    try {
        const client = await Client.findByPk(numeroCliente);

        if (!client) {
            return "Cliente no encontrado" 
        }

        const newNote = await Note.create({
            detail : nota,
            typecontact: comunicacion,
            user: user,
        });

        await client.addNote(newNote);

        return newNote;
        
    } catch (error) {
        console.error("Error al crear la alarma en controller:", error);
       
    }
};

module.exports = postNote;