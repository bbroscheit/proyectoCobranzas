const { Usuario, Listadellamada } = require("../../bd");
const { Op } = require("sequelize");
const suspensionTemplate = require("../mailModels/suspension");
const { getNombreSucursal } = require("../mailModels/sucursales");
const sendMailgunMessage = require("../helpers/getMailTransporter");
const reprogramacion = require("../functions/reprogramacion");
const marcarLLamadoHoy = require("../functions/marcarLlamadoHoy");
const createSystemNote = require("../functions/createSystemNote");

const sendSuspension = async (numeroCliente, user) => {
  //console.log('📭 Enviando email aviso a cliente:', numeroCliente, cuentaCorriente);

  try {
    // Buscamos usuario
    const usuario = await Usuario.findByPk(user);
    if (!usuario) throw new Error(`Usuario ${user} no encontrado`);
    if (!usuario.mail)
      throw new Error(`Usuario ${user} no tiene email registrado`);

    //Buscamos Lista de LLamadas de hoy del usuario recibido
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
      throw new Error(
        `No existe lista de llamadas para hoy del usuario ${user}`
      );
    }

    //Buscamos cliente dentro de la lista de llamadas de hoy
    const cliente = listaHoy.clientes.find(
      (c) => String(c.id).trim() === String(numeroCliente).trim()
    );
    if (!cliente)
      throw new Error(`Cliente ${numeroCliente} no está en la lista de hoy`);

    if (!cliente.email)
      throw new Error(`Cliente ${numeroCliente} no tiene email registrado`);

    // Cuerpo del mensaje
    const docsPendientes = (cliente.documentos || []).filter(
      (d) => parseFloat(d.montopendiente) > 0
    );

    if (!docsPendientes.length) {
      throw new Error(
        `Cliente ${numeroCliente} no tiene documentos pendientes`
      );
    }

    const bodyHtml = suspensionTemplate({
      clienteNombre: cliente.name,
      gestoraNombre: usuario.firstname + " " + usuario.lastname,
      facturas: docsPendientes,
      sucursalNombre: getNombreSucursal(usuario.sucursal),
    });

    const result = await sendMailgunMessage({
      sucursal: usuario.sucursal,
      from: `"${usuario.firstname} ${usuario.lastname}" <${process.env.MAIL_USER}>`,
      to: cliente.email,
      cc: usuario.mail,
      replyTo: usuario.mail,
      subject: "Aviso de Suspensión",
      html: bodyHtml,
    });

    await reprogramacion({ id: parseInt(numeroCliente) }, false, user);
    await marcarLLamadoHoy(numeroCliente, user);

    await createSystemNote({
      clientId: numeroCliente,
      userId: user,
      sucursal: usuario.sucursal,
      detail: "Se envió aviso de Suspensión al cliente por email",
    });

    console.log("Aviso enviado:", result.messageId);
    return result;
  } catch (error) {
    console.error("Error en sendSuspension:", error);
    throw error;
  }
};

module.exports = sendSuspension;