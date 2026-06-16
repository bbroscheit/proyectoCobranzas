const { Listadellamada } = require("../../bd");
const { Op } = require("sequelize");

const getClienteEmails = async (usuarioId, clienteId) => {
  const hoy = new Date();
  const dayStart = new Date(hoy.setHours(0, 0, 0, 0));
  const dayEnd   = new Date(hoy.setHours(23, 59, 59, 999));

  const listaHoy = await Listadellamada.findOne({
    where: {
      usuarioId,
      fecha: { [Op.between]: [dayStart, dayEnd] },
    },
  });

  if (!listaHoy) throw new Error("No existe lista de llamadas para hoy");

  const cliente = (listaHoy.clientes || []).find(
    (c) => String(c.id).trim() === String(clienteId).trim()
  );

  if (!cliente) throw new Error(`Cliente ${clienteId} no está en la lista de hoy`);

  const emailRaw = cliente.email || "";
  const emails = emailRaw
    .split(/[,;]/)
    .map((e) => e.trim())
    .filter((e) => e.length > 0 && e !== "Sin asignar");

  return emails;
};

module.exports = getClienteEmails;
