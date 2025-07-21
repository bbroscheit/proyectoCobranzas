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

const getAllDocuments = async() => {
    try{
        if (sql.connected) await sql.close(); // Cierra la conexión si está abierta
        const pool = await sql.connect(config);
        const request = new sql.Request(pool);

        let documentos = []

        //calcula fecha actual y 13 meses anteriores

        const fechaActual = new Date();
        const inicioPeriodo = new Date(fechaActual.getFullYear(), fechaActual.getMonth() - 13, 1);
        const finPeriodo = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 31);

        const result = await request.query(`
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
                RM.RMDTYPAL IN (1, 3, 7, 9) -- Tipos de documento: Facturas, Notas de Débito, Notas de Crédito, Recibos
                AND RM.VOIDSTTS != 1 -- Excluir recibos anulados
                AND RM.DOCDATE >= '${inicioPeriodo.toISOString().split('T')[0]}' 
                AND RM.DOCDATE <= '${finPeriodo.toISOString().split('T')[0]}' 
        `);

        documentos = documentos.concat(result.recordset);

        await pool.close();
        return documentos;
    } catch (err) {
        console.error("Error al ejecutar la consulta:", err);
        throw err;
    } finally {
        await sql.close();
    }
}

module.exports = getAllDocuments;