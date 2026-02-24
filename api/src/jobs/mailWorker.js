const cron = require("node-cron");
const { MailQueue } = require("../bd");

const processMailQueue = async () => {
  const pendientes = await MailQueue.findAll({
    where: { status: "pending" },
    limit: 50, // lote controlado
  });

  for (const mail of pendientes) {
    try {
      await enviarMail(mail); 
      mail.status = "sent";
      mail.sentAt = new Date();
      await mail.save();
    } catch (err) {
      mail.status = "failed";
      mail.error = err.message;
      await mail.save();
    }
  }

  console.log(`Procesados ${pendientes.length} mails`);
};

cron.schedule("*/5 * * * *", processMailQueue);

console.log("MailWorker cargado");
