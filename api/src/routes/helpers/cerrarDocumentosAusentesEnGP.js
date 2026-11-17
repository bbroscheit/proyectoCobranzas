const { sequelize } = require("../../bd.js");

// Si se cerraría más de este porcentaje de los documentos abiertos, se asume que GP
// devolvió datos incompletos y no se toca nada
const MAXIMO_A_CERRAR = 0.5;

// Pone en 0 el saldo de los documentos que siguen abiertos en Postgres pero que GP ya no
// devuelve (anulados, borrados, renumerados o pagados y pasados a histórico).
// docsGP: documentos tal cual vienen de GP (después de excluir prefijos, antes de filtrar por cliente)
const cerrarDocumentosAusentesEnGP = async ({ tabla, docsGP, transaction, etiqueta = tabla }) => {
  if (!docsGP || docsGP.length === 0) {
    console.log(`${etiqueta} - GP no devolvió documentos, no se cierran saldos`);
    return 0;
  }

  // Mismo período que consultan los getAllDocuments*: 1° de enero de hace 2 años → fin del mes actual
  const hoy = new Date();
  const inicioPeriodo = new Date(hoy.getFullYear() - 2, 0, 1).toISOString().split("T")[0];
  const finPeriodo = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0).toISOString().split("T")[0];

  const enGP = new Set(
    docsGP.map(
      (d) => `${String(d.NumeroDocumento).trim()}|${parseInt(String(d.NumeroCliente).trim(), 10)}`
    )
  );

  const abiertos = await sequelize.query(
    `SELECT "id", "numerodocumento", "clientId" FROM "${tabla}"
     WHERE "montopendiente" <> 0 AND "fechadocumento" BETWEEN :inicioPeriodo AND :finPeriodo`,
    { replacements: { inicioPeriodo, finPeriodo }, type: sequelize.QueryTypes.SELECT, transaction }
  );

  const idsACerrar = abiertos
    .filter((d) => !enGP.has(`${d.numerodocumento}|${d.clientId}`))
    .map((d) => d.id);

  if (idsACerrar.length === 0) return 0;

  if (idsACerrar.length > abiertos.length * MAXIMO_A_CERRAR) {
    console.error(
      `${etiqueta} - Se cerrarían ${idsACerrar.length} de ${abiertos.length} documentos abiertos, se omite por seguridad`
    );
    return 0;
  }

  await sequelize.query(
    `UPDATE "${tabla}" SET "montopendiente" = 0, "updatedAt" = NOW() WHERE "id" IN (:idsACerrar)`,
    { replacements: { idsACerrar }, transaction }
  );

  console.log(`${etiqueta} - Documentos cerrados por no existir más en GP: ${idsACerrar.length}`);
  return idsACerrar.length;
};

module.exports = cerrarDocumentosAusentesEnGP;
