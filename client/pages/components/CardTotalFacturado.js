import React, { useContext } from 'react'
import styles from '../modules/cardTotalFacturado.module.css'
import { formatNumber } from '../functions/formatNumber'
import { FacturacionContext } from '../context/FacturacionContext'


function CardTotalFacturado({clienteId}) {
  const { facturas } = useContext(FacturacionContext)

  const id = parseInt(clienteId)
  const mesCorriente = new Date().getMonth() + 1 // Obtener el mes corriente (1-12)
  const totalFacturado = facturas?.filter(factura => parseInt(factura.NumeroCliente.trim()) === id && new Date(factura.FechaDocumento).getMonth() + 1 === mesCorriente)
    .reduce((total, factura) => total + factura.MontoOriginal, 0)


  return (
    <div className={`${styles.divContainer} ${styles.background}`}>
        {
          totalFacturado > 0 || totalFacturado !== undefined
          ? <h2>$ {formatNumber(totalFacturado)}</h2>
          : <h2>$ 0</h2>
        }
        
        <p>Total Facturado del Mes</p>
    </div>
  )
}

export default CardTotalFacturado