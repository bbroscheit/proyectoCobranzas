const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

const exportarDocumentosExcel = (documentos) => {

  const data = documentos.map(doc => ({
    Numero: doc.numerodocumento,
    Tipo: doc.tipodocumento,
    FechaDocumento: doc.fechadocumento,
    FechaVencimiento: doc.fechavencimiento,
    MontoOriginal: doc.montooriginal,
    MontoPendiente: doc.montopendiente
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Documentos");

  const carpeta = path.join(__dirname, "../../exports");

  if (!fs.existsSync(carpeta)) {
    fs.mkdirSync(carpeta);
  }

  const archivo = path.join(carpeta, "documentos_filtrados.xlsx");

  XLSX.writeFile(workbook, archivo);

  console.log("Excel generado en:", archivo);
};

module.exports = exportarDocumentosExcel;