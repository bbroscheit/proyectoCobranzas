const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

const exportarDocumentosMes = (documentos, mesKeyBuscado) => {
  console.log(`Exportando documentos para el mes: ${mesKeyBuscado}...`);
  
  const hoy = new Date();
  hoy.setHours(0,0,0,0);

  const limite = new Date(hoy.getFullYear(), hoy.getMonth() - 11, 1);
  const claveAnteriores = "Anteriores";

  const data = [];

  for (const doc of documentos) {

    if (![1,3,7,8].includes(doc.tipodocumento)) continue;

    const fecha = new Date(doc.fechadocumento);
    fecha.setHours(0,0,0,0);

    const fechaVenc = new Date(doc.fechavencimiento);
    fechaVenc.setHours(0,0,0,0);

    let mesKey = fecha < limite
      ? claveAnteriores
      : `${fecha.getMonth() + 1}/${fecha.getFullYear()}`;

    if (mesKey !== mesKeyBuscado) continue;

    let estado = "";

    if (doc.montopendiente === 0) {
      estado = "COBRADA";
    } 
    else if (fechaVenc < hoy) {
      estado = "VENCIDA";
    } 
    else {
      estado = "PENDIENTE";
    }

    data.push({
      Numero: doc.numerodocumento,
      Tipo: doc.tipodocumento,
      FechaDocumento: doc.fechadocumento,
      FechaVencimiento: doc.fechavencimiento,
      estado: estado,
      MontoOriginal: doc.montooriginal,
      MontoPendiente: doc.montopendiente
    });
  }

  console.log(`Documentos encontrados para ${mesKeyBuscado}: ${data.length}`);

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

module.exports = exportarDocumentosMes;