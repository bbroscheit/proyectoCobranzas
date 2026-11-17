// Regenera las listas de llamadas del día con los documentos actualizados de GP.
// Conserva los clientes ya llamados y no duplica la gestión del día.
// Uso:  node scripts/regenerarListasHoy.js  (desde la carpeta api, o desde cualquier carpeta con la ruta al script)
//   --sin-sync  → no vuelve a traer documentos de GP, solo regenera las listas
// El .env se busca en la carpeta api aunque el script se ejecute desde otra carpeta
require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });
const { sequelize } = require("../src/bd.js");
const fetchDocumentFromGPEcoPatagonico = require("../src/routes/functions/fetchDocumentGPEcoPatagonico");
const fetchDocumentFromGPUruguay = require("../src/routes/functions/fetchDocumentGPUruguay");
const fetchDocumentFromGPEcobahia = require("../src/routes/functions/fetchDocumentFromGPEcobahia");
const fetchDocumentFromGPEcoportatiles = require("../src/routes/functions/fetchDocumentFromGPEcoportatiles");
const creacionLista = require("../src/routes/functions/creacionLista");

const regenerarListasHoy = async () => {
  if (!process.argv.includes("--sin-sync")) {
    await fetchDocumentFromGPEcoPatagonico();
    await fetchDocumentFromGPUruguay();
    await fetchDocumentFromGPEcobahia();
    await fetchDocumentFromGPEcoportatiles();
  }

  await creacionLista();
  console.log("Listas del día regeneradas");
};

regenerarListasHoy()
  .catch((error) => {
    console.error("Error regenerando listas:", error);
    process.exitCode = 1;
  })
  .finally(() => sequelize.close());
