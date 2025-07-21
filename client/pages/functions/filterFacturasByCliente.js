export function filterFacturasByCliente(clientes, clienteId) {
    
    const clienteIdInt = parseInt(clienteId, 10);
    const cliente = clientes.find(c => c.id === clienteIdInt);

    if (!cliente || !cliente.documentos) {
        return [];
    }

    const documentos = cliente.documentos.sort((a, b) => {
        const dateA = a.FechaDocumento ? new Date(a.FechaDocumento) : new Date(a.createdAt);
        const dateB = b.FechaDocumento ? new Date(b.FechaDocumento) : new Date(b.createdAt);
        return dateB - dateA;
    });

    return documentos;
  }