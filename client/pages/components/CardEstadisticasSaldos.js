import React, { useContext } from 'react'
import { FacturacionContext } from "../../pages/context/FacturacionContext";
import styles from '../modules/cardEstadisticasSaldos.module.css'
import { formatNumber } from '../functions/formatNumber'

function CardEstadisticasSaldos({clienteId}) {
    const { totalesPorCliente } = useContext(FacturacionContext);
    const { totalesVencidosPorCliente } = useContext(FacturacionContext);
    const { totalesRecibosMesPorCliente } = useContext(FacturacionContext);
    const totalSinVencer = totalesPorCliente[clienteId] || 0;
    const totalVencido = totalesVencidosPorCliente[clienteId] || 0;
    const totalRecibos = totalesRecibosMesPorCliente[clienteId] || 0;

  return (
    <div className={styles.container}>
      <div className={`${styles.divContainer} ${styles.backgroundPagado}`}>
        <h2>$ {formatNumber(totalRecibos)}</h2>
        <p>Pagado</p>
      </div>
      <div className={`${styles.divContainer} ${styles.backgroundSinVencer}`}>
        <h2>$ {formatNumber(totalSinVencer)}</h2>
        <p>Por Pagar</p>
      </div>
      <div className={`${styles.divContainer} ${styles.backgroundVencido}`}>
        <h2>$ {formatNumber(totalVencido)}</h2>
        <p>Vencido</p>
      </div>
    </div>
  )
}

export default CardEstadisticasSaldos