const { Usuario } = require("../../bd.js"); // ajustá la ruta a donde tengas exportado tu modelo

async function seedUsuarios() {
  try {
    const usuarios = [
       {
      //   username: "Bescudero",
      //   password: "123",
      //   firstname: "Banesa",
      //   lastname: "Escudero",
      //   mail:"bernardo.broscheit@basani.com.ar",
      //   sucursal: 1
      // },
      // {
      //   username: "Bsoria",
      //   password: "123",
      //   firstname: "Belen",
      //   lastname: "Soria",
      //   mail:"bernardo.broscheit@basani.com.ar",
      //   sucursal: 1
      // },
      // {
      //   username: "Flagos",
      //   password: "123",
      //   firstname: "Flavia",
      //   lastname: "Lagos",
      //   mail:"bernardo.broscheit@basani.com.ar",
      //   sucursal: 1
      // },
      // {
      //   username: "Mcardoso",
      //   password: "123",
      //   firstname: "Micaela",
      //   lastname: "Cardoso",
      //   mail:"bernardo.broscheit@basani.com.ar",
      //   sucursal: 1
      // },
      // {
      //   username: "Mechazu",
      //   password: "123",
      //   firstname: "Mara",
      //   lastname: "Echazu",
      //   mail:"bernardo.broscheit@basani.com.ar",
      //   sucursal: 1
      // },
      // {
      //   username: "Ssiron",
      //   password: "123",
      //   firstname: "Soledad",
      //   lastname: "Siron",
      //   mail:"bernardo.broscheit@basani.com.ar",
      //   sucursal: 1
      // },
      // {
      //   username: "Vromero",
      //   password: "123",
      //   firstname: "Victoria",
      //   lastname: "Romero",
      //   mail:"bernardo.broscheit@basani.com.ar",
      //   sucursal: 1
      // },
      // {
      //   username: "Sclauri",
      //   password: "123",
      //   firstname: "Sonia",
      //   lastname: "Clauri",
      //   mail:"bernardo.broscheit@basani.com.ar",
      //   sucursal: 5
      // },
      // {
      //   username: "Gcurcio",
      //   password: "123",
      //   firstname: "Gisella",
      //   lastname: "Curcio",
      //   mail:"bernardo.broscheit@basani.com.ar",
      //   sucursal: 1
      // },
      // {
      //   username: "Aagazarian",
      //   password: "123",
      //   firstname: "Andrea",
      //   lastname: "Agazarian",
      //   mail:"bernardo.broscheit@basani.com.ar",
      //   sucursal: 2
      // }
        username: "Jgarcia",
        password: "123",
        firstname: "Jorgelina",
        lastname: "Garcia",
        mail:"bernardo.broscheit@basani.com.ar",
        sucursal: 6
      },{
        username: "Anavarro",
        password: "123",
        firstname: "Ana",
        lastname: "Navarro",
        mail:"bernardo.broscheit@basani.com.ar",
        sucursal: 6
      }
     
    ];

    await Usuario.bulkCreate(usuarios, { validate: true });
    console.log("✅ Usuarios cargados correctamente");
  } catch (error) {
    console.error("❌ Error al cargar usuarios:", error);
  }
}

module.exports = seedUsuarios;

