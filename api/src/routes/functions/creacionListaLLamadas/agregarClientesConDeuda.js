const { Listadellamada } = require("../../../bd");
const { Op } = require("sequelize");

// Recorremos todos los clientes de un gestor y asegura que los que tienen deuda estén en la lista de hoy
const agregarClientesConDeuda = async (usuario, listadoHoy, datosConDocumentos) => {
  try {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    for (const cliente of datosConDocumentos.clientes) {
      const totalDeuda = cliente.documents.reduce(
        (acc, doc) => acc + (parseFloat(doc.montopendiente) || 0),
        0
      );

      if (totalDeuda > 0) {
        // Verificamos si ya está en la lista de hoy
        const yaEnHoy = listadoHoy.clientes.some(c => c.id === cliente.id);
        if (yaEnHoy) continue;

        // Buscamos listas posteriores a hoy del mismo usuario
        const listasPosteriores = await Listadellamada.findAll({
          where: {
            usuarioId: usuario.id,
            fecha: { [Op.gt]: hoy },
          },
        });

        let yaEnPosterior = false;
        for (const lista of listasPosteriores) {
          const clientesLista = lista.clientes || [];
          if (clientesLista.some(c => c.id === cliente.id)) {
            yaEnPosterior = true;
            break;
          }
        }

        if (!yaEnPosterior) {
          // lo Agregamos a la lista de hoy
            const nuevosClientes = [...listadoHoy.clientes, { id: cliente.id, llamado: false }];
            await listadoHoy.update({ clientes: nuevosClientes });
          
          console.log(`📌 Agregados los clientes viejos con deuda para ${usuario.firstname} ${usuario.lastname}`);
        }
      }
    }   
  } catch (error) {
    console.error(
      `❌ Error al agregar clientes con deuda para usuario ${usuario.firstname} ${usuario.lastname}:`,
      error
    );
  }
};

module.exports = agregarClientesConDeuda;
