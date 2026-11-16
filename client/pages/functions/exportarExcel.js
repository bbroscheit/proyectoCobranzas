// Exporta una tabla a .xlsx y la descarga en el navegador.
// columnas: [{ header, key, width, tipo: "fecha" | "moneda" | "numero" | "texto" }]
export async function exportarExcel({ nombreArchivo, titulo, columnas, filas }) {
  // Carga diferida: exceljs es pesado y solo se usa al exportar
  const ExcelJS = (await import("exceljs")).default;

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Resumen");

  sheet.columns = columnas.map(({ key, width }) => ({ key, width: width || 18 }));

  if (titulo) {
    sheet.addRow([titulo]).font = { bold: true, size: 14 };
    sheet.mergeCells(1, 1, 1, columnas.length);
    sheet.addRow([]);
  }

  const headerRow = sheet.addRow(columnas.map((c) => c.header));
  headerRow.eachCell((cell) => {
    cell.font = { bold: true };
    cell.alignment = { horizontal: "center" };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFB2D4F3" } };
    cell.border = { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } };
  });

  filas.forEach((fila) => {
    const row = sheet.addRow(
      columnas.map((c) => {
        const valor = fila[c.key] ?? null;
        // exceljs escribe las fechas en UTC: se pasa el mismo día a medianoche UTC
        return c.tipo === "fecha" && valor instanceof Date
          ? new Date(Date.UTC(valor.getFullYear(), valor.getMonth(), valor.getDate()))
          : valor;
      })
    );
    columnas.forEach((c, i) => {
      const cell = row.getCell(i + 1);
      if (c.tipo === "fecha") cell.numFmt = "dd/mm/yyyy";
      if (c.tipo === "moneda") cell.numFmt = '"$" #,##0.00;-"$" #,##0.00';
      if (c.tipo === "numero") cell.numFmt = "0";
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${nombreArchivo}.xlsx`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
