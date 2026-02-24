const { Usuario, Listadellamada } = require('../../bd');
const { Op } = require('sequelize');
const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
  host: 'mail.basani.com.ar',
  port: process.env.MAIL_PORT,
  secure: true, // true para 465, false para otros puertos
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const sendEmailAvisos = async (numeroCliente, user, emailText, cuentaCorriente) => {
   function formatearFecha(fecha) {
    if (!fecha || fecha === 0) return "-";
    const f = new Date(fecha);
    if (isNaN(f)) return "-";
    return f.toLocaleDateString("es-AR").replaceAll("/", "-");
  }


  try {
    if (!emailText || String(emailText).trim() === '') {
      console.log('📭 No se envía email: emailText vacío');
      return null;
    }

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

    //Buscamos cliente dentro de la lista de llamadas de hoy
    const cliente = listaHoy.clientes.find((c) => String(c.id).trim() === String(numeroCliente).trim());
    if (!cliente) throw new Error(`Cliente ${numeroCliente} no está en la lista de hoy`);

    if (!cliente.email) throw new Error(`Cliente ${numeroCliente} no tiene email registrado`);

    // Cuerpo del mensaje
    let bodyHtml = `<p>${emailText}</p>`;

    if (cuentaCorriente) {
      const docsPendientes = (cliente.documentos || []).filter(
        (d) => parseFloat(d.montopendiente) > 0
      );
 
      
      console.log(`Documentos pendientes para cliente ${numeroCliente}:`, docsPendientes);
      console.log(`usuario:`, usuario);

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
              <td>${formatearFecha(doc.fecha || '-')}</td>
              <td>${formatearFecha(doc.fechavencimiento || '-')}</td>
              <td>$${Number(doc.montopendiente).toLocaleString("es-AR")}</td>
            </tr>
          `;
        }

        tabla += `</tbody></table>`;
        bodyHtml += tabla;
      }
    }

    // Enviamos mail con nodemailer
    const mailOptions = {
      from: `"${usuario.firstname || 'Usuario'}" <${usuario.mail}>`, // usuario que envía
      //to: cliente.email, // destinatario cliente
      to: process.env.MAIL_USER,
      cc: usuario.mail, // copia al usuario
      subject: 'Aviso de Cuenta',
      html: bodyHtml,
    };

    //console.log('📭 Enviando email con las siguientes opciones:', mailOptions);

    const result = await transporter.sendMail(mailOptions);

    console.log('Aviso enviado:', result.messageId);
    return result;
  } catch (error) {
    console.error('Error en sendEmailAviso:', error);
    throw error;
  }
};

module.exports = sendEmailAvisos;
