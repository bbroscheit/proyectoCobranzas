const { 
  Client, Clienturuguay, Clientchile, 
  Document, Documenturuguay, Documentchile 
} = require("../../../bd");

const agregarClientesNuevosConDeuda = async (usuario, listaHoy) => {
  try {
    let ClienteModel, DocumentoModel, includeAlias;

    // Seleccionamos modelos según sucursal
    switch (usuario.sucursal) {
      case 1:
        ClienteModel = Client;
        DocumentoModel = Document;
        includeAlias = "documento";
        break;
      case 2:
        ClienteModel = Clienturuguay;
        DocumentoModel = Documenturuguay;
        includeAlias = "documentouruguay";
        break;
      case 3:
        ClienteModel = Clientchile;
        DocumentoModel = Documentchile;
        includeAlias = "documentochile";
        break;
      default:
        return;
    }

    // Buscamos clientes con "nuevo = true" que pertenezcan al gestor
    const clientesNuevos = await ClienteModel.findAll({
      where: {
        gestor: `${usuario.firstname} ${usuario.lastname}`,
        nuevo: true,
      },
      include: [
        {
          model: DocumentoModel,
          as: includeAlias,
          attributes: ["id","montopendiente"],
        },
      ],
    });

    for (const cliente of clientesNuevos) {
      const docs = cliente[includeAlias];
      //console.log(`Cliente ${cliente.id} documentos:`, docs.map(d => ({id: d.id, montopendiente: d.montopendiente})));
      const totalDeuda = docs.reduce((acc, d) => acc + (Number(d.montopendiente) || 0), 0);

      if (totalDeuda > 0) {
        // Agregar cliente a la lista de hoy
        listaHoy.clientes.push({ id: cliente.id, llamado: false });
        // console.log(
        //   `📌 Cliente nuevo ${cliente.id} con deuda agregado a la lista de hoy del gestor ${usuario.firstname} ${usuario.lastname}`
        // );
        // Marcar cliente como ya no nuevo
        await cliente.update({ nuevo: false });
      }
    }

    await listaHoy.save();

  } catch (error) {
    console.error(`❌ Error al agregar clientes nuevos con deuda para ${usuario.firstname}:`, error);
  }
};

module.exports = agregarClientesNuevosConDeuda;