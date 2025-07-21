import React from 'react'
import Link from 'next/link'
import styles from '../modules/navbar.module.css'

const Navbar = () => {
  return (
    <div className={styles.container}>
        <div className={styles.logo}>Logo</div>
        <div>
            <ul className={styles.ul}>
              <li><Link href={"/Principal"} >Inicio</Link></li>
              <li><Link href={"/Clientes"}>Gestión</Link></li>
              <li><Link href={"/AgendaDeLlamadas"}>Agenda</Link></li>
              {/* <li><Link href={"/Recordatorios"} >Recordatorios</Link></li> */}
            </ul>
        </div>
    </div>
  )
}

export default Navbar