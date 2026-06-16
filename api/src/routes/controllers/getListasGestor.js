const { Listadellamada, Usuario } = require("../../bd");

const getListasGestor = async (usuarioId) => {
  const usuario = await Usuario.findByPk(usuarioId);
  if (!usuario) throw new Error(`Usuario ${usuarioId} no encontrado`);

  const listas = await Listadellamada.findAll({
    where: { usuarioId },
    order: [["fecha", "DESC"]],
  });

  return listas.map((lista) => {
    const clientes = lista.clientes || [];
    const llamados    = clientes.filter((c) => c.llamado === true).length;
    const nollamados  = clientes.filter((c) => c.llamado !== true).length;

    return {
      fecha:        lista.fecha,
      totalClientes: clientes.length,
      llamados,
      nollamados,
      clientes: clientes.map((c) => ({
        id:          c.id,
        name:        c.name        || null,
        llamado:     c.llamado     === true,
        deudaTotal:  c.deudaTotal  ?? null,
        deudaVencida: c.deudaVencida ?? null,
      })),
    };
  });
};

module.exports = getListasGestor;
