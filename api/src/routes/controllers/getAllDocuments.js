// require("dotenv").config({path: "../../../.env"} );
// const sql = require("mssql");
// const server = require("../../app");

// const { GP_USER, GP_PASSWORD, GP_SERVER, GP_DATABASE } = process.env;

// const config = {
//     user: GP_USER,
//     password:  GP_PASSWORD,
//     server: GP_SERVER,
//     //server: 'SQL2-BA',
//     database: GP_DATABASE,
//     options: {
//         //instanceName: "GP",
//         trustedConnection: true,
//         encrypt: true,
//         enableArithAbort: true,
//         trustServerCertificate: true,
//     },
// };

// console.log("Configuración GP:", config);

// const getAllDocuments = async () => {
//   // try {
//     // if (sql.connected) await sql.close();
//     // const pool = await sql.connect(config);
//     // const request = new sql.Request(pool);

//     const fechaActual = new Date();
//     const anioLimite = fechaActual.getFullYear() - 2;
//     const inicioPeriodo = new Date(anioLimite, 0, 1); // 1° enero hace 2 años
//     const finPeriodo = new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, 0); // fin mes actual

//     const query = `
//       SELECT
//         RM.DOCNUMBR AS NumeroDocumento,
//         RM.DOCDATE AS FechaDocumento,
//         RM.DUEDATE AS FechaVencimiento,
//         RM.CUSTNMBR AS NumeroCliente,
//         RM.CURTRXAM AS MontoPendiente,
//         RM.ORTRXAMT AS MontoOriginal,
//         RM.RMDTYPAL AS TipoDocumento
//       FROM
//         RM20101 AS RM
//       WHERE
//         RM.RMDTYPAL IN (1, 3, 7, 9)
//         AND RM.VOIDSTTS != 1
//         AND RM.DOCDATE >= '${inicioPeriodo.toISOString().split('T')[0]}'
//         AND RM.DOCDATE <= '${finPeriodo.toISOString().split('T')[0]}'
//     `;

//   //   const result = await request.query(query);

//   //   await pool.close();
//   //   //return result.recordset;
//   //   console.log(`Documentos obtenidos de GP: ${result.recordset.length}`);

//   // } catch (err) {
//   //   console.error("Error al ejecutar la consulta:", err);
//   //   throw err;
//   // } finally {
//   //   await sql.close();
//   // }
// let pool;
//   try {
//     pool = await sql.connect(config);
//     const result = await pool.request().query(query);
//     console.log(`Documentos obtenidos de GP: ${result.recordset.length}`);
//     return result.recordset;
//   } catch (err) {
//     console.error("Error al ejecutar la consulta:", err);
//     throw err;
//   } finally {
//     if (pool) await pool.close();
//   }
// }

// //};

// module.exports = getAllDocuments;

require("dotenv").config();
const sql = require("mssql");

const { GP_USER, GP_PASSWORD, GP_SERVER, GP_DATABASE } = process.env;

const config = {
    user: GP_USER,
    password:  GP_PASSWORD,
    server: GP_SERVER,
    database: GP_DATABASE,
    options: {
        trustedConnection: true,
        encrypt: true,
        enableArithAbort: true,
        trustServerCertificate: true,
    },
};

const getAllDocuments = async () => {
  try {
    if (sql.connected) await sql.close();
    const pool = await sql.connect(config);
    const request = new sql.Request(pool);

    const fechaActual = new Date();
    const anioLimite = fechaActual.getFullYear() - 2;
    const inicioPeriodo = new Date(anioLimite, 0, 1); // 1° enero hace 2 años
    const finPeriodo = new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, 0); // fin mes actual

    const query = `
      SELECT
        RM.DOCNUMBR AS NumeroDocumento,
        RM.DOCDATE AS FechaDocumento,
        RM.DUEDATE AS FechaVencimiento,
        RM.CUSTNMBR AS NumeroCliente,
        RM.CURTRXAM AS MontoPendiente,
        RM.ORTRXAMT AS MontoOriginal,
        RM.RMDTYPAL AS TipoDocumento
      FROM
        RM20101 AS RM
      WHERE
        RM.RMDTYPAL IN (1, 3, 7, 9)
        AND RM.VOIDSTTS != 1
        AND RM.DOCDATE >= '${inicioPeriodo.toISOString().split('T')[0]}'
        AND RM.DOCDATE <= '${finPeriodo.toISOString().split('T')[0]}'
    `;

    const result = await request.query(query);

    await pool.close();
    return result.recordset;

  } catch (err) {
    console.error("Error al ejecutar la consulta:", err);
    throw err;
  } finally {
    await sql.close();
  }
};

module.exports = getAllDocuments;

