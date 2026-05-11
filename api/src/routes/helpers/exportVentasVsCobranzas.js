const ExcelJS = require("exceljs");
const getAllDocumentsBySalepoint = require("../controllers/getAllDocumentsBySalepoint");

const exportVentasVsCobranzas = async (req, res) => {
  try {
    const { gestor } = req.params;

    const data = await getAllDocumentsBySalepoint(gestor);
    const ventas = data.ventasVsCobranzas;

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("VentasVsCobranzas");

    sheet.columns = [
      { header: "Mes", key: "mes", width: 15 },
      { header: "Vencidas", key: "vencidas", width: 20 },
      { header: "Pendientes", key: "pendientes", width: 20 },
      { header: "Cobradas", key: "cobradas", width: 20 },
    ];

    for (let i = 0; i < ventas.meses.length; i++) {
      sheet.addRow({
        mes: ventas.meses[i],
        vencidas: ventas.facturasVencidas[i],
        pendientes: ventas.facturasNoVencidas[i],
        cobradas: ventas.facturasCobradas[i],
      });
    }

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=ventas-vs-cobranzas.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();

  } catch (error) {
    console.error("Error exportando Excel:", error);
    res.status(500).json({ error: "Error generando Excel" });
  }
};

module.exports = exportVentasVsCobranzas;