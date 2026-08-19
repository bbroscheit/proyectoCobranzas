function retencionesTemplate({ clienteNombre, fechaPago }) {
  const hoy = new Date().toLocaleDateString("es-AR");

  function formatearFechaPago(fechaStr) {
    if (!fechaStr) return "-";
    const [y, m, d] = fechaStr.split("-");
    return `${d}/${m}/${y}`;
  }

  return `
    <html>
      <body style="font-family: Arial, sans-serif; color: #222;">
        <h2>Área de Cobranzas - ${hoy}</h2>
        <p>Estimado cliente ${clienteNombre},</p>
        <p>Solicitamos la información de orden de pago y retenciones para poder contabilizar el pago generado el día: <strong>${formatearFechaPago(fechaPago)}</strong></p>
        <p>Si ya ha enviado dicha información a este canal desestimar el presente mail.</p>
        <p>Agradecemos su atención y quedamos a su disposición para cualquier consulta.</p>
        <p>Atentamente,<br/>
        Área de Cobranzas<br/>
        Ecobahia</p>
      </body>
    </html>
  `;
}

module.exports = retencionesTemplate;
