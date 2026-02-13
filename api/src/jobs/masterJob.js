const cron = require("node-cron");
const runExclusive = require("./jobLock");

const fetchClientsFromCRM = require("../routes/functions/fetchClientsFromCRM");
const fetchClientsFromCRMEcoPatagonico = require("../routes/functions/fetchClientsFromCRMEcoPatagonico");
const fetchDocumentFromGP = require("../routes/functions/fetchDocumentGP");
const fetchDocumentFromGPEcoPatagonico = require("../routes/functions/fetchDocumentGPEcoPatagonico");
const creacionLista = require("../routes/functions/creacionLista");

const runSyncProcess = async () => {
  await fetchClientsFromCRM();
  await fetchClientsFromCRMEcoPatagonico();

  await fetchDocumentFromGP();
  await fetchDocumentFromGPEcoPatagonico();

  await creacionLista();
};

// Se ejecuta todos los días a las 12:00 pero deberia de ser a las 3 de la mañana, se cambió para probarlo
cron.schedule("0 3 * * *", async () => {
  await runExclusive("SYNC_MASTER", runSyncProcess);
});

console.log("🕒 MasterJob cargado");
