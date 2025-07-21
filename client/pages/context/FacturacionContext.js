import React, { createContext, useState, useEffect } from 'react';

// Creamos el contexto
export const FacturacionContext = createContext();

// Creamos el provider 
export const FacturacionProvider = ({ children }) => {
    const [facturas, setFacturas] = useState(null);
    const [totalesPorCliente, setTotalesPorCliente] = useState({});
    const [facturasPorCliente, setFacturasPorCliente] = useState({});
    const [totalesVencidosPorCliente, setTotalesVencidosPorCliente] = useState({});
    const [facturasVencidasPorCliente, setFacturasVencidasPorCliente] = useState({});

    // Nuevos estados para los recibos
    const [totalesRecibosMesPorCliente, setTotalesRecibosMesPorCliente] = useState({});
    const [recibosPorCliente, setRecibosPorCliente] = useState({});

    // Nuevos estados para los totales
    const [totalRecibosMes, setTotalRecibosMes] = useState(0);
    const [totalFacturasSinVencer, setTotalFacturasSinVencer] = useState(0);
    const [totalFacturasVencidas, setTotalFacturasVencidas] = useState(0);

    // Nuevos estados para los documentos sin recibos
    const [documentosSinRecibos, setDocumentosSinRecibos] = useState([])

    // Nuevo estado para los clientes
    const [clientes, setClientes] = useState([])

    useEffect(() => {
        const fetchDocuments = fetch(`http://localhost:3001/allDocuments`).then((res) => res.json());
        const fetchClientes = fetch(`http://localhost:3001/allClients`).then((res) => res.json());
        const fetchAlarmas = fetch(`http://localhost:3001/allAlarms`).then((res) => res.json());
        const fetchNotas = fetch(`http://localhost:3001/allNotes`).then((res) => res.json());

        Promise.all([fetchDocuments, fetchClientes, fetchAlarmas, fetchNotas])
            .then(([documentsData, clientesData, alarmasData, notasData ]) => {
                //console.log('Datos recibidos del back-end:', { documentsData, clientesData, alarmasData, notasData });
                setFacturas(documentsData);

                const documentosFiltrados = documentsData.filter(doc => doc.TipoDocumento !== 9); // el tipo de documento 9 es recibo
                setDocumentosSinRecibos(documentosFiltrados);

                const totalesSinVencer = {};
                const facturasSinVencer = {};
                const totalesVencidos = {};
                const facturasVencidas = {};

                // Estados auxiliares
                const recibosMes = {};
                const todosRecibos = {};

                let totalRecibos = 0;
                let totalSinVencer = 0;
                let totalVencidas = 0;

                const hoy = new Date();
                const mesActual = hoy.getMonth();
                const anioActual = hoy.getFullYear();

                const clientesMap = {};

                clientesData.forEach((cliente) => {
                    clientesMap[cliente.id] = {
                        ...cliente,
                        documentos: [],
                        totalFacturasVencidas: 0,
                        totalFacturasSinVencer: 0,
                        totalRecibos: 0,
                        estado: true
                    };
                });

                documentsData.forEach((documento) => {
                    const clienteId = documento.NumeroCliente.trim();
                    const fechaVencimiento = new Date(documento.FechaVencimiento);

                    if (!totalesSinVencer[clienteId]) {
                        totalesSinVencer[clienteId] = 0;
                        facturasSinVencer[clienteId] = [];
                    }
                    if (!totalesVencidos[clienteId]) {
                        totalesVencidos[clienteId] = 0;
                        facturasVencidas[clienteId] = [];
                    }

                    if (fechaVencimiento >= hoy) {
                        // Facturas sin vencer
                        totalesSinVencer[clienteId] += documento.MontoPendiente;
                        facturasSinVencer[clienteId].push(documento);
                    } else {
                        // Facturas vencidas
                        totalesVencidos[clienteId] += documento.MontoPendiente;
                        facturasVencidas[clienteId].push(documento);
                    }

                    if (clientesMap[clienteId]) {
                        clientesMap[clienteId].documentos.push(documento);

                        if (documento.TipoDocumento === 9) {
                            clientesMap[clienteId].totalRecibos += documento.MontoOriginal;
                        } else if (fechaVencimiento >= hoy) {
                            clientesMap[clienteId].totalFacturasSinVencer += documento.MontoPendiente;
                        } else {
                            clientesMap[clienteId].totalFacturasVencidas += documento.MontoPendiente;
                        }
                    }
                });

                // Agregar alarmas a los clientes correspondientes
                alarmasData.forEach((alarma) => {
                    if (clientesMap[alarma.clientId]) {
                        clientesMap[alarma.clientId].documentos.push(alarma);
                    }
                });

                // Agregar notas a los clientes correspondientes
                notasData.forEach((nota) => {
                    if (clientesMap[nota.clientId]) { 
                        clientesMap[nota.clientId].documentos.push(nota);
                    }
                });

                // Ordenar los documentos, notas y alarmas del más nuevo al más viejo
                Object.values(clientesMap).forEach((cliente) => {
                    cliente.documentos.sort((a, b) => {
                        const dateA = a.FechaDocumento ? new Date(a.FechaDocumento) : new Date(a.createdAt);
                        const dateB = b.FechaDocumento ? new Date(b.FechaDocumento) : new Date(b.createdAt);
                        return dateB - dateA; // Ordenar del más nuevo al más viejo
                    });
                });

                setClientes(Object.values(clientesMap));

                setTotalesPorCliente(totalesSinVencer);
                setFacturasPorCliente(facturasSinVencer);
                setTotalesVencidosPorCliente(totalesVencidos);
                setFacturasVencidasPorCliente(facturasVencidas);

                // Procesar documentos
                documentsData.forEach((documento) => {
                    const cliente = documento.NumeroCliente.trim();
                    const fechaDocumento = new Date(documento.FechaDocumento);

                    // Inicializar los objetos si no existen
                    if (!recibosMes[cliente]) {
                        recibosMes[cliente] = 0;
                        todosRecibos[cliente] = [];
                    }

                    if (documento.TipoDocumento === 9) {
                        // Sumar a todos los recibos por cliente
                        todosRecibos[cliente].push(documento);

                        // Verificar si el recibo pertenece al mes y año actual
                        if (
                            fechaDocumento.getMonth() === mesActual &&
                            fechaDocumento.getFullYear() === anioActual
                        ) {
                            recibosMes[cliente] += documento.MontoOriginal;
                        }
                    }
                });

                // Actualizar estados
                setTotalesRecibosMesPorCliente(recibosMes);
                setRecibosPorCliente(todosRecibos);

                documentsData.recibos.forEach(recibo => {
                    const reciboDate = new Date(recibo.fecha);
                    if (reciboDate.getMonth() === currentMonth && reciboDate.getFullYear() === currentYear) {
                        totalRecibos += recibo.monto;
                    }
                });

                documentsData.facturas.forEach(factura => {
                    const facturaDate = new Date(factura.fechaVencimiento);
                    if (facturaDate > new Date()) {
                        totalSinVencer += factura.monto;
                    } else {
                        totalVencidas += factura.monto;
                    }
                });

                setTotalRecibosMes(totalRecibos);
                setTotalFacturasSinVencer(totalSinVencer);
                setTotalFacturasVencidas(totalVencidas);
                
            })
            .catch((error) => console.error('Error al obtener datos:', error));
    }, []);

    //console.log('Cleintes:', clientes);

    return (
        <FacturacionContext.Provider value={{
            facturas,
            totalesPorCliente,
            facturasPorCliente,
            totalesVencidosPorCliente,
            facturasVencidasPorCliente,
            totalesRecibosMesPorCliente,
            recibosPorCliente,
            totalRecibosMes,
            totalFacturasSinVencer,
            totalFacturasVencidas,
            documentosSinRecibos,
            clientes
        }}>
            {children}
        </FacturacionContext.Provider>
    );
};
