function estadoDeCuentaTemplate({ clienteNombre, gestoraNombre, facturas, sucursalNombre = 'BASANI S.A.', cuentas = [], telefonos = [], mensajePersonalizado = '' }) {
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
        ${mensajePersonalizado
          ? `<p style="white-space:pre-line;">${mensajePersonalizado}</p>`
          : `<p>En <strong>${sucursalNombre}</strong> trabajamos constantemente para ofrecerle el mejor servicio, y como parte de nuestro compromiso, nos gustaría informarle sobre el estado actual de su cuenta.</p>
        <p>Facturas vencidas y próximas a vencer</p>
        <p>A continuación, detallamos las facturas pendientes de pago para su revisión:</p>`
        }
        <br/>
        <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%;">
          <thead>
            <tr style="background-color:#f2f2f2;">
              <th>Número</th>
              <th>Fecha</th>
              <th>Vencimiento</th>
              <th>Monto pendiente</th>
            </tr>
          </thead>
          <tbody>
            ${facturas.map(factura => `
              <tr>
                <td style="text-align: center;">${factura.numero}</td>
                <td style="text-align: center;">${formatearFecha(factura.fecha) || "-"}</td>
                <td style="text-align: center;">${formatearFecha(factura.fechavencimiento) || "-"}</td>
                <td style="text-align: center;">$${Number(factura.montopendiente).toLocaleString("es-AR")}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>

        <p style="margin-top:20px;">Opciones de Pago</p>
        <ul>
          ${cuentasHtml}
          <li>Otros métodos de pago (consultar con nuestro equipo de cobranzas).</li>
        </ul>
        <p>Le solicitamos gentilmente realizar el pago de sus facturas vencidas para evitar posibles recargos adicionales o interrupciones en sus servicios.</p>
        <p>Si ya ha realizado el pago o tiene algún inconveniente, no dude en contactarnos para informarlo y asistirlo. Puede comunicarse con nuestro equipo de cobranzas ${telefonos.length === 1 ? `al número ${telefonos[0]}` : `a los números:<ul>${telefonos.map(t => `<li>${t}</li>`).join('')}</ul>`} o respondiendo este correo.</p>
        <p>Agradecemos su atención y quedamos a su disposición para cualquier consulta.</p>
        <p>Atentamente,</p>
        <p>${gestoraNombre ? `<strong>${gestoraNombre}</strong><br/>` : ''}
        Área de Cobranzas<br/>
        ${sucursalNombre}</p>
        </body>
    </html>
  `;
}

module.exports = estadoDeCuentaTemplate;
