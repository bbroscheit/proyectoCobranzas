const dataSources = require("../config/dataSources");
const syncSource = require("./syncSource");

async function syncAllSources() {
  const sources = Object.values(dataSources).filter((v) => typeof v === "object" && v.name);
  const results = await Promise.allSettled(sources.map(syncSource));

  // Log amigable
  results.forEach((r, i) => {
    const name = sources[i].name;
    if (r.status === "fulfilled") {
      console.log(`📦 [${name}] Resultado:`, r.value);
    } else {
      console.error(`❌ [${name}] Falló el servicio:`, r.reason);
    }
  });

  console.log("✨ Sincronización masiva finalizada");
  return results;
}

module.exports = syncAllSources;

