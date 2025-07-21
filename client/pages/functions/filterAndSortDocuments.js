export function filterAndSortDocuments(documentos, clienteId) {
    // Convertimos el id de cliente a entero
    const clienteIdInt = parseInt(clienteId, 10);
    // Filtramos los documentos que pertenecen al cliente en cuestión y convertimos el numeroCliente a entero
    let filteredDocumentos = documentos.filter(documento => parseInt(documento.NumeroCliente.trim(),10) === clienteIdInt);
    
    // Ordenamos los documentos del más nuevo al más viejo
    filteredDocumentos.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  
    return filteredDocumentos;
  }