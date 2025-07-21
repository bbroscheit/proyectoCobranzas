import React, {useState} from 'react'
import Link from 'next/link';
import styles from './modules/recordatoriosManuales.module.css'
import CardRecordatorio from './components/CardRecordatorio'
import { MdOutlineAdd } from "react-icons/md";


let recordatorioEmitida = {
    title : "Factura Emitida",
    momento : "Creacion Factura",
    periodicidad:"inmediato",
    horario:"",
    recurrente: false
}


const RecordatoriosManuales = () => {
    const [input, setInput] = useState("")

  return (
    <>
    <div className={styles.sectorContainer}>
        
        <div className={styles.sectorContainerTitle}>
        <Link href="/Recordatorios">
          <p className={styles.sectionLink}>Recordatorios</p>
        </Link></div>
        
        <h4 className={styles.sectionTitle}>Recordatorios Manuales</h4>
        <button className={styles.buttonRecordatorio}> <MdOutlineAdd />Nuevo Recordatorio Manual</button>
    </div>
    <div className={styles.container}>
      <div>
        <h1 className={styles.title}>Recordatorios</h1>
        <p className={styles.subtitle}>Los siguientes recordatorios se envian de forma automatica a tus clientes en los dias indicados</p>
      </div>
    </div>
    <div className={styles.cardContainer}>
        <CardRecordatorio 
            title={recordatorioEmitida.title} 
            momento={recordatorioEmitida.momento} 
            periodicidad={recordatorioEmitida.periodicidad} 
            horario={recordatorioEmitida.horario} 
            recurrente={recordatorioEmitida.recurrente} 
        />
         
    </div>

    </>
  )
}

export default RecordatoriosManuales