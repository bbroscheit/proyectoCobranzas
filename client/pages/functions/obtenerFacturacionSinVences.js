export function obtenerFacturacionSinVencer(facturacion, numeroCliente) {
    if (!Array.isArray(facturacion)) {
        console.error("La facturación debe ser un array.");
        return 0;
    }

    const hoy = new Date(); // Fecha actual
  
    return facturacion.filter((factura) => {
        if (!factura.FechaVencimiento || !factura.MontoPendiente || !factura.NumeroCliente) {
            console.warn("Factura mal formada:", factura);
            return false;
        }

        const fechaVencimiento = new Date(factura.FechaVencimiento);
        if (isNaN(fechaVencimiento)) {
          console.warn("Fecha de vencimiento no válida:", factura.FechaVencimiento);
          return false;
        }

        
        return (
            factura.NumeroCliente.trim() === numeroCliente &&
            factura.MontoPendiente > 0 && // Monto pendiente mayor a 0
            fechaVencimiento > hoy // Fecha de vencimiento posterior a hoy
        );
    })
    .reduce((total, factura) => total + factura.MontoPendiente, 0);
  }