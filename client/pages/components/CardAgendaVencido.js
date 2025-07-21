import React, {useContext} from 'react'
import styles from '../modules/cardagendavencido.module.css'
import { FacturacionContext } from '../context/FacturacionContext';
import { formatNumber } from '../functions/formatNumber';

function CardAgendaVencido({cliente, deuda}) {
    const idCliente = cliente;
    const totalVencido = deuda || 0;
    
    const handleClick = () => {
      if (idCliente) {
        window.open(`/ResumenVencido?id=${idCliente}`, '_blank');
      } else {
        console.error('Cliente ID no válido:', idCliente);
      }
    };

  return (
    <div className={totalVencido === 0 ? styles.container : styles.containerBackground} onClick={handleClick}>
        <h1 className={totalVencido === 0 ? styles.number : styles.numberBackground}>$ {formatNumber(totalVencido)}</h1>
        <p className={totalVencido === 0 ? styles.paragraph : styles.paragraphBackground}>Vencido</p>
    </div>
  )
}

export default CardAgendaVencido