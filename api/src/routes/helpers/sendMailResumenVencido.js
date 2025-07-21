require('dotenv').config();

const nodemailer = require('nodemailer');
const { MAIL_USER, MAIL_PASS, MAIL_PORT} = process.env

// Configuración del transporter (SMTP)
const transporter = nodemailer.createTransport({
  host: 'mail.basani.com.ar',
  port: MAIL_PORT,
  secure: true, // true para 465, false para otros puertos
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASS,
  },
});

// Función para enviar correo electrónico
const sendEmail = async ( to, subject, message ) => {
  
  try {
    
    const info = await transporter.sendMail({
      from: 'mesadeayuda@basani.com.ar',
      to: to,
      subject : subject,
      html : message,
      //   ` <p>Buenos días,</p>
      //     <p>Le mesa de ayuda le informa que su soporte se ha registrado con éxito.</p>
      //     <p>Su número de ticket es el: <strong> ${findTicket.id}</strong></p>
      //     <p>Recuerde que podrá realizar el seguimiento del estado de su ticket desde la App Soporte Basani SA haciendo click <a href="http://${LOCALHOST}:${PORTFRONT}/soportes/${findTicket.id}"><strong>aqui</strong></a>.</p>
      //     <div style="text-align: center;">
      //       <p>Muchas gracias</p>
      //       <p><strong>Mesa de Ayuda</strong></p>
      //     </div>
      // `,
    });

    console.log('Correo electrónico enviado:', info.messageId);
    
  } catch (error) {
    console.error('Error al enviar el correo electrónico:', error);
  }
};

module.exports = sendEmail;