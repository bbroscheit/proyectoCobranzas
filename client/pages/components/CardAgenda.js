import React from 'react'
import { useRouter } from "next/router";
import styles from '../modules/cardagenda.module.css'
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import { IoMdAdd } from "react-icons/io";
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';
import CardAgendaAVencer from './CardAgendaAVencer';
import CardAgendaVencido from './CardAgendaVencido';
import CardAgendaAFavor from './CardAgendaAFavor';

function CardAgenda({ numCliente, clientes, cuit, contacto, deudaAVencer, deudaVencida, deudaTotal }) {
    //console.log("card agenda: ", deudaAVencer)
    const router = useRouter();

  return (
    <div className={styles.container}>
        <div>
            <div className={styles.containerClient} onClick={(e) => router.push(`/detalle/[id]`, `/detalle/${numCliente}`)}>
                <AccountBoxIcon />
                <h1 className={styles.cardTitle }>{clientes}</h1>
            </div>
            <div className={styles.containerContact}>
                <div className={styles.containerCuit}><PermContactCalendarIcon /><h3>{cuit}</h3></div>
                <h3 className={styles.cardContact}>{contacto}</h3>
            </div>
        </div>
        {
            deudaTotal && deudaTotal > 0 ? 
                <>
                    <CardAgendaAVencer cliente={numCliente} deuda={deudaAVencer}/>
                    <IoMdAdd className={styles.addicon}/>
                    <CardAgendaVencido cliente={numCliente} deuda={deudaVencida}/>
                </> :
                <>
                    <CardAgendaAFavor cliente={numCliente} deuda={deudaTotal}/>
                </>
        }
        
    </div>
  )
}

export default CardAgenda