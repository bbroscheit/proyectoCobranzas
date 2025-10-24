import React, { useContext } from 'react'
import styles from '../modules/cardagendaavencer.module.css'
import { FacturacionContext } from '../context/FacturacionContext';
import { formatNumber } from '../functions/formatNumber';

function CardAgendaAVencer({cliente, deuda}) {
    //console.log("deuda a vencer : ", deuda)
    const idCliente = cliente;
    const totalSinVencer = deuda || 0;

    const handleClick = () => {
      if (idCliente) {
        window.open(`/ResumenAVencer?id=${idCliente}`, '_blank');
      } else {
        console.error('Cliente ID no válido:', idCliente);
      }
    };
    
  return (
    <div className={totalSinVencer === 0 ? styles.container : styles.containerBackground} onClick={handleClick}>
        <h1 className={totalSinVencer === 0 ? styles.number : styles.numberBackground}>$ {formatNumber(deuda)}</h1>
        <p className={totalSinVencer === 0 ? styles.paragraph : styles.paragraphBackground}>Por Pagar</p>
    </div>
  )
}

export default CardAgendaAVencer