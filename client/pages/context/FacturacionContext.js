import React, { createContext, useState, useEffect } from 'react';
import {
    getTotalesPorCliente,
    getFacturasPorCliente,
    getTotalesVencidosPorCliente,
    getFacturasVencidasPorCliente,
    getTotalesRecibosMesPorCliente,
    getRecibosPorCliente,
    getTotalRecibosMes,
    getTotalFacturasVencidas,
    getDocumentosSinRecibos,
    getClientes
} from './facturacionUtils'

// Creamos el contexto
export const FacturacionContext = createContext();

// Creamos el provider 
export const FacturacionProvider = ({ children }) => {
    const [facturas, setFacturas] = useState(null);
    const [totalesPorCliente, setTotalesPorCliente] = useState({});
    const [facturasPorCliente, setFacturasPorCliente] = useState({});
    const [totalesVencidosPorCliente, setTotalesVencidosPorCliente] = useState({});
    const [facturasVencidasPorCliente, setFacturasVencidasPorCliente] = useState({});
    const [totalesRecibosMesPorCliente, setTotalesRecibosMesPorCliente] = useState({});
    const [recibosPorCliente, setRecibosPorCliente] = useState({});
    const [totalRecibosMes, setTotalRecibosMes] = useState(0);
    const [totalFacturasSinVencer, setTotalFacturasSinVencer] = useState(0);
    const [totalFacturasVencidas, setTotalFacturasVencidas] = useState(0);
    const [documentosSinRecibos, setDocumentosSinRecibos] = useState([])
    const [clientes, setClientes] = useState([])

    useEffect(() => {
        const fetchDocuments = fetch(`http://${process.env.NEXT_PUBLIC_LOCALHOST}:3001/allDocuments`).then((res) => res.json());
        const fetchClientes = fetch(`http://${process.env.NEXT_PUBLIC_LOCALHOST}:3001/allClients`).then((res) => res.json());
        const fetchAlarmas = fetch(`http://${process.env.NEXT_PUBLIC_LOCALHOST}:3001/allAlarms`).then((res) => res.json());
        const fetchNotas = fetch(`http://${process.env.NEXT_PUBLIC_LOCALHOST}:3001/allNotes`).then((res) => res.json());

        Promise.all([fetchDocuments, fetchClientes, fetchAlarmas, fetchNotas])
            .then(([documentsData, clientesData, alarmasData, notasData ]) => {
                //console.log('Datos recibidos del back-end:', { documentsData, clientesData, alarmasData, notasData });
                setFacturas(documentsData);
                setClientes(getClientes(clientesData, documentsData, alarmasData, notasData, new Date()));
                setTotalesPorCliente(getTotalesPorCliente(documentsData, new Date()));
                setFacturasPorCliente(getFacturasPorCliente(documentsData));
                setTotalesVencidosPorCliente(getTotalesVencidosPorCliente(documentsData, new Date()));
                setFacturasVencidasPorCliente(getFacturasVencidasPorCliente(documentsData, new Date()));
                setTotalesRecibosMesPorCliente(getTotalesRecibosMesPorCliente(documentsData, new Date().getMonth(), new Date().getFullYear()));
                setRecibosPorCliente(getRecibosPorCliente(documentsData));
                setTotalRecibosMes(getTotalRecibosMes(documentsData, new Date().getMonth(), new Date().getFullYear()));
                setTotalFacturasSinVencer(getTotalFacturasVencidas(documentsData, new Date()));
                setTotalFacturasVencidas(getTotalFacturasVencidas(documentsData, new Date()));
                setDocumentosSinRecibos(getDocumentosSinRecibos(documentsData));
                setClientes(getClientes(clientesData, documentsData, alarmasData, notasData, new Date()));               
            })
            .catch((error) => console.error('Error al obtener datos:', error));
    }, []);

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
