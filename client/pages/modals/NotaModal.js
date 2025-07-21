import React, { useState } from 'react'
import styles from '../modules/notaModal.module.css'

function NotaModal({ showModal, setShowModal, nota, setNota, comunicacion, setComunicacion, handleSubmit }) {
    const [showAlarmaForm, setShowAlarmaForm] = useState(false)
    const [alarmaTexto, setAlarmaTexto] = useState('')
    const [alarmaFecha, setAlarmaFecha] = useState('')
    const [alarmaHora, setAlarmaHora] = useState('')
  
    const handleNotaChange = (e) => {
    setNota(e.target.value)
  }

  const handleComunicacionChange = (e) => {
    setComunicacion(e.target.value)
  }

  const handleAlarmaTextoChange = (e) => {
    setAlarmaTexto(e.target.value)
  }

  const handleAlarmaFechaChange = (e) => {
    setAlarmaFecha(e.target.value)
  }

  const handleAlarmaHoraChange = (e) => {
    setAlarmaHora(e.target.value)
  }

  const handleCheckboxChange = (e) => {
    setShowAlarmaForm(e.target.checked)
  }

  const onSubmit = (e) => {
    e.preventDefault()
    handleSubmit({ 
        nota, 
        comunicacion, 
        alarma: showAlarmaForm ? { texto: alarmaTexto, fecha: alarmaFecha, hora: alarmaHora } : null })
    setNota('')
    setComunicacion('')
    setAlarmaTexto('')
    setAlarmaFecha('')
    setAlarmaHora('')
    setShowModal(false)
  }

  if (!showModal) return null

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h2>Agregar Nota</h2>
        <form onSubmit={onSubmit}>
          <textarea
            value={nota}
            onChange={handleNotaChange}
            placeholder="Ingrese el detalle de la nota"
            rows="4"
            className={styles.textarea}
          />
          <div className={styles.radioGroup}>
            <label>
              <input
                type="radio"
                name="comunicacion"
                value="Email"
                checked={comunicacion === 'Email'}
                onChange={handleComunicacionChange}
              />
              Email
            </label>
            <label>
              <input
                type="radio"
                name="comunicacion"
                value="Telefónico"
                checked={comunicacion === 'Telefónico'}
                onChange={handleComunicacionChange}
              />
              Telefónico
            </label>
            <label>
              <input
                type="radio"
                name="comunicacion"
                value="WhatsApp"
                checked={comunicacion === 'WhatsApp'}
                onChange={handleComunicacionChange}
              />
              WhatsApp
            </label>
          </div>
          <div className={styles.checkboxGroup}>
            <label>
              <input
                type="checkbox"
                checked={showAlarmaForm}
                onChange={handleCheckboxChange}
              />
              Agregar Alarma
            </label>
          </div>
          {showAlarmaForm && (
            <div className={styles.alarmaForm}>
              <textarea
                value={alarmaTexto}
                onChange={handleAlarmaTextoChange}
                placeholder="Ingrese el texto de la alarma"
                rows="2"
                className={styles.textarea}
              />
              <input
                type="date"
                value={alarmaFecha}
                onChange={handleAlarmaFechaChange}
                className={styles.input}
              />
              <input
                type="time"
                value={alarmaHora}
                onChange={handleAlarmaHoraChange}
                className={styles.input}
              />
            </div>
          )}
          <button type="submit" className={styles.button}>
            Guardar
          </button>
          <button type="button" className={styles.button} onClick={() => setShowModal(false)}>
            Cancelar
          </button>
        </form>
      </div>
    </div>
  )
}

export default NotaModal