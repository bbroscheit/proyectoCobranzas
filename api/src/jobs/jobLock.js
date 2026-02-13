let running = false;

const runExclusive = async (jobName, fn) => {
  if (running) {
    console.log(`⏳ Job ${jobName} omitido: otro proceso en ejecución`);
    return;
  }

  try {
    running = true;
    console.log(`🚀 Iniciando job: ${jobName}`);
    await fn();
    console.log(`✅ Finalizó job: ${jobName}`);
  } catch (err) {
    console.error(`❌ Error en job ${jobName}:`, err);
  } finally {
    running = false;
  }
};

module.exports = runExclusive;
