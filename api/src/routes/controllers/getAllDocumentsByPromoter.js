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

const getAllDocumentsByPromoter = async (clientes) => {
    console.log("Cantidad de clientes:", clientes.length);

    try {
        if (sql.connected) await sql.close(); // Cierra la conexión si está abierta
        const pool = await sql.connect(config);
        const request = new sql.Request(pool);

        let documentos = []; // Array para consolidar todos los documentos

        // Fecha actual y de diciembre del año anterior
        const fechaActual = new Date();
        const inicioDiciembreAnterior = new Date(fechaActual.getFullYear() - 1, 11, 1); // 1 de diciembre del año anterior
        const finDiciembreAnterior = new Date(fechaActual.getFullYear() - 1, 11, 31); // 31 de diciembre del año anterior

        for (const client of clientes) {
            const clienteId = parseInt(client.cliente, 10); // Asegurar que sea un entero

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
                    RM.CUSTNMBR = '${clienteId}' -- Filtrar por cliente
                    AND RM.RMDTYPAL IN (1, 3, 7, 9) -- Tipos de documento: Facturas, Notas de Débito, Notas de Crédito, Recibos
                    AND RM.VOIDSTTS != 1 -- Excluir recibos anulados
                    AND (
                        (RM.DOCDATE >= '${inicioDiciembreAnterior.toISOString().split('T')[0]}' AND RM.DOCDATE <= '${finDiciembreAnterior.toISOString().split('T')[0]}') -- Para documentos de diciembre del año anterior
                        OR (YEAR(RM.DOCDATE) = YEAR(GETDATE())) -- O documentos del año en curso
                    )
            `);

            // Agregar los resultados al array consolidado
            documentos = documentos.concat(result.recordset);
        }

        return documentos; // Devolver el array consolidado de documentos

    } catch (err) {
        console.error('Error al ejecutar la consulta:', err);
        throw err;
    } finally {
        await sql.close();
    }
};

module.exports = getAllDocumentsByPromoter;