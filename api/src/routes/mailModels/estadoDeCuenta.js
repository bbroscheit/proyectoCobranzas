function estadoDeCuentaTemplate({ clienteNombre, gestoraNombre, facturas }) {
  const hoy = new Date().toLocaleDateString("es-AR");

  return `
    <html>
      <body style="font-family: Arial, sans-serif;">
        <h2>Área de Cobranzas - ${hoy}</h2>
        <p>Estimado cliente ${clienteNombre}, </p>
        <p>En <strong>BASANI S.A.</strong> trabajamos constantemente para ofrecerle el mejor servicio, y como parte de nuestro compromiso, nos gustaría informarle sobre el estado actual de sus cuenta.</p>
        <p>Facturas vencidas y próximas a vencer</p>
        <p>A continuación, detallamos las facturas pendientes de pago para su revisión:</p>
        < br/>
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
                <td>${factura.numero}</td>
                <td>${factura.fecha || "-"}</td>
                <td>${factura.fechaVencimiento || "-"}</td>
                <td>$${Number(factura.montopendiente).toLocaleString("es-AR")}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>

        <p style="margin-top:20px;">
          Opciones de Pago
        </p>
        <ul>
              <ol>Transferencia bancaria a la cuenta [número de cuenta].</ol>
              <ol>Otros métodos de pago(consultar con nuestro equipo de cobranzas).</ol>
        </ul>
        <p>Le solicitamos gentilmente realizar el pago de sus facturas vencidas para evitar posibles recargos adicionales o interrupciones en sus servicios.</p>
        <p>Si ya ha realizado el pago o tiene algún inconveniente, no dude en contactarnos para informarlo y asistirlo. Puede comunicarse con nuestro equipo de cobranzas al [numero de telefono general] o responder este correo.</p>
        <p>Agradecemos su atención y quedamos a su disposición para cualquier consulta.</p>
        <p>Atentamente,</p>
        <p><strong>${gestoraNombre}</strong><br/>
        Área de Cobranzas<br/>
        BASANI S.A.</p>
        </body>
    </html>
  `;
}

module.exports = estadoDeCuentaTemplate;
