export function getTotalesPorCliente ( documentsData, hoy ){
    const totales = {}
    documentsData.forEach(doc => {
        const clienteId = doc.NumeroCliente.trim()
        const fechaVencimiento = new Date(doc.FechaVencimiento)
        if(!totales[clienteId]) totales[clienteId] = 0
        if(fechaVencimiento >= hoy ) totales[clienteId] += doc.MontoPendiente
    });
    return totales
}


export function getFacturasPorCliente (documentsData, hoy){
    const facturas = {}
    documentsData.forEach(doc => {
        const clienteId = doc.NumeroCliente.trim()
        const fechaVencimiento = new Date(doc.FechaVencimiento)
        if(!facturas[clienteId]) facturas[clienteId] = []
        if(fechaVencimiento >= hoy) facturas[clienteId].push(doc)
    });
    return facturas
}

export function getTotalesVencidosPorCliente (documentsData, hoy){
    const totales = {}
    documentsData.forEach(doc => {
        const clienteId = doc.NumeroCliente.trim()
        const fechaVencimiento = new Date(doc.FechaVencimiento)
        if(!totales[clienteId]) totales[clienteId] = 0
        if(fechaVencimiento < hoy ) totales[clienteId] += doc.MontoPendiente
    });
    return totales
}

export function getFacturasVencidasPorCliente (documentsData, hoy){
    const facturas = {}
    documentsData.forEach(doc => {
        const clienteId = doc.NumeroCliente.trim()
        const fechaVencimiento = new Date(doc.FechaVencimiento)
        if ( !facturas[clienteId] ) facturas[clienteId] = []
        if ( fechaVencimiento < hoy ) facturas[clienteId].push(doc)
    })
    return facturas
}

export function getTotalesRecibosMesPorCliente(documentsData, mesActual, anioActual){
    const recibosMes = {}
    documentsData.forEach(doc => {
        const clienteId = doc.NumeroCliente.trim()
        const fechaDocumento = new Date(doc.FechaDocumento)
        if ( !recibosMes[clienteId] ) recibosMes[clienteId] = 0
        if(
            doc.TipoDocumento === 9 &&
            fechaDocumento.getMonth() === mesActual &&
            fechaDocumento.getFullYear() === anioActual
        ){
            recibosMes[clienteId] += doc.MontoOriginal
        }
    })
    return recibosMes
}

export function getRecibosPorCliente(documentsData){
    const recibos = {}
    documentsData.forEach(doc => {
        const clienteId = doc.NumeroCliente.trim()
        if ( !recibos[clienteId] ) recibos[clienteId] = []
        if ( doc.TipoDocumento === 9 ) recibos[clienteId].push(doc)
    })
    return recibos
}

export function getTotalRecibosMes(documentsData, mesActual, anioActual){
    let total = 0
    documentsData.forEach(doc => {
        const fechaDocumento = new Date(doc.FechaDocumento)
        if(
            doc.TipoDocumento === 9 &&
            fechaDocumento.getMonth() === mesActual &&
            fechaDocumento.getFullYear() === anioActual
        ){
            total += doc.MontoOriginal
        }
    })
    return total
}

export function getTotalFacturasVencidas(documentsData, hoy ){
    let total = 0
    documentsData.forEach(doc => {
        const fechaVencimiento = new Date(doc.FechaVencimiento)
        if(fechaVencimiento < hoy) total += doc.MontoPendiente
    })
    return total
}

export function getDocumentosSinRecibos(documentsData){
    return documentsData.filter(doc => doc.TipoDocumento !== 9)
}

export function getClientes(clientesData, documentsData, alarmasData, notasData, hoy){
    const clientesMap = {}
    clientesData.forEach(
        cliente => {
            clientesMap[cliente.id] = {
                ...cliente,
                documentos : [],
                totalFacturasVencidas : 0,
                totalFacturasSinVencer : 0,
                totalRecibos : 0,
                estado: true
            }
        })
    
    documentsData.forEach(documento => {
        const clienteId = documento.NumeroCliente.trim()
        const fechaVencimiento = new Date(documento.FechaVencimiento)
        if(clientesMap[clienteId]){
            clientesMap[clienteId].documentos.push(documento)
            if(documento.TipoDocumento === 9){
                clientesMap[clienteId].totalRecibos += documento.MontoOriginal
            } else if (fechaVencimiento >= hoy){
                clientesMap[clienteId].totalFacturasSinVencer += documento.MontoPendiente
            } else {
                clientesMap[clienteId].totalFacturasVencidas += documento.MontoPendiente
            }
        }
    })

    if(!alarmasData.state){
        alarmasData.forEach(alarma => {
            if(clientesMap[alarma.clienteId]){
                clientesMap[alarma.clienteId].documentos.push(alarma)
            }
        })
    }

    if(!notasData.state){
        notasData.forEach(nota => {
            if(clientesMap[nota.clienteId]){
                clientesMap[nota.clienteId].documentos.push(nota)
            }
        })
    }

    Object.values(clientesMap).forEach(cliente => {
        cliente.documentos.sort((a,b) => {
            const dateA = a.FechaDocumento ? new Date(a.FechaDocumento) : new Date(a.createdAt)
            const dateB = b.FechaDocumento ? new Date(b.FechaDocumento) : new Date(b.createdAt)
            return dateB - dateA
        })
    })

    return Object.values(clientesMap)
}
