const cron = require("node-cron");
const runExclusive = require("./jobLock");

const fetchClientsFromCRM = require("../routes/functions/fetchClientsFromCRM");
const fetchClientsFromCRMEcoPatagonico = require("../routes/functions/fetchClientsFromCRMEcoPatagonico");
const fetchClientsFromCRMUruguay = require("../routes/functions/fetchClientsFromCRMUruguay");
const fetchClientsFromCRMEcobahia = require("../routes/functions/fetchClientsFromEcobahia");
const fetchClientsFromCRMEcoportatiles = require("../routes/functions/fetchClientsFromCRMEcoportatiles");
const fetchDocumentFromGP = require("../routes/functions/fetchDocumentGP");
const fetchDocumentFromGPEcoPatagonico = require("../routes/functions/fetchDocumentGPEcoPatagonico");
const fetchDocumentFromGPUruguay = require("../routes/functions/fetchDocumentGPUruguay");
const fetchDocumentFromGPEcobahia = require("../routes/functions/fetchDocumentFromGPEcobahia");
const fetchDocumentFromGPEcoportatiles = require("../routes/functions/fetchDocumentFromGPEcoportatiles");

const creacionLista = require("../routes/functions/creacionLista");

const runSyncProcess = async () => {
  await fetchClientsFromCRM();
  await fetchClientsFromCRMEcoPatagonico();
  await fetchClientsFromCRMUruguay();
  await fetchClientsFromCRMEcobahia();
  //await fetchClientsFromCRMEcoportatiles();

  await fetchDocumentFromGP();
  await fetchDocumentFromGPEcoPatagonico();
  await fetchDocumentFromGPUruguay();
  await fetchDocumentFromGPEcobahia();
  //await fetchDocumentFromGPEcoportatiles();

  await creacionLista();
};

// Se ejecuta todos los días a las 5 de la mañana
cron.schedule("00 10 * * *", async () => {
  await runExclusive("SYNC_MASTER", runSyncProcess);
});

console.log("MasterJob cargado");
