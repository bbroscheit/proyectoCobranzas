require("dotenv").config();
const sql = require("mssql");

const { GP_USER, GP_PASSWORD, GP_SERVER, GP_DATABASE } = process.env;

  const formatDateSQL = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

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
        RM.RMDTYPAL IN (1, 3, 7, 8, 9)
        AND RM.DOCDATE >= '${formatDateSQL(inicioPeriodo)}'
        AND RM.DOCDATE <= '${formatDateSQL(finPeriodo)}'
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

