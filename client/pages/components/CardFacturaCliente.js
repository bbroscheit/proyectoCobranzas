import React from 'react'
import style from '../modules/cardFacturaCliente.module.css'
import GradeRoundedIcon from '@mui/icons-material/GradeRounded';
import { formatNumber } from '../functions/formatNumber'
import { formatDate } from '../functions/formatDate'

function CardFacturaCliente({ factura , nombreCliente }) {
    const fechaVencimiento = new Date(factura.FechaVencimiento)
    const hoy = new Date()
    const diferenciaDias = Math.ceil((fechaVencimiento - hoy) / (1000 * 60 * 60 * 24))

    let estadoFactura
    if (factura.MontoPendiente === 0) {
      estadoFactura = "Pagada"
    } else if (diferenciaDias > 0) {
      estadoFactura = `Vence en ${diferenciaDias} días`
    } else {
      estadoFactura = `Venció hace ${Math.abs(diferenciaDias)} días`
    }

    const montoPendienteTexto = factura.MontoPendiente === 0 ? "Pagada" : `Por Pagar: $ ${formatNumber(factura.MontoPendiente)}`

      // Determinar la clase CSS según el estado de la factura
    let estadoClase
    if (estadoFactura === "Pagada") {
      estadoClase = style.pagada
    } else if (estadoFactura.startsWith("Vence")) {
      estadoClase = style.vence
    } else if (estadoFactura.startsWith("Venció")) {
      estadoClase = style.vencio
    } 


  return (
    <div className={`${style.container} ${estadoClase}`}>
        <GradeRoundedIcon className={style.icon}/>
        <div>
            <p className={style.nombreCliente}>{nombreCliente}</p>
            <p className={style.numeroCliente}>{factura.NumeroDocumento.trim()}</p>
        </div>
        <div>
            <p className={style.fechaDocumento}>{formatDate(factura.FechaDocumento)}</p>
            <p className={style.estadoDocumento}>{estadoFactura}</p>
        </div>
        <div>
            <p className={style.montoDocumento}>$ {formatNumber(factura.MontoOriginal)}</p>
            <p className={style.montoPendiente}>{montoPendienteTexto}</p>
        </div>
    </div>
  )
}

export default CardFacturaCliente