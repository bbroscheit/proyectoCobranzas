const { Usuario, Listadellamada } = require("../../bd");
const { Op } = require("sequelize");
const nodemailer = require("nodemailer");
const estadoDeCuentaTemplate = require("../mailModels/estadoDeCuenta");
const marcarLLamadoHoy = require("../functions/marcarLlamadoHoy");
const createSystemNote = require("../functions/createSystemNote");

const transporter = nodemailer.createTransport({
  host: "mail.basani.com.ar",
  port: process.env.MAIL_PORT,
  secure: true, // true para 465, false para otros puertos
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const sendCuentaCorriente = async (numeroCliente, user) => {
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

    const bodyHtml = estadoDeCuentaTemplate({
      clienteNombre: cliente.name,
      gestoraNombre: usuario.firstname + " " + usuario.lastname,
      facturas: docsPendientes,
    });

    // Enviamos mail con nodemailer
    const mailOptions = {
      from: `"${usuario.firstname || "Usuario"}" <${usuario.mail}>`, // usuario que envía
      to: cliente.email, // destinatario cliente
      //to: process.env.MAIL_USER,
      cc: usuario.mail, // copia al usuario
      subject: "Aviso de Cuenta",
      html: bodyHtml,
    };

    //console.log('Enviando email con las siguientes opciones:', mailOptions);

    const result = await transporter.sendMail(mailOptions);

    await marcarLLamadoHoy(numeroCliente, user);

    await createSystemNote({
      clientId: numeroCliente,
      userId: user,
      sucursal: usuario.sucursal,
      detail: "Se envió cuenta corriente al cliente por email",
    });

    console.log("Aviso enviado:", result.messageId);
    return result;
  } catch (error) {
    console.error("Error en sendCuentaCorriente:", error);
    throw error;
  }
};

module.exports = sendCuentaCorriente;
