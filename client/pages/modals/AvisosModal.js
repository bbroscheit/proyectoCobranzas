import React, { useState, useEffect } from "react";
import styles from "../modules/notaModal.module.css";

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
  cliente,
  handleSubmit,
}) {
  const [showAlarmaForm, setShowAlarmaForm]   = useState(false);
  const [showEmailForm, setShowEmailForm]     = useState(false);
  const [user, setUser]                       = useState("");
  const [emails, setEmails]                   = useState([]);
  const [emailSeleccionado, setEmailSel]      = useState("");
  const [emailCustom, setEmailCustom]         = useState("");
  const [loadingEmails, setLoadingEmails]     = useState(false);

  useEffect(() => {
    const userLogin = localStorage.getItem("userCobranzas");
    if (userLogin) setUser(JSON.parse(userLogin).id);
  }, []);

  useEffect(() => {
    if (!showEmailForm || !user || !cliente) return;

    setLoadingEmails(true);
    fetch(
      `http://${process.env.NEXT_PUBLIC_LOCALHOST}:3001/clienteEmails/${user}/${cliente}`
    )
      .then((res) => res.json())
      .then((data) => {
        const lista = data.emails || [];
        setEmails(lista);
        setEmailSel(lista[0] || "otro");
      })
      .catch(() => { setEmails([]); setEmailSel("otro"); })
      .finally(() => setLoadingEmails(false));
  }, [showEmailForm, user, cliente]);

  const handleCheckboxEmailChange = (e) => {
    setShowEmailForm(e.target.checked);
    if (!e.target.checked) {
      setCuentaCorriente(false);
    }
  };

  const handleCheckboxCuentaCorrienteChange = (e) => {
    setCuentaCorriente(e.target.checked);
  };

  const handleCheckboxChange = (e) => {
    setShowAlarmaForm(e.target.checked);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    let destinatario = null;
    if (showEmailForm) {
      destinatario = emailSeleccionado === "otro" ? emailCustom.trim() : emailSeleccionado;
    }

    handleSubmit({
      nota,
      comunicacion,
      emailText: showEmailForm ? emailText : "",
      cuentaCorriente: showEmailForm ? cuentaCorriente : false,
      reprogram,
      destinatario,
    });

    setNota("");
    setComunicacion("");
    setEmailText("");
    setReprogram("");
    setCuentaCorriente(false);
    setShowAlarmaForm(false);
    setShowEmailForm(false);
    setEmails([]);
    setEmailSel("");
    setEmailCustom("");
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
            onChange={(e) => setNota(e.target.value)}
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
                onChange={(e) => setComunicacion(e.target.value)}
              />
              Email
            </label>
            <label>
              <input
                type="radio"
                name="comunicacion"
                value="Telefónico"
                checked={comunicacion === "Telefónico"}
                onChange={(e) => setComunicacion(e.target.value)}
              />
              Telefónico
            </label>
            <label>
              <input
                type="radio"
                name="comunicacion"
                value="WhatsApp"
                checked={comunicacion === "WhatsApp"}
                onChange={(e) => setComunicacion(e.target.value)}
              />
              WhatsApp
            </label>
          </div>

          {/* Envío de email */}
          <div className={styles.checkboxGroup}>
            <label>
              <input
                type="checkbox"
                checked={showEmailForm}
                onChange={handleCheckboxEmailChange}
              />
              Enviar Email
            </label>
          </div>

          {showEmailForm && (
            <div className={styles.alarmaForm}>
              {/* Selector de destinatario */}
              <div style={{ marginBottom: "10px" }}>
                <label style={{ display: "block", marginBottom: "4px", fontWeight: "bold" }}>
                  Email de destino
                </label>
                {loadingEmails ? (
                  <p>Cargando emails...</p>
                ) : (
                  <>
                    <select
                      value={emailSeleccionado}
                      onChange={(e) => setEmailSel(e.target.value)}
                      style={{ width: "100%", padding: "6px", marginBottom: "6px" }}
                    >
                      {emails.map((em) => (
                        <option key={em} value={em}>{em}</option>
                      ))}
                      <option value="otro">Otro...</option>
                    </select>
                    {emailSeleccionado === "otro" && (
                      <input
                        type="email"
                        placeholder="ejemplo@empresa.com"
                        value={emailCustom}
                        onChange={(e) => setEmailCustom(e.target.value)}
                        style={{ width: "100%", padding: "6px", boxSizing: "border-box" }}
                      />
                    )}
                  </>
                )}
              </div>

              {/* Cuerpo del mensaje */}
              <textarea
                value={emailText}
                onChange={(e) => setEmailText(e.target.value)}
                placeholder="Ingrese el texto del Email"
                rows="4"
                className={styles.textarea}
              />

              {/* Cuenta corriente */}
              <div className={styles.checkboxGroup}>
                <label>
                  <input
                    type="checkbox"
                    checked={cuentaCorriente}
                    onChange={handleCheckboxCuentaCorrienteChange}
                  />
                  Adjuntar Cuenta Corriente
                </label>
              </div>
            </div>
          )}

          {/* Alarma */}
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
                onChange={(e) => setReprogram(e.target.value)}
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
