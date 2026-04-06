
const filtrarDocumentosValidos = (documentos) => {
  return documentos.filter(doc => {
    const numero = doc.numero || "";

    if (numero.startsWith("NDI") || numero.startsWith("NCI")) return false;
    if (!numero.includes("P")) return false;

    return true;
  });
};

module.exports = filtrarDocumentosValidos;
