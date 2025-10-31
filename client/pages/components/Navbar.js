import React, { useState, useEffect, useContext }from 'react'
import Link from 'next/link'
import Image from 'next/image'
import styles from '../modules/navbar.module.css'
import useUser from "../hooks/useUser";

const Navbar = () => {
  const [user, setUser] = useUser("");

  const imagenes = {
    1: 'https://res.cloudinary.com/dyvayayab/image/upload/v1761765043/logo-basani-transparente_bbykgr.png',
    2: 'https://res.cloudinary.com/dyvayayab/image/upload/v1761765044/logo_uy-original_nnygnw.png',
    3: 'https://res.cloudinary.com/dyvayayab/image/upload/v1761765043/BAXPA_-_BAEBSA_Mesa_de_trabajo_1_copia_m948kr.png',
    4: 'https://res.cloudinary.com/dyvayayab/image/upload/v1761765044/BAXPA_-_BAEBSA_Mesa_de_trabajo_1_giaz76.png',
    5: 'https://res.cloudinary.com/dyvayayab/image/upload/v1761765333/LOGO_SIN_FONDO_2_fzxktj.png'
  }

  return (
    <div className={styles.container}> 
        {/* <div className={styles.logo}>Logo</div> */}
        <div className={styles.logo}>
          {
            user && user.sucursal && imagenes[user.sucursal] ?  
            <Image 
              src={imagenes[user.sucursal]} 
              alt="Logo Empresa"
              width={150}
              height={50}
            />
            :
            <Image
              src={imagenes[1]}
              alt="Logo Default"
              width={150}
              height={50}
            />
          }
        </div>
        <div>
            <ul className={styles.ul}>
              <li><Link href={"/Principal"} >Inicio</Link></li>
              <li><Link href={"/Clientes"}>Gestión</Link></li>
              <li><Link href={"/AgendaDeLlamadas"}>Agenda</Link></li>
              <li><Link href={"/Recordatorios"} >Recordatorios</Link></li>
            </ul>
        </div>
    </div>
  )
}

export default Navbar