// Prefijos de documentos de GP que no se importan ni cuentan como deuda.
// Son comprobantes provisorios: en GP se anulan y se reemiten con la "P" (ej: FV A-00009413 → FVPA-00054801)
const PREFIJOS_EXCLUIDOS = [
  "FV A",
  // "ET A",
  // "NC A",
];

const esDocumentoExcluido = (numeroDocumento) => {
  const numero = String(numeroDocumento || "").trim().toUpperCase();
  return PREFIJOS_EXCLUIDOS.some((prefijo) => numero.startsWith(prefijo));
};

module.exports = { PREFIJOS_EXCLUIDOS, esDocumentoExcluido };
