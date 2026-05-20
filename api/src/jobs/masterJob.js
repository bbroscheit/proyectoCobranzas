const cron = require("node-cron");
const runExclusive = require("./jobLock");

const fetchClientsFromCRM = require("../routes/functions/fetchClientsFromCRM");
const fetchClientsFromCRMEcoPatagonico = require("../routes/functions/fetchClientsFromCRMEcoPatagonico");
const fetchClientsFromCRMUruguay = require("../routes/functions/fetchClientsFromCRMUruguay");
const fetchDocumentFromGP = require("../routes/functions/fetchDocumentGP");
const fetchDocumentFromGPEcoPatagonico = require("../routes/functions/fetchDocumentGPEcoPatagonico");
const fetchDocumentFromGPUruguay = require("../routes/functions/fetchDocumentGPUruguay");
const creacionLista = require("../routes/functions/creacionLista");

const runSyncProcess = async () => {
  await fetchClientsFromCRM();
  await fetchClientsFromCRMEcoPatagonico();
  await fetchClientsFromCRMUruguay();

  await fetchDocumentFromGP();
  await fetchDocumentFromGPEcoPatagonico();
  await fetchDocumentFromGPUruguay();

  await creacionLista();
};

// Se ejecuta todos los días a las 5 de la mañana
cron.schedule("41 11 * * *", async () => {
  await runExclusive("SYNC_MASTER", runSyncProcess);
});

console.log("MasterJob cargado");
