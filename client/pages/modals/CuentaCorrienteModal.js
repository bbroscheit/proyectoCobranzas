import React, { useState, useEffect } from "react";
import Router from "next/router";
import styles from "../modules/cuentaCorrienteModal.module.css";
import { sendCuentaCorriente } from "../api/sendCuentaCorriente";
import Swal from "sweetalert2";

function CuentaCorrienteModal({ showModal, setShowModal, cliente }) {
  const [user, setUser]                     = useState("");
  const [emails, setEmails]                 = useState([]);
  const [emailSeleccionado, setEmail]       = useState("");
  const [emailCustom, setEmailCustom]       = useState("");
  const [loadingEmails, setLoadingEmails]   = useState(false);

  useEffect(() => {
    const userLogin = localStorage.getItem("userCobranzas");
    const userParse = JSON.parse(userLogin);
    setUser(userParse.id);
  }, []);

  useEffect(() => {
    if (!showModal || !user || !cliente) return;

    setLoadingEmails(true);
    fetch(
      `http://${process.env.NEXT_PUBLIC_LOCALHOST}:3001/clienteEmails/${user}/${cliente}`
    )
      .then((res) => res.json())
      .then((data) => {
        const lista = data.emails || [];
        setEmails(lista);
        setEmail(lista[0] || "");
      })
      .catch(() => setEmails([]))
      .finally(() => setLoadingEmails(false));
  }, [showModal, user, cliente]);

  const onSubmit = (e) => {
    e.preventDefault();

    const destinatario = emailSeleccionado === "otro" ? emailCustom.trim() : emailSeleccionado;

    if (!destinatario) {
      Swal.fire({ icon: "warning", title: "Ingresá un email de destino", timer: 1500, showConfirmButton: false });
      return;
    }

    sendCuentaCorriente({ numeroCliente: cliente, user, destinatario })
      .then((res) => {
        if (res.state === "success") {
          Swal.fire({ icon: "success", title: "Cuenta corriente enviada!", showConfirmButton: false, timer: 1000 });
        }
        setTimeout(() => Router.push("/AgendaDeLlamadas"), 1000);
      })
      .catch((error) => console.error("Error al enviar:", error));

    setShowModal(false);
  };

  if (!showModal) return null;

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h2 className={styles.title}>¿ Deseas enviar su Cuenta Corriente ?</h2>

        {loadingEmails ? (
          <p>Cargando emails...</p>
        ) : (
          <form onSubmit={onSubmit}>
            <div style={{ marginBottom: "12px" }}>
              <label style={{ display: "block", marginBottom: "6px", fontWeight: "bold" }}>
                Email de destino
              </label>

              {emails.length > 1 ? (
                <select
                  value={emailSeleccionado}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: "100%", padding: "6px", marginBottom: "8px" }}
                >
                  {emails.map((em) => (
                    <option key={em} value={em}>{em}</option>
                  ))}
                  <option value="otro">Otro...</option>
                </select>
              ) : emails.length === 1 ? (
                <select
                  value={emailSeleccionado}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: "100%", padding: "6px", marginBottom: "8px" }}
                >
                  <option value={emails[0]}>{emails[0]}</option>
                  <option value="otro">Otro...</option>
                </select>
              ) : (
                <select
                  value={emailSeleccionado}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: "100%", padding: "6px", marginBottom: "8px" }}
                >
                  <option value="otro">Ingresar email manualmente</option>
                </select>
              )}

              {emailSeleccionado === "otro" && (
                <input
                  type="email"
                  placeholder="ejemplo@empresa.com"
                  value={emailCustom}
                  onChange={(e) => setEmailCustom(e.target.value)}
                  style={{ width: "100%", padding: "6px", boxSizing: "border-box" }}
                />
              )}
            </div>

            <div className={styles.buttonContainer}>
              <button type="submit" className={styles.button}>Enviar</button>
              <button type="button" className={styles.button} onClick={() => setShowModal(false)}>
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default CuentaCorrienteModal;
