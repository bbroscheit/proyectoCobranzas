require("dotenv").config();
const sql = require("mssql");
const { Client } = require('../../bd');

const { CRM_USER, CRM_PASSWORD, CRM_SERVER, CRM_DATABASE } = process.env;

// Configuración de la base de datos CRM
const crmConfig = {
  user: CRM_USER,
  password: CRM_PASSWORD,
  server: CRM_SERVER,
  database: CRM_DATABASE,
  options: {
    encrypt: true,
    enableArithAbort: true,
    trustServerCertificate: true,
  },
};

// Función para obtener todos los clientes de la base de datos CRM
const fetchClientsFromCRM = async () => {
  try {
    const pool = await sql.connect(crmConfig);
    const result = await pool
      .request()
      .query(
        "SELECT new_gestordecobranzasidName AS gestor , new_1contactocobridName AS contacto1 , new_apellidonombrerazonsocial AS razonsocial, new_codigodecliente AS codigocliente FROM Account"
      ); // Consulta para obtener todos los clientes
    //console.log("Clientes obtenidos:", result.recordset);

    for (const client of result.recordset) {
        //console.log(client)
      const [existingClient, created] = await Client.findOrCreate({
        where: { id: client.codigocliente },
        defaults: {
          id: client.codigocliente,
          name: client.razonsocial,
          gestor: client.gestor || "Sin asignar",
          contacto1: client.contacto1 || "Sin asignar", 
          //contact2: client.contacto2,
          //email: '',
          //phonenumber:''
        },
      });

      if (!created) {
        console.log(`Cliente con ID ${client.codigocliente} ya existe.`);
      } else {
        console.log(`Cliente con ID ${client.codigocliente} creado.`);
      }
    }
    await pool.close();
  } catch (err) {
    console.error("Error al obtener clientes del CRM:", err);
  }
};

module.exports = fetchClientsFromCRM;
