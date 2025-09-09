const cron = require("node-cron");
const syncAllSources = require("../services/syncAllSources");

// Ej: todos los días a las 3:00
cron.schedule("0 3 * * *", async () => {
  console.log("🚀 Iniciando sincronización masiva (todas las fuentes)");
  await syncAllSources();
});
