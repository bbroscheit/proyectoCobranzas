function facturaEmitidaTemplate({ facturas, sucursalNombre = 'BASANI S.A.', cuentas = [], telefono = '' }) {
  const cuentasHtml = cuentas.map(c => `<li>${c}</li>`).join('');

  return `
    <html>
      <body style="font-family: Arial, sans-serif;">
        <h2>¡Nueva factura emitida!</h2>
        <p>Estimado cliente,</p>
        <p>Le informamos que acabamos de emitir la siguiente factura:</p>
        <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 100%;">
          <tr style="background-color:#f2f2f2;">
            <th>Número de factura</th>
            <th>Fecha de emisión</th>
            <th>Fecha de vencimiento</th>
            <th>Monto</th>
          </tr>
          ${facturas.map(factura => `
            <tr>
              <td>${factura.numero}</td>
              <td>${factura.fechaEmision}</td>
              <td>${factura.fechavencimiento}</td>
              <td>$${factura.montoPendiente}</td>
            </tr>
          `).join('')}
        </table>
        <p style="margin-top:16px;">Puede realizar el pago a través de:</p>
        <ul>
          ${cuentasHtml}
          <li>Otros métodos de pago (consultar con nuestro equipo de cobranzas).</li>
        </ul>
        <p>Ante cualquier consulta, comuníquese al ${telefono} o responda este correo.</p>
        <p>Atentamente,</p>
        <p>Área de Cobranzas<br/>${sucursalNombre}</p>
      </body>
    </html>
  `;
}

module.exports = facturaEmitidaTemplate;
