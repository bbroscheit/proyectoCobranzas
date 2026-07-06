const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../../.env") });

const { Usuario, Listadellamada, Gestion } = require("../../bd");

// ── Sucursal a resetear ──────────────────────────────────────────────────────
const SUCURSAL_ID = 6; // Ecobahia
// ────────────────────────────────────────────────────────────────────────────

async function resetearSucursal() {
  console.log(`\n🔄 Reseteando datos de sucursal ${SUCURSAL_ID}...`);

  // 1. Obtener usuarios de la sucursal
  const usuarios = await Usuario.findAll({
    where: { sucursal: SUCURSAL_ID },
    attributes: ["id", "firstname", "lastname"],
  });

  if (!usuarios.length) {
    console.log(`⚠️  No se encontraron usuarios para la sucursal ${SUCURSAL_ID}`);
    process.exit(0);
  }

  const usuarioIds = usuarios.map((u) => u.id);
  console.log(`👥 Usuarios encontrados: ${usuarios.map((u) => `${u.firstname} ${u.lastname} (ID ${u.id})`).join(", ")}`);

  // 2. Borrar listas de llamadas
  const listasEliminadas = await Listadellamada.destroy({
    where: { usuarioId: usuarioIds },
  });
  console.log(`🗑️  Listas de llamadas eliminadas: ${listasEliminadas}`);

  // 3. Borrar gestiones
  const gestionesEliminadas = await Gestion.destroy({
    where: { usuarioId: usuarioIds },
  });
  console.log(`🗑️  Gestiones eliminadas: ${gestionesEliminadas}`);

  console.log(`\n✅ Reset completo para sucursal ${SUCURSAL_ID}`);
}

resetearSucursal().catch(console.error);
