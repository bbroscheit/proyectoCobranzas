const {
  Usuario,
  Document, Documenturuguay, Documentchile, Documentecopatagonico, Documentecobahia, Documentecoportatiles, Documentrosario,
  Client, Clienturuguay, Clientchile, Clientecopatagonico, Clientecobahia, Clientecoportatiles, Clientrosario,
} = require('../../bd');
const { Op } = require('sequelize');
const sendMailgunMessage = require('../helpers/getMailTransporter');
const estadoDeCuentaTemplate = require('../mailModels/estadoDeCuenta');
const { getConfigSucursal } = require('../mailModels/sucursalConfig');
const { TIPOS_DEUDA } = require('../helpers/sucursalModels');

function getModels(sucursal) {
  switch (sucursal) {
    case 1: return { ClientModel: Client,              DocumentModel: Document };
    case 2: return { ClientModel: Clienturuguay,       DocumentModel: Documenturuguay };
    case 3: return { ClientModel: Clientchile,         DocumentModel: Documentchile };
    case 4: return { ClientModel: Clientrosario,       DocumentModel: Documentrosario };
    case 5: return { ClientModel: Clientecopatagonico, DocumentModel: Documentecopatagonico };
    case 6: return { ClientModel: Clientecobahia,      DocumentModel: Documentecobahia };
    case 7: return { ClientModel: Clientecoportatiles, DocumentModel: Documentecoportatiles };
    default: return null;
  }
}

const sendEmailAvisos = async (numeroCliente, user, emailText, cuentaCorriente, destinatario) => {
  try {
    if (!emailText || String(emailText).trim() === '') {
      console.log('📭 No se envía email: emailText vacío');
      return null;
    }

    const usuario = await Usuario.findByPk(user);
    if (!usuario) throw new Error(`Usuario ${user} no encontrado`);

    const models = getModels(usuario.sucursal);
    if (!models) throw new Error(`Sucursal ${usuario.sucursal} no soportada`);
    const { ClientModel, DocumentModel } = models;

    const cliente = await ClientModel.findByPk(numeroCliente);
    if (!cliente) throw new Error(`Cliente ${numeroCliente} no encontrado`);

    const emailDestino = destinatario || cliente.email;
    if (!emailDestino) throw new Error(`Sin email de destino para cliente ${numeroCliente}`);

    const config = getConfigSucursal(usuario.sucursal);
    const gestoraNombre = usuario.sucursal === 6 ? '' : `${usuario.firstname} ${usuario.lastname}`;
    const fromName = usuario.sucursal === 6 ? 'Ecobahia - Cobranzas' : `${usuario.firstname} ${usuario.lastname}`;
    const fromAddress = usuario.sucursal === 6 ? process.env.MAIL_USER_6 : process.env.MAIL_USER;

    let html;

    if (cuentaCorriente) {
      const docs = await DocumentModel.findAll({
        where: {
          clientId: parseInt(numeroCliente),
          montopendiente: { [Op.gt]: 0 },
          tipodocumento: { [Op.in]: TIPOS_DEUDA },
        },
      });

      const facturas = docs.map((d) => {
        const doc = d.toJSON();
        // Ecobahia usa numerodocumento/fechadocumento; el resto usa numero/fecha
        return {
          ...doc,
          numero: doc.numero ?? doc.numerodocumento,
          fecha:  doc.fecha  ?? doc.fechadocumento,
        };
      });

      html = estadoDeCuentaTemplate({
        clienteNombre:       cliente.name || cliente.razonsocial || 'Cliente',
        gestoraNombre,
        facturas,
        sucursalNombre:      config.nombre,
        cuentas:             config.cuentas,
        telefonos:           config.telefonos,
        mensajePersonalizado: emailText.trim(),
      });
    } else {
      html = `
        <html>
          <body style="font-family: Arial, sans-serif;">
            <p style="white-space:pre-line;">${emailText.trim()}</p>
            <br/>
            <p>Atentamente,</p>
            <p>${gestoraNombre ? `<strong>${gestoraNombre}</strong><br/>` : ''}Área de Cobranzas<br/>${config.nombre}</p>
          </body>
        </html>
      `;
    }

    await sendMailgunMessage({
      sucursal:  usuario.sucursal,
      from:      `"${fromName}" <${fromAddress}>`,
      to:        emailDestino,
      replyTo:   fromAddress,
      subject:   'Aviso de Cuenta',
      html,
    });

    console.log(`✅ Aviso enviado → ${emailDestino}`);
  } catch (error) {
    console.error('Error en sendEmailAviso:', error);
    throw error;
  }
};

module.exports = sendEmailAvisos;
