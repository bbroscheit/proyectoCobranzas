export function filterAndSortDocuments(documentos) {
  if (!Array.isArray(documentos)) return [];

  // Filtrar solo los documentos con monto pendiente > 0
  const filteredDocumentos = documentos.filter(
    (doc) => parseFloat(doc.montopendiente) > 0
  );

  return filteredDocumentos;
}