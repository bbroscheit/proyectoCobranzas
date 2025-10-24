import React, { useContext } from 'react'
import { FacturacionContext } from "../../pages/context/FacturacionContext";
import styles from '../modules/cardEstadisticasSaldos.module.css'
import { formatNumber } from '../functions/formatNumber'

function CardEstadisticasSaldos({totalVencidas , totalNoVencido , recibosMes}) {
    
  return (
    <div className={styles.container}>
      <div className={`${styles.divContainer} ${styles.backgroundPagado}`}>
        <h2>$ {formatNumber(recibosMes)}</h2>
        <p>Pagado</p>
      </div>
      <div className={`${styles.divContainer} ${styles.backgroundSinVencer}`}>
        <h2>$ {formatNumber(totalNoVencido)}</h2>
        <p>Por Pagar</p>
      </div>
      <div className={`${styles.divContainer} ${styles.backgroundVencido}`}>
        <h2>$ {formatNumber(totalVencidas)}</h2>
        <p>Vencido</p>
      </div>
    </div>
  )
}

export default CardEstadisticasSaldos