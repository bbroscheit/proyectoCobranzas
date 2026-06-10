const cron = require("node-cron");
const { Mailqueue } = require("../bd");
const sendMailgunMessage = require("../routes/helpers/getMailTransporter");

const processMailQueue = async () => {
  const pendientes = await Mailqueue.findAll({
    where: { status: "pending" },
    limit: 50,
  });

  if (pendientes.length === 0) return;

  for (const mail of pendientes) {
    try {
      await sendMailgunMessage({
        sucursal: mail.sucursal || 1,
        from: mail.from || `Cobranzas <${process.env.MAIL_USER}>`,
        to: mail.to,
        cc: mail.cc || null,
        replyTo: mail.replyTo || null,
        subject: mail.subject,
        html: mail.html,
      });

      mail.status = "sent";
      mail.sentAt = new Date();
      await mail.save();
    } catch (err) {
      mail.status = "failed";
      mail.error = err.message;
      await mail.save();
      console.error(`❌ Error enviando mail id=${mail.id} to=${mail.to}:`, err.message);
    }
  }

  console.log(`✅ MailWorker: procesados ${pendientes.length} mails`);
};

cron.schedule("*/5 * * * *", processMailQueue);

console.log("MailWorker cargado");
