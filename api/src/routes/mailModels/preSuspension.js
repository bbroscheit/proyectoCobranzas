function preSuspensionTemplate({ clienteNombre, gestoraNombre, facturas }) {
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
        <p>Nos dirigimos a usted para informarle que, a la fecha, su cuenta presenta un saldo pendiente correspondiente al alquilerde equipo / desagote de baños químicos brindados por nuestra empresa. Según nuestros registros, las facturas detalladas a continuación se encuentran impagas:</p>
        
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
        <p>Dado que el plazo estipulado para el pago ha vencido y no hemos recibido respuesta, nos vemos en la necesidad de notificarle que los servicios de desagote quedarán suspendidos o partir del [plazo establecido por configuración], salvo que se regularice el pago correspondiente antes de esa fecha.</p>
        <p style="margin-top:20px;">
          Le recordamos que puede realizar el pago a través de:
        </p>
        <ul>
              <ol>Transferencia bancaria a la cuenta [número de cuenta].</ol>
              <ol>Otros métodos de pago(consultar con nuestro equipo de cobranzas).</ol>
        </ul>
        <p>Si ya ha realizado el pago, le pedimos que adjunte en este correo el comprobante de pago para actualizar nuestra base de datos.</p>
        <p>Entendemos que pueden surgir inconvenientes; por ello, si necesita asistencia adicional o desea discutir alternativas, no dude en contactarnos. Nuestro objetivo es continuar ofreciéndole nuestros servicios de calidad sin interrupciones.</p>
        <p>Estamos a su disposición para atender cualquier consulta vía telefónica, WhatsApp [número telefónico] o respondiendo este correo electrónico.</p>
        <p>Agradecemos su pronta atención a este asunto.</p>
        <p>Atentamente,</p>
        <p><strong>${gestoraNombre}</strong><br/>
        Área de Cobranzas<br/>
        BASANI S.A.</p>
        </body>
    </html>
  `;
}

module.exports = preSuspensionTemplate;