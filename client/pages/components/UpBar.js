import React from 'react'
import styles from '../modules/upbar.module.css'
import { IoNotifications } from "react-icons/io5";

export const UpBar = () => {
  return (
    <div className={styles.container}>
        <input type='search' placeholder='Buscar...' className={styles.input}/>
        <div className={styles.notification}>
            <IoNotifications />
            <h5>usuario</h5>
        </div>    
    </div>
  )
}
