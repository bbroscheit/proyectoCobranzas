import React from 'react'
import router from 'next/router'
import styles from '../modules/upbar.module.css'
import { FaPowerOff } from "react-icons/fa";
import useUser from '../hooks/useUser';

export const UpBar = () => {
  const [gestor, setGestor] = useUser("")

  const handleClick = (e) => {
    e.preventDefault()
    localStorage.removeItem("userCobranzas");
    setGestor("");
    router.push(`/`);
  }

  return (
    <div className={styles.container}>
        {/* <input type='search' placeholder='Buscar...' className={styles.input}/> */}
        <div className={styles.notification}>
            
            {
              gestor ?
                <span>{ `${gestor.firstname} ${gestor.lastname}`}</span>
                : <span>Invitado</span>
            }

            <FaPowerOff onClick={e => handleClick(e)}/>
        </div>    
    </div>
  )
}
