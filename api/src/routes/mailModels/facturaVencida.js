function facturaVencidaTemplate({ clienteNombre, gestoraNombre, facturas, sucursalNombre = 'BASANI S.A.', cuentas = [], telefono = '' }) {
  const hoy = new Date().toLocaleDateString("es-AR");

  function formatearFecha(fecha) {
    if (!fecha || fecha === 0) return "-";
    const f = new Date(fecha);
    if (isNaN(f)) return "-";
    return f.toLocaleDateString("es-AR").replaceAll("/", "-");
  }

  const cuentasHtml = cuentas.map(c => `<li>${c}</li>`).join('');

  return `
    <html>
      <body style="font-family: Arial, sans-serif;">
        <h2>Área de Cobranzas - ${hoy}</h2>
        <p>Estimado cliente ${clienteNombre}, </p>
        <p>Por medio de la presente, queremos recordarle que las siguientes facturas han vencido y permanecen impagas a la fecha.</p>

        <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%;">
          <thead>
            <tr style="background-color:#f2f2f2;">
              <th>Número</th>
              <th>Fecha de emisión</th>
              <th>Fecha de vencimiento</th>
              <th>Monto pendiente</th>
            </tr>
          </thead>
          <tbody>
            ${facturas.map(factura => `
              <tr>
                <td>${factura.numerodocumento || factura.numero || "-"}</td>
                <td>${formatearFecha(factura.fechadocumento || factura.fechaEmision)}</td>
                <td>${formatearFecha(factura.fechavencimiento)}</td>
                <td>$${Number(factura.montopendiente || factura.montoPendiente || 0).toLocaleString("es-AR")}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>

        <p>Con el objetivo de evitar cargos adicionales o interrupciones en nuestros servicios, le solicitamos regularizar el pago dentro de las próximas 48 horas.</p>
        <p>Si ya ha realizado el pago, le pedimos que adjunte en este correo el comprobante de pago para actualizar nuestra base de datos. En caso contrario, puede realizarlo a través de:</p>
        <ul>
          ${cuentasHtml}
          <li>Otros métodos de pago (consulte con nuestro equipo de cobranzas).</li>
        </ul>
        <p>Estamos a su disposición para cualquier consulta vía telefónica o WhatsApp al ${telefono}.</p>
        <p>Agradecemos su pronta atención y quedamos atentos a su comunicación.</p>
        <p>Atentamente,</p>
        <p><strong>${gestoraNombre}</strong><br/>
        Área de Cobranzas<br/>
        ${sucursalNombre}</p>
      </body>
    </html>
  `;
}

module.exports = facturaVencidaTemplate;
