import React from 'react'
import styles from '../modules/cardindex.module.css'
import { formatNumber } from '../functions/formatNumber'

const CardIndex = ({ total , cant , title }) => {
   
  return (
    <div className={`${styles.card} ${title === "pagado" ? styles.green : title === "por vencer" ? styles.yellow : styles.red}`}>
        <h4 className={styles.cardTitle}>{title.toUpperCase()}</h4>
        <h2 className={styles.cardTotal}>$ { formatNumber(total) }</h2>
        {
            title === "pagado" ? <h5 className={styles.cardCant}>{ cant } pago(s) recibidos en el mes actual</h5> : 
                title === "por vencer" ? <h5 className={styles.cardCant}>{cant} facturas(s) pendientes(s) por vencer</h5> :
                    <h5 className={styles.cardCant}>{cant} facturas(s) vencida(s) </h5>
        }
    </div>
  )
}

export default CardIndex