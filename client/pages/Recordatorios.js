import React from 'react'
import Link from 'next/link';
import styles from './modules/recordatorios.module.css'
import CardRecordatorio from './components/CardRecordatorio'
import { MdOutlineAdd } from "react-icons/md";


let recordatorioEmitida = {
    title : "Factura Emitida",
    momento : "Creacion Factura",
    periodicidad:"inmediato",
    horario:"",
    recurrente: false,
    activado: true
}

let recordatorioPorVencer = {
    title : "Factura por Vencer",
    momento : "Vencimiento Factura",
    periodicidad:"3 dia(s) previo",
    horario:"9:00",
    recurrente: false,
    activado:false
}

let recordatorioVencida = {
    title : "Factura Vencida",
    momento : "Vencimiento Factura",
    periodicidad:"1 dia(s) posterior",
    horario:"9:00",
    recurrente: true,
    activado:true,
}

let recordatorioEstadoDeCuenta = {
    title : "Estado de Cuenta",
    momento : "1 vez al mes",
    periodicidad:"",
    horario:"Lunes 9:00",
    recurrente: false,
    activado:true
}

let recordatorioPagoRecibido = {
    title : "Pago Recibido",
    momento : "Nuevo Pago",
    periodicidad:"inmediato",
    horario:"",
    recurrente: false,
    activado:false
}

const Recordatorios = () => {
  return (
    <>
    

    <div className={styles.sectorContainer}>
        
        <div className={styles.sectorContainerTitle}>
        <Link href="/Recordatorios">
          <p className={styles.sectionTitle}>Recordatorios</p>
        </Link>
        </div>
        <Link href="/RecordatoriosManuales">
        <h4 className={styles.sectionLink}>Recordatorios Manuales</h4>
        </Link>
        <button className={styles.buttonRecordatorio}> <MdOutlineAdd />Nuevo Recordatorio</button>
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
            activado = {recordatorioEmitida.activado}
        />
         <CardRecordatorio 
            title={recordatorioPorVencer.title} 
            momento={recordatorioPorVencer.momento} 
            periodicidad={recordatorioPorVencer.periodicidad} 
            horario={recordatorioPorVencer.horario} 
            recurrente={recordatorioPorVencer.recurrente} 
            activado = {recordatorioPorVencer.activado}
        />
         <CardRecordatorio 
            title={recordatorioVencida.title} 
            momento={recordatorioVencida.momento} 
            periodicidad={recordatorioVencida.periodicidad} 
            horario={recordatorioVencida.horario} 
            recurrente={recordatorioVencida.recurrente} 
            activado = {recordatorioVencida.activado}
        />
         <CardRecordatorio 
            title={recordatorioEstadoDeCuenta.title} 
            momento={recordatorioEstadoDeCuenta.momento} 
            periodicidad={recordatorioEstadoDeCuenta.periodicidad} 
            horario={recordatorioEstadoDeCuenta.horario} 
            recurrente={recordatorioEstadoDeCuenta.recurrente}
            activado = {recordatorioEstadoDeCuenta.activado} 
        />
         <CardRecordatorio 
            title={recordatorioPagoRecibido.title} 
            momento={recordatorioPagoRecibido.momento} 
            periodicidad={recordatorioPagoRecibido.periodicidad} 
            horario={recordatorioPagoRecibido.horario} 
            recurrente={recordatorioPagoRecibido.recurrente} 
            activado = {recordatorioPagoRecibido.activado}
        />
    </div>

    </>
  )
}

export default Recordatorios