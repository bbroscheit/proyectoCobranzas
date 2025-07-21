import React from 'react'
import { useRouter } from "next/router";
import styles from '../modules/cardagenda.module.css'
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import { IoMdAdd } from "react-icons/io";
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';
import CardAgendaAVencer from './CardAgendaAVencer';
import CardAgendaVencido from './CardAgendaVencido';

function CardAgenda({ numCliente, clientes, cuit, contacto, deudaAVencer, deudaVencida }) {
    const router = useRouter();

  return (
    <div className={styles.container}>
        <div>
            <div className={styles.containerClient} onClick={(e) => router.push(`/detalle/[id]`, `/detalle/${numCliente}`)}>
                <AccountBoxIcon />
                <h1>{clientes}</h1>
            </div>
            <div className={styles.containerContact}>
                <div className={styles.containerCuit}><PermContactCalendarIcon /><h3>{cuit}</h3></div>
                <h3>{contacto}</h3>
            </div>
        </div>
        <CardAgendaAVencer cliente={numCliente} deuda={deudaAVencer}/>
        <IoMdAdd className={styles.addicon}/>
        <CardAgendaVencido cliente={numCliente} deuda={deudaVencida}/>
    </div>
  )
}

export default CardAgenda