const { Usuario, Listadellamada } = require('../../bd');
const { Op } = require('sequelize');
const nodemailer = require('nodemailer');
const marcarLLamadoHoy = require('../functions/marcarLlamadoHoy');




const transporter = nodemailer.createTransport({
  host: 'mail.basani.com.ar',
  port: process.env.MAIL_PORT,
  secure: true, // true para 465, false para otros puertos
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const sendCuentaCorriente = async (numeroCliente, user ) => {
  //console.log('📭 Enviando email aviso a cliente:', numeroCliente, cuentaCorriente);

  try {
    // Buscamos usuario
    const usuario = await Usuario.findByPk(user);
    if (!usuario) throw new Error(`Usuario ${user} no encontrado`);
    if (!usuario.mail) throw new Error(`Usuario ${user} no tiene email registrado`);

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
      throw new Error(`No existe lista de llamadas para hoy del usuario ${user}`);
    }

    //console.log("lista de llamadas", listaHoy)
    //Buscamos cliente dentro de la lista de llamadas de hoy
    const cliente = listaHoy.clientes.find((c) => String(c.id).trim() === String(numeroCliente).trim());
    if (!cliente) throw new Error(`Cliente ${numeroCliente} no está en la lista de hoy`);

    if (!cliente.email) throw new Error(`Cliente ${numeroCliente} no tiene email registrado`);

    // Cuerpo del mensaje
    let bodyHtml = `<p> Envío de cuenta corriente </p>`;

    const docsPendientes = (cliente.documentos || []).filter(
        (d) => parseFloat(d.montopendiente) > 0
      );
 
      //console.log(`Documentos pendientes para cliente ${numeroCliente}:`, docsPendientes);

      if (docsPendientes.length > 0) {
        let tabla = `
          <h3>Estado de Cuenta Corriente</h3>
          <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse;">
            <thead>
              <tr style="background-color:#f2f2f2;">
                <th>N° Documento</th>
                <th>Fecha</th>
                <th>Vencimiento</th>
                <th>Monto Pendiente</th>
              </tr>
            </thead>
            <tbody>
        `;

        for (const doc of docsPendientes) {
          tabla += `
            <tr>
              <td>${doc.numero}</td>
              <td>${doc.fecha || '-'}</td>
              <td>${doc.diasVencido || '-'}</td>
              <td>${doc.montopendiente}</td>
            </tr>
          `;
        }

        tabla += `</tbody></table>`;
        bodyHtml += tabla;
      }
    

    // Enviamos mail con nodemailer
    const mailOptions = {
      from: `"${usuario.firstname || 'Usuario'}" <${process.env.MAIL_USER}>`, // usuario que envía
      //to: cliente.email, // destinatario cliente
      to: process.env.MAIL_USER,
      cc: usuario.mail, // copia al usuario
      subject: 'Aviso de Cuenta',
      html: bodyHtml,
    };

    //console.log('📭 Enviando email con las siguientes opciones:', mailOptions);

    const result = await transporter.sendMail(mailOptions);

    await marcarLLamadoHoy(numeroCliente, user);

    console.log('Aviso enviado:', result.messageId);
    return result;
  } catch (error) {
    console.error('Error en sendCuentaCorriente:', error);
    throw error;
  }
};

module.exports = sendCuentaCorriente;