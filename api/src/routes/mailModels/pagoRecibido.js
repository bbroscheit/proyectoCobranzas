// modelo html de mail para una factura emitida
function pagoRecibidoTemplate(facturas) {
  return `
    <html>
      <body>
        <h2>¡Aviso de pago recibido!</h2>
        <p>Estimado cliente,</p>
        <p>Le informamos que tiene las siguientes facturas se encuentran vencidas:</p>
          <tr>
            <th>Número de factura</th>
            <th>Fecha de emisión</th>
            <th>Fecha de vencimiento</th>
            <th>Monto pendiente</th>
          </tr>
          ${facturas.map(factura => `
            <tr>
              <td>${factura.numero}</td>
              <td>${factura.fechaEmision}</td>
              <td>${factura.fechaVencimiento}</td>
              <td>$${factura.montoPendiente}</td>
            </tr>
          `).join('')}
        </table>
        <p>Por favor, regularice su situación a la brevedad.</p>
        <p>Gracias.</p>
      </body>
    </html>
  `;
}

module.exports = pagoRecibidoTemplate;