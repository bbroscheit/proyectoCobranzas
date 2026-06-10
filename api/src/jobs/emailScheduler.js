const cron = require("node-cron");
const queueEstadoCuenta   = require("../routes/functions/email/queueEstadoCuenta");
const queueFacturaEmitida  = require("../routes/functions/email/queueFacturaEmitida");
const queueFacturaPorVencer = require("../routes/functions/email/queueFacturaPorVencer");
const queueFacturaVencida  = require("../routes/functions/email/queueFacturaVencida");

// ─── Estado de Cuenta ─────────────────────────────────────────────────────────
// Todos los días 5 de cada mes a las 09:00 (hora servidor)
cron.schedule("0 9 5 * *", async () => {
  try {
    await queueEstadoCuenta();
  } catch (err) {
    console.error("emailScheduler - queueEstadoCuenta:", err.message);
  }
});

// ─── Factura Emitida, Por Vencer, Vencida ─────────────────────────────────────
// Todos los días a las 07:00 (hora servidor), después de que el sync de datos ya corrió
cron.schedule("0 7 * * *", async () => {
  try {
    await queueFacturaEmitida();
  } catch (err) {
    console.error("emailScheduler - queueFacturaEmitida:", err.message);
  }

  try {
    await queueFacturaPorVencer();
  } catch (err) {
    console.error("emailScheduler - queueFacturaPorVencer:", err.message);
  }

  try {
    await queueFacturaVencida();
  } catch (err) {
    console.error("emailScheduler - queueFacturaVencida:", err.message);
  }
});

console.log("EmailScheduler cargado — Estado de cuenta: día 5 a las 09:00 | Facturas: diario a las 07:00");
