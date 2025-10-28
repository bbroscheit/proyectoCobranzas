import React, { useState } from 'react'
import styles from '../modules/alarmaModal.module.css'

function CcModal() {
//   const [texto, setTexto] = useState('')
//   const [fecha, setFecha] = useState('')
//   const [hora, setHora] = useState('')

//   const handleTextoChange = (e) => {
//     setTexto(e.target.value)
//   }

//   const handleFechaChange = (e) => {
//     setFecha(e.target.value)
//   }

//   const handleHoraChange = (e) => {
//     setHora(e.target.value)
//   }

//   const onSubmit = (e) => {
//     e.preventDefault()
//     handleSubmit({ texto, fecha, hora })
//     setTexto('')
//     setFecha('')
//     setHora('')
//     setCCModal(false)
//   }

//   if (!showCCModal) return null

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h2>Crear Alarma</h2>
        <form onSubmit={onSubmit}>
          {/* <textarea
            value={texto}
            onChange={handleTextoChange}
            placeholder="Ingrese el texto de la alarma"
            rows="4"
            className={styles.textarea}
          />
          <input
            type="date"
            value={fecha}
            onChange={handleFechaChange}
            className={styles.input}
          />
          <input
            type="time"
            value={hora}
            onChange={handleHoraChange}
            className={styles.input}
          /> */}
          <button type="submit" className={styles.button}>
            Guardar
          </button>
          {/* <button type="button" className={styles.button} onClick={() => setCcModal(false)}>
            Cancelar
          </button> */}
        </form>
      </div>
    </div>
  )
}