const sql = require('mssql');

const config = {
    user: 'sa',
    password: 'Barriletec0smic',
    server: 'SQL2-BA\\GP',
    database: 'PRD01',
    options: {
        trustedConnection: true,
        encrypt: true,
        enableArithAbort: true,
        trustServerCertificate: true,
    
    },
};

const getRecibosByPromoter = async (recibos) => {
    console.log("la cantidad de clientes es:" ,recibos.length)
    let clients = recibos // traigo todos los clientes de un promotor
    let totalMontoRecibo = 0; // Variable para sumar los importes
    let totalDocumentos = 0;   // Variable para contar los documentos


    try {
        // conectamos
        await sql.connect(config);

        const request = new sql.Request();

        for (const client of clients) {
            const clienteId = client.cliente; // Obtén el número de cliente
            
            // Ejecutamos la consulta para cada cliente
            const result = await request.query(`
                SELECT
                    RM.DOCNUMBR AS NumeroRecibo,
                    RM.DOCDATE AS FechaRecibo,
                    RM.CUSTNMBR AS NumeroCliente,
                    RM.ORTRXAMT AS MontoRecibo
                FROM
                    RM20101 AS RM
                WHERE
                    RM.RMDTYPAL = 9 -- 9 es el tipo de documento para recibos/pagos
                    AND RM.CUSTNMBR = '${clienteId}' -- Filtramos por el cliente
                    AND YEAR(RM.DOCDATE) = YEAR(GETDATE()) -- Año actual
                    AND MONTH(RM.DOCDATE) = MONTH(GETDATE()) -- Mes actual
            `);

            // Sumar los importes y contar los documentos
            const documentos = result.recordset;
            totalDocumentos += documentos.length; // Contar documentos
            totalMontoRecibo += documentos.reduce((sum, doc) => sum + doc.MontoRecibo, 0); // Sumar los importes
        }
      
        return {
            totalMontoRecibo,
            totalDocumentos
        };

    } catch (err) {
        
        console.error('Error al ejecutar la consulta getRecibosByPromotor:', err);
        return err

    } finally {

        // Cerramos
        await sql.close();
    }
}

module.exports = getRecibosByPromoter;
