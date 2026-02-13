function retiroTemplate({ clienteNombre, gestoraNombre, facturas }) {
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
        <p>Nos dirigmos a usted con carácter de última notificación para informarle que, a la fecha, su cuenta presenta un saldo pendiente por un total de $${Number(facturas.reduce((total, f) => total + f.montopendiente, 0)).toLocaleString("es-AR")}, correspondiente a los servicios brindados por nuestra empresa.</p>
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
        <p>Ante la falta de regularización de la deuda, hemos iniciado el trámite para proceder al retiro de las unidades alquiladas y el cese definitivo de los servicios.Además, informamos que su cuenta será derivada al área legal para el inicio del proceso de cobro judicial, incluyendo la aplicación de intereses moratorios conforme a los términos establecidos en nuestro contrato</p>
        <p style="margin-top:20px;">
          Para evitar este procedimiento, le solicitamos que realice el pago completo de su deuda dentro de las proximas [Plazo establecido]. Los pagos pueden efectuarse a través de:
        </p>
        <ul>
              <ol>Transferencia bancaria a la cuenta [número de cuenta].</ol>
              <ol>Otros métodos de pago(consultar con nuestro equipo de cobranzas).</ol>
        </ul>
        <p>Si ya ha realizado el pago, le pedimos que adjunte en este correo el comprobante del mismo o lo envíe mediante Whatsapp al [número de cobranzas] de inmediato para detener el avance del proceso.</p>
        <p>Lamentamos llegar a esta instancia, pero es nuestro deber proteger los intereses de la empresa. Qeuedamos atentos a su pronta respuesta y dispuestos a atender cualquier consulta al respecto.</p>
                
        <p>Atentamente,</p>
        <p><strong>${gestoraNombre}</strong><br/>
        Área de Cobranzas<br/>
        BASANI S.A.</p>
        </body>
    </html>
  `;
}

module.exports = retiroTemplate;