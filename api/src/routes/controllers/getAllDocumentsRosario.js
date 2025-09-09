require("dotenv").config();
const sql = require("mssql");

const { GP_USER, GP_PASSWORD, GP_SERVER_ROSARIO, GP_DATABASE_ROSARIO } = process.env;

const config = {
    user: GP_USER,
    password:  GP_PASSWORD,
    server: GP_SERVER_ROSARIO,
    database: GP_DATABASE_ROSARIO,
    options: {
        trustedConnection: true,
        encrypt: true,
        enableArithAbort: true,
        trustServerCertificate: true,
    },
};

const getAllDocumentsRosario = async () => {
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

module.exports = getAllDocumentsRosario;