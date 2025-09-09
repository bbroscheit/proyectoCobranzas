const { Client } = require('../../bd');

const getAllClients = async () => {
    try {
      const clients = await Client.findAll();
        if (clients.length > 0) {
            //console.log('Clients fetched successfully:', clients);
            return clients;
        } else {
            return null;
        }
      
    } catch (error) {
      console.error('Error fetching clients:', error);
      throw error;
    }
  };

module.exports = getAllClients;

// require("dotenv").config({path: "../../../.env"} );
// const sql = require("mssql");

// const { CRM_USER, CRM_PASSWORD, CRM_SERVER, CRM_DATABASE } = process.env;


// // Configuración de la base de datos CRM
// const crmConfig = {
//   user: CRM_USER,
//   password: CRM_PASSWORD,
//   server: CRM_SERVER,
//   database: CRM_DATABASE,
//   options: {
//     encrypt: true,
//     enableArithAbort: true,
//     trustServerCertificate: true,
//   },
// };

// //console.log("Configuración CRM:", crmConfig);

// // Función para obtener todos los clientes de la base de datos CRM
// const getAllClients = async () => {
//   try {
//     const pool = await sql.connect(crmConfig);
//     const result = await pool
//       .request()
//       .query( `
//         SELECT 
//           new_gestordecobranzasidName AS gestor , 
//           new_1contactocobridName AS contacto1 , 
//           new_apellidonombrerazonsocial AS razonsocial, 
//           new_codigodecliente AS codigocliente, 
//           new_facturacionelectronica AS email 
//         FROM 
//           Account`
//       ); 
    

    
//     await pool.close();
//     console.log("Clientes obtenidos del CRM:", result.recordset.length);  
//     return result.recordset;
  
    
//   } catch (err) {
//     console.error("Error al obtener clientes del CRM:", err);
//   }
// };

// module.exports = getAllClients;