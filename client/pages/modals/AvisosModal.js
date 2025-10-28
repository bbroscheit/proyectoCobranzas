import React, { useState } from "react";
import styles from "../modules/notaModal.module.css";
import { FaLessThanEqual } from "react-icons/fa";

function AvisosModal({
  showModal,
  setShowModal,
  nota,
  setNota,
  comunicacion,
  setComunicacion,
  emailText,
  setEmailText,
  cuentaCorriente,
  setCuentaCorriente,
  reprogram,
  setReprogram,
  handleSubmit,
}) {
  const [showAlarmaForm, setShowAlarmaForm] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  
  const handleNotaChange = (e) => {
    setNota(e.target.value);
  };

  const handleComunicacionChange = (e) => {
    setComunicacion(e.target.value);
  };

  const handleEmailTextChange = (e) => {
    setEmailText(e.target.value);
  };

  const handleAlarmaFechaChange = (e) => {
    setReprogram(e.target.value);
  };

  const handleCheckboxCuentaCorrienteChange = (e) => {
    if (cuentaCorriente === false) {
      setCuentaCorriente(true);
    } else {
      setCuentaCorriente(false);
    }
  };

  const handleCheckboxChange = (e) => {
    setShowAlarmaForm(e.target.checked);
  };

  const handleCheckboxEmailChange = (e) => {
    setShowEmailForm(e.target.checked);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleSubmit({
      nota,
      comunicacion,
      emailText,
      cuentaCorriente,
      reprogram
    });
    setNota("");
    setComunicacion("");
    setEmailText("")
    setReprogram("")
    setCuentaCorriente(false)
    setShowAlarmaForm(false)
    setShowModal(false);
  };

  if (!showModal) return null;

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h2>Agregar Nota</h2>
        <form onSubmit={onSubmit}>
          <textarea
            value={nota}
            onChange={handleNotaChange}
            placeholder="Ingrese el detalle de la nota"
            rows="3"
            className={styles.textarea}
          />
          <h4>Tipo de comunicación</h4>
          <div className={styles.radioGroup}>
            <label>
              <input
                type="radio"
                name="comunicacion"
                value="Email"
                checked={comunicacion === "Email"}
                onChange={handleComunicacionChange}
              />
              Email
            </label>
            <label>
              <input
                type="radio"
                name="comunicacion"
                value="Telefónico"
                checked={comunicacion === "Telefónico"}
                onChange={handleComunicacionChange}
              />
              Telefónico
            </label>
            <label>
              <input
                type="radio"
                name="comunicacion"
                value="WhatsApp"
                checked={comunicacion === "WhatsApp"}
                onChange={handleComunicacionChange}
              />
              WhatsApp
            </label>
          </div>
          {/* envio de email */}
          <div className={styles.checkboxGroup}>
            <label>
              <input
                type="checkbox"
                checked={showEmailForm}
                onChange={handleCheckboxEmailChange}
              />
              Enviar Email
            </label>
            {showEmailForm && (
              <div className={styles.alarmaForm}>
                <textarea
                  value={emailText}
                  onChange={handleEmailTextChange}
                  placeholder="Ingrese el texto del Email"
                  rows="3"
                  className={styles.textarea}
                />
              </div>
            )}
          </div>
          {/* cuenta corriente si o no */}
          {showEmailForm && (
          <div className={styles.checkboxGroup}>
            <label>
              <input
                type="checkbox"
                onChange={handleCheckboxCuentaCorrienteChange}
              />
              Adjuntar Cuenta Corriente
            </label>
          </div>
          )}
          
          {/* Apertura de re-llamada */}
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
              <input
                type="date"
                value={reprogram}
                onChange={handleAlarmaFechaChange}
                className={styles.input}
              />
            </div>
          )}
          <button type="submit" className={styles.button}>
            Guardar
          </button>
          <button
            type="button"
            className={styles.button}
            onClick={() => setShowModal(false)}
          >
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
}

export default AvisosModal;
