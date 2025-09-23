const { Client, Usuario, Document } = require('../../bd');
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

/**
 * Envía un aviso por email a un cliente (y copia al usuario).
 * @param {string} emailText Texto principal del email
 * @param {boolean} cuentaCorriente Si true, adjunta tabla con documentos pendientes
 * @param {number} numeroCliente ID del cliente
 * @param {number} userId ID del usuario que envía
 */

const sendEmailAvisos = async (emailText, cuentaCorriente, numeroCliente, user) => {
  try {
    if (!emailText || String(emailText).trim() === '') {
      console.log('📭 No se envía email: emailText vacío');
      return null;
    }

    // 1. Buscar cliente y usuario
    const cliente = await Client.findByPk(numeroCliente, {
      include: [{ model: Document, as: 'documents' }],
    });
    if (!cliente) throw new Error(`Cliente ${numeroCliente} no encontrado`);

    const usuario = await Usuario.findByPk(user);
    if (!usuario) throw new Error(`Usuario ${user} no encontrado`);

    if (!cliente.contacto?.email) {
      throw new Error(`Cliente ${numeroCliente} no tiene email registrado`);
    }
    if (!usuario.email) {
      throw new Error(`Usuario ${user} no tiene email registrado`);
    }

    // 2. Construir cuerpo del mensaje
    let bodyHtml = `<p>${emailText}</p>`;

    if (cuentaCorriente) {
      const docsPendientes = cliente.documents.filter(
        (d) => parseFloat(d.montopendiente) > 0
      );

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
              <td>${doc.numerodocumento}</td>
              <td>${doc.fechadocumento || '-'}</td>
              <td>${doc.fechavencimiento || '-'}</td>
              <td>${doc.montopendiente}</td>
            </tr>
          `;
        }

        tabla += `</tbody></table>`;
        bodyHtml += tabla;
      }
    }

    // 3. Enviar mail con nodemailer
    const mailOptions = {
      from: `"${usuario.name || 'Usuario'}" <${process.env.MAIL_USER}>`, // usuario que envía
      to: cliente.contacto.email, // destinatario cliente
      cc: usuario.email, // copia al usuario
      subject: 'Aviso de Cuenta',
      html: bodyHtml,
    };

    const result = await transporter.sendMail(mailOptions);

    console.log('Aviso enviado:', result.messageId);
    return result;
  } catch (error) {
    console.error('Error en sendEmailAviso:', error);
    throw error;
  }
};

module.exports = sendEmailAvisos;
