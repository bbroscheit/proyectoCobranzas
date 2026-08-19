const { Usuario, Listadellamada } = require("../../bd");
const { Op } = require("sequelize");
const retencionesTemplate = require("../mailModels/retenciones");
const sendMailgunMessage = require("../helpers/getMailTransporter");
const createSystemNote = require("../functions/createSystemNote");

const sendRetenciones = async (numeroCliente, user, destinatario, fechaPago) => {
  try {
    const usuario = await Usuario.findByPk(user);
    if (!usuario) throw new Error(`Usuario ${user} no encontrado`);
    if (!usuario.mail) throw new Error(`Usuario ${user} no tiene email registrado`);

    const hoy = new Date();
    const dayStart = new Date(hoy.setHours(0, 0, 0, 0));
    const dayEnd = new Date(hoy.setHours(23, 59, 59, 999));

    const listaHoy = await Listadellamada.findOne({
      where: {
        fecha: { [Op.between]: [dayStart, dayEnd] },
        usuarioId: user,
      },
    });

    if (!listaHoy) {
      throw new Error(`No existe lista de llamadas para hoy del usuario ${user}`);
    }

    const cliente = listaHoy.clientes.find(
      (c) => String(c.id).trim() === String(numeroCliente).trim()
    );
    if (!cliente) throw new Error(`Cliente ${numeroCliente} no está en la lista de hoy`);

    const emailDestino = destinatario || cliente.email;
    if (!emailDestino) throw new Error(`Cliente ${numeroCliente} no tiene email registrado`);

    const bodyHtml = retencionesTemplate({
      clienteNombre: cliente.name,
      fechaPago,
    });

    const result = await sendMailgunMessage({
      sucursal: usuario.sucursal,
      from: `"Ecobahia - Cobranzas" <${process.env.MAIL_USER}>`,
      to: emailDestino,
      replyTo: usuario.mail,
      subject: "Solicitud de información de pago - Retenciones",
      html: bodyHtml,
    });

    await createSystemNote({
      clientId: numeroCliente,
      userId: user,
      sucursal: usuario.sucursal,
      detail: `Se envió solicitud de retenciones por pago del ${fechaPago.split("-").reverse().join("/")}`,
    });

    console.log("Retenciones enviado:", result.messageId);
    return result;
  } catch (error) {
    console.error("Error en sendRetenciones:", error);
    throw error;
  }
};

module.exports = sendRetenciones;
