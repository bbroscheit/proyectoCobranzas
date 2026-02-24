import React, { useState, useEffect } from "react";
import Router from "next/router";
import styles from "../modules/cuentaCorrienteModal.module.css";
import { sendPreSuspension } from "../api/sendPreSuspension";
import Swal from "sweetalert2";

function EnvioPreSuspensionModal({ showModal, setShowModal, cliente }) {
  const [user, setUser] = useState("");

  useEffect(() => {
    const userLogin = localStorage.getItem("userCobranzas");
    const userParse = JSON.parse(userLogin);

    setUser(userParse.id);
  }, [user]);

  const onSubmit = () => {
    const cuentaCorrienteData = {
      numeroCliente: cliente,
      user: user,
    };

    sendPreSuspension(cuentaCorrienteData)
      .then((res) => {
        if (res.state === "success") {
          Swal.fire({
            icon: "success",
            title: "Tu envío fue realizado con éxito!",
            showConfirmButton: false,
            timer: 1000,
          });
        }
        setTimeout(() => {
          Router.push("/AgendaDeLlamadas");
        }, 1000);
      })
      .catch((error) => {
        console.error("Error al enviar el formulario:", error);
      });
    setShowModal(false);
  };

  if (!showModal) return null;

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h2 className={styles.title}>¿ Deseas enviar un aviso de pre-suspensión?</h2>
        <form onSubmit={(e) => onSubmit(e)}>
          <div className={styles.buttonContainer}>
            <button type="submit" className={styles.button}>
              Enviar
            </button>
            <button
              type="button"
              className={styles.button}
              onClick={() => setShowModal(false)}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EnvioPreSuspensionModal;
