function suspensionTemplate({ clienteNombre, gestoraNombre, facturas }) {
  const hoy = new Date().toLocaleDateString("es-AR");

  function formatearFecha(fecha) {
    if (!fecha || fecha === 0) return "-";
    const f = new Date(fecha);
    if (isNaN(f)) return "-";
    return f.toLocaleDateString("es-AR").replaceAll("/", "-");
  }

  return `
    <html>
      <body style="font-family: Arial, sans-serif;">
        <h2>Área de Cobranzas - ${hoy}</h2>
        <p>Estimado cliente ${clienteNombre}, </p>
        <p>Le informamos que, debido a la falta de regularización de los pagos pendientes detallados a continuación, los servicios de limpieza asociados a su cunta han sido suspendidos.</p>
        <p>Detalle de facturas pendientes: </p>
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
                <td>${formatearFecha(factura.fecha) || "-"}</td>
                <td>${formatearFecha(factura.fechavencimiento) || "-"}</td>
                <td>$${Number(factura.montopendiente).toLocaleString("es-AR")}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
        <p>Lamentablemente, de no regularizar el saldo pendiente en un plazo de [Plazo establecido] contados a partir de la fecha de este aviso, nos veremos obligados a proceder con el retiro de los equipos en uso.</p>
        <p style="margin-top:20px;">
          Para evitar esta medida, le solicitamos realizar el pago correspondiente a través de:
        </p>
        <ul>
              <ol>Transferencia bancaria a la cuenta [número de cuenta].</ol>
              <ol>Otros métodos de pago(consultar con nuestro equipo de cobranzas).</ol>
        </ul>
        <p>Si ya ha realizado el pago, le pedimos que adjunte en este correo el comprobante de pago para actualizar nuestra base de datos; o lo envíe mediante Whatsapp al [número de cobranzas].</p>
        <p>Estamos disponibles para discutir opciones de regularización o atender cualquier consulta al respecto.Le agradecemos su pronta atención y comprensión para resolver esta situación</p>
        <p>Estamos a su disposición para atender cualquier consulta vía telefónica, WhatsApp [número telefónico] o respondiendo este correo electrónico.</p>
        
        <p>Atentamente,</p>
        <p><strong>${gestoraNombre}</strong><br/>
        Área de Cobranzas<br/>
        BASANI S.A.</p>
        </body>
    </html>
  `;
}

module.exports = suspensionTemplate;