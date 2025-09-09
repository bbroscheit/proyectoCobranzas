const { Usuario } = require("../../bd.js"); // ajustá la ruta a donde tengas exportado tu modelo

async function seedUsuarios() {
  try {
    const usuarios = [
      {
        username: "Bescudero",
        password: "123",
        firstname: "Banesa",
        lastname: "Escudero",
        sucursal: 1
      },
      {
        username: "Bsoria",
        password: "123",
        firstname: "Belen",
        lastname: "Soria",
        sucursal: 1
      },
      {
        username: "Flagos",
        password: "123",
        firstname: "Flavia",
        lastname: "Lagos",
        sucursal: 1
      },
      {
        username: "Mcardoso",
        password: "123",
        firstname: "Micaela",
        lastname: "Cardoso",
        sucursal: 1
      },
      {
        username: "Mechazu",
        password: "123",
        firstname: "Mara",
        lastname: "Echazu",
        sucursal: 1
      },
      {
        username: "Ssiron",
        password: "123",
        firstname: "Soledad",
        lastname: "Siron",
        sucursal: 1
      },
      {
        username: "Vromero",
        password: "123",
        firstname: "Victoria",
        lastname: "Romero",
        sucursal: 1
      },
    ];

    await Usuario.bulkCreate(usuarios, { validate: true });
    console.log("✅ Usuarios cargados correctamente");
  } catch (error) {
    console.error("❌ Error al cargar usuarios:", error);
  }
}

module.exports = seedUsuarios;

