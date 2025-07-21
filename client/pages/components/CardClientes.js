import React from 'react'
import styles from '../modules/cardclientes.module.css'
import { formatNumber } from '../functions/formatNumber'

function CardClientes({ total , title }) {
    return (
        <div className={`${styles.card} ${title === "Pagado" ? styles.green : title === "Por Vencer" ? styles.yellow : title === "Vencido" ? styles.red : styles.blue}`}>
            <h2 className={styles.cardTotal}>$ { formatNumber(total) }</h2>
            <h4 className={styles.cardTitle}>{title}</h4>
        </div>
      )
}

export default CardClientes