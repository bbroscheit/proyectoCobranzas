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

const getFacturasByPromoter = async (clientes) => {
    //console.log("la cantidad de clientes es:" ,clientes.length)
    let totalMontoPorVencerFacturas = 0;
    let cantidadPorVencerFacturas = 0;

    let totalMontoVencidoFacturas = 0;
    let cantidadVencidoFacturas = 0;

    let totalMontoRangoVencido = {
        hasta7Dias: 0,
        entre8y15Dias: 0,
        entre16y30Dias: 0,
        entre31y60Dias: 0,
        entre61y90Dias: 0,
        entre91y120Dias: 0,
        masDe121Dias:0
    };
    let cantidadRangoVencido = {
        hasta7Dias: 0,
        entre8y15Dias: 0,
        entre16y30Dias: 0,
        entre31y60Dias: 0,
        entre61y90Dias: 0,
        entre91y120Dias: 0,
        masDe121Dias:0
    };

    let totalMontoRecibos = 0;
    let cantidadRecibos = 0;

    try {

        // Cierra la conexión si ya existe una abierta
        if (sql.connected) await sql.close();
        
        const pool = await sql.connect(config);
        const request = new sql.Request(pool);

        for (const client of clientes) {
            const clienteId = parseInt(client.cliente, 10); // si es un entero
            const result = await request.query(`
                SELECT
                    RM.DOCNUMBR AS NumeroDocumento,
                    RM.DOCDATE AS FechaDocumento,
                    RM.DUEDATE AS FechaVencimiento,
                    RM.CUSTNMBR AS NumeroCliente,
                    RM.CURTRXAM AS MontoPendiente,
                    RM.RMDTYPAL AS TipoDocumento
                    
                FROM
                    RM20101 AS RM
                WHERE
                    RM.CUSTNMBR = '${clienteId}'
                    AND RM.CURTRXAM > 0
                    AND RM.RMDTYPAL IN (1)
                    
                
            `);
    
            // Procesamos los resultados
            const documentos = result.recordset;
            const hoy = new Date();
    
            documentos.forEach(documento => {
                const fechaVencimiento = new Date(documento.FechaVencimiento);
                const diasVencidos = Math.floor((hoy - fechaVencimiento) / (1000 * 60 * 60 * 24));

                if (fechaVencimiento >= hoy) {
                    cantidadPorVencerFacturas++;
                    totalMontoPorVencerFacturas += documento.MontoPendiente;
                }else{
                    cantidadVencidoFacturas++;
                    totalMontoVencidoFacturas += documento.MontoPendiente;
                    if (diasVencidos <= 7) {
                        cantidadRangoVencido.hasta7Dias++;
                        totalMontoRangoVencido.hasta7Dias += documento.MontoPendiente;
                    } else if (diasVencidos <= 15) {
                        cantidadRangoVencido.entre8y15Dias++;
                        totalMontoRangoVencido.entre8y15Dias += documento.MontoPendiente;
                    } else if (diasVencidos <= 30) {
                        cantidadRangoVencido.entre16y30Dias++;
                        totalMontoRangoVencido.entre16y30Dias += documento.MontoPendiente;
                    } else if (diasVencidos <= 60) {
                        cantidadRangoVencido.entre16y30Dias++;
                        totalMontoRangoVencido.entre16y30Dias += documento.MontoPendiente;
                    } else if (diasVencidos <= 90) {
                        cantidadRangoVencido.entre16y30Dias++;
                        totalMontoRangoVencido.entre16y30Dias += documento.MontoPendiente;
                    } else if (diasVencidos <= 120) {
                        cantidadRangoVencido.entre16y30Dias++;
                        totalMontoRangoVencido.entre16y30Dias += documento.MontoPendiente;
                    } else {
                        cantidadRangoVencido.masDe121Dias++;
                        totalMontoRangoVencido.masDe121Dias += documento.MontoPendiente;
                    }
                }
                
                
            });

            
        }
    
        for (const client of clientes) {
            const clienteId = parseInt(client.cliente, 10);  
            
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
            cantidadRecibos += documentos.length; // Contar documentos
            totalMontoRecibos += documentos.reduce((sum, doc) => sum + doc.MontoRecibo, 0); // Sumar los importes
        }

    return {
        facturas: {
            porVencer: {
                cantidad: cantidadPorVencerFacturas,
                monto: totalMontoPorVencerFacturas,
            },
            vencidas: {
                total: {
                    cantidad: cantidadVencidoFacturas,
                    monto: totalMontoVencidoFacturas,
                },
                hasta7Dias: {
                    cantidad: cantidadRangoVencido.hasta7Dias,
                    monto: totalMontoRangoVencido.hasta7Dias,
                },
                entre8y15Dias: {
                    cantidad: cantidadRangoVencido.entre8y15Dias,
                    monto: totalMontoRangoVencido.entre8y15Dias,
                },
                entre16y30Dias: {
                    cantidad: cantidadRangoVencido.entre16y30Dias,
                    monto: totalMontoRangoVencido.entre16y30Dias,
                },
                entre31y60Dias: {
                    cantidad: cantidadRangoVencido.entre31y60Dias,
                    monto: totalMontoRangoVencido.entre31y60Dias,
                },
                entre61y90Dias: {
                    cantidad: cantidadRangoVencido.entre61y90Dias,
                    monto: totalMontoRangoVencido.entre61y90Dias,
                },
                entre91y120Dias: {
                    cantidad: cantidadRangoVencido.entre91y120Dias,
                    monto: totalMontoRangoVencido.entre91y120Dias,
                },
                masDe121Dias: {
                    cantidad: cantidadRangoVencido.masDe121Dias,
                    monto: totalMontoRangoVencido.masDe121Dias,
                },
            },
        },
        recibos: {
            totalMontoRecibos,
            cantidadRecibos,
        }
    };

    } catch (err) {
        console.error('Error al ejecutar la consulta getFacturasByPromoter:', err);
        throw err;
    } finally {
        await sql.close();
    }
};

module.exports = getFacturasByPromoter;