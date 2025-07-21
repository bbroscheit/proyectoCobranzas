import React, {useState} from 'react'
import styles from '../modules/cardrecordatorio.module.css'
import { TbReload } from "react-icons/tb";
import { BiSolidCircle } from "react-icons/bi";


const CardRecordatorio = ( {title , momento , periodicidad , horario , recurrente, activado }) => {
    const [ recordatorios, setRecordatorio] = useState({
        title,
        momento,
        periodicidad,
        horario,
        recurrente,
        activado
    })

    function handleClickChangeState(e){
        recordatorios.activado === true ? setRecordatorio({...recordatorios, activado : false }) : setRecordatorio({...recordatorios , activado : true})
    }

  return (
    <div className={styles.generalContainer}>
    {
        recordatorios.activado === true ? <BiSolidCircle className={styles.iconRed} onClick={e => handleClickChangeState(e)}/> : <BiSolidCircle className={styles.iconGreen} onClick={e => handleClickChangeState(e)}/>
    }    
    
    <div className={`${styles.card} ${ recordatorios.title === "Factura Emitida" ? styles.borderEmitida 
                : recordatorios.title === "Factura por Vencer" ? styles.borderPorVencer 
                    : recordatorios.title === "Factura Vencida" ? styles.borderVencida 
                        : recordatorios.title === "Estado de Cuenta" ? styles.borderEstadoDeCuenta : styles.borderPagoRecibido }`}>
        <div>
            <h3 className={styles.cardTitle}>{recordatorios.title}</h3>
        </div>
        <div className={styles.cardDatosContainer}>
            <h4 className={styles.cardRecordatorioMotivo}>{recordatorios.momento}</h4>
            {
                recordatorios.periodicidad !== "" ? <h4 className={styles.cardRecordatorioOtros}>{recordatorios.periodicidad}</h4> : null
            }
            {
                recordatorios.horario !== "" ? <h4 className={styles.cardRecordatorioOtros}>{recordatorios.horario}</h4> : null
            }
            {
                recordatorios.recurrente !== false ? <h4><TbReload /></h4> : null
            }
        </div>
    </div>
    </div>
  )
}

export default CardRecordatorio