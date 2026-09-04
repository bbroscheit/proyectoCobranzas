const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../../.env") });
const { Documentecobahia, sequelize } = require("../../bd.js");
const { Op } = require("sequelize");

async function limpiarDocumentosInvalidosEcobahia() {
  console.log("Buscando documentos inválidos en Ecobahia (sin 'P' en el nombre)...");

  // Busca todos los documentos que NO son recibos (tipo 9) y cuyo numerodocumento no contiene "P"
  const invalidos = await Documentecobahia.findAll({
    where: {
      tipodocumento: { [Op.ne]: 9 },
      numerodocumento: { [Op.notLike]: "%P%" },
      montopendiente: { [Op.gt]: 0 },
    },
    attributes: ["id", "numerodocumento", "tipodocumento", "clientId", "montopendiente"],
  });

  if (!invalidos.length) {
    console.log("No se encontraron documentos inválidos con saldo pendiente.");
    return;
  }

  console.log(`\nDocumentos inválidos encontrados: ${invalidos.length}`);
  invalidos.forEach(d =>
    console.log(`  ID ${d.id} | Cliente ${d.clientId} | Doc: ${d.numerodocumento} | Tipo: ${d.tipodocumento} | Pendiente: ${d.montopendiente}`)
  );

  const ids = invalidos.map(d => d.id);

  const [actualizados] = await sequelize.query(
    `UPDATE "documentecobahia" SET "montopendiente" = 0, "updatedAt" = NOW() WHERE id IN (:ids)`,
    { replacements: { ids } }
  );

  console.log(`\n✅ Documentos actualizados a montopendiente = 0: ${invalidos.length}`);
}

limpiarDocumentosInvalidosEcobahia().catch(console.error);
