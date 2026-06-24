const { Usuario, Listadellamada } = require("../../bd");
const { Op } = require("sequelize");
const preSuspensionTemplate = require("../mailModels/preSuspension");
const { getNombreSucursal } = require("../mailModels/sucursales");
const { getConfigSucursal } = require("../mailModels/sucursalConfig");
const sendMailgunMessage = require("../helpers/getMailTransporter");
const reprogramacion = require("../functions/reprogramacion");
const marcarLLamadoHoy = require("../functions/marcarLlamadoHoy");
const createSystemNote = require("../functions/createSystemNote");

const sendPreSuspension = async (numeroCliente, user, destinatario) => {
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

    const emailDestino = destinatario || cliente.email;
    if (!emailDestino)
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

    const config = getConfigSucursal(usuario.sucursal);
    const bodyHtml = preSuspensionTemplate({
      clienteNombre: cliente.name,
      gestoraNombre: usuario.sucursal === 6 ? "" : `${usuario.firstname} ${usuario.lastname}`,
      facturas: docsPendientes,
      sucursalNombre: getNombreSucursal(usuario.sucursal),
      cuentas: config.cuentas,
      telefonos: config.telefonos,
    });

    const result = await sendMailgunMessage({
      sucursal: usuario.sucursal,
      from: `"${usuario.firstname} ${usuario.lastname}" <${process.env.MAIL_USER}>`,
      to: emailDestino,
      replyTo: usuario.mail,
      subject: "Aviso de Pre-Suspensión",
      html: bodyHtml,
    });

    await reprogramacion({ id: parseInt(numeroCliente) }, false, user);
    await marcarLLamadoHoy(numeroCliente, user);

    await createSystemNote({
      clientId: numeroCliente,
      userId: user,
      sucursal: usuario.sucursal,
      detail: "Se envió aviso de Pre-Suspensión al cliente por email",
    });

    console.log("Aviso enviado:", result.messageId);
    return result;
  } catch (error) {
    console.error("Error en sendPreSuspension:", error);
    throw error;
  }
};

module.exports = sendPreSuspension;