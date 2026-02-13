
// modelo html de mail para una factura emitida
function facturaVencidaTemplate({ clienteNombre, gestoraNombre, factura }) {
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
        <p>Por medio de la presente, queremos recordarle que la factura ${factura.numero}, emitida el ${formatearFecha(factura.fechaEmision)}, venció el ${formatearFecha(factura.fechaVencimiento)} y permanece impaga hasta la fecha.</p>
        <p>Detalles de la factura vencida:</p>
        <p>Número de factura: ${factura.numero}</p>
        <p>Monto pendiente: $${factura.montoPendiente}</p>
        <p>Fecha de Vencimiento: ${formatearFecha(factura.fechaVencimiento)}</p>
          
        <p>Con el objetivo de evitar cargos adicionales o interrupciones en nuestros servicios, le solicitamos regularizar el pago dentro de las próximas 48 horas.</p>
        <p>Si ya ha realizado el pago, le pedimos que adjunte en este correo el comprobante de pago para actualizar nuestra base de datos. En caso contrario, puede realizarlo utilizando los siguientes métodos:</p>
        <ul>
          <ol>Transferencia bancaria: </ol>
          <ol>Otros métodos de pago (consulte con nuestro equipo de cobranzas).</ol>
        </ul>
        <p>Estamos a su disposición para cualquier consulta vía telefónica o Whatsapp [número del gestor de cobranzas].</p>
        <p>Agradecemos su pronta atención y quedamos atentos a su comunicación.</p>
        <p>Atentamente,</p>
        <p><strong>${gestoraNombre}</strong><br/>
        Área de Cobranzas<br/>
        BASANI S.A.</p>
      </body>
    </html>
  `;
}

module.exports = facturaVencidaTemplate;