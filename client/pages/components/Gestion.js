import React, { useState, useContext, useEffect } from "react";
import styles from "../modules/gestion.module.css";
import Swal from "sweetalert2";
import { FacturacionContext } from "../context/FacturacionContext";
import { formatNumber } from "../functions/formatNumber";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import CreateIcon from "@mui/icons-material/Create";
import AddIcon from "@mui/icons-material/Add";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import AvisosModal from "../modals/AvisosModal";
import { postAvisos } from "../api/postAvisos";
import useUser from "../hooks/useUser";

function Gestion({ clienteId }) {
  const [user, setUser] = useUser("");
  const { clientes } = useContext(FacturacionContext);
  const [facturasCliente, setFacturasCliente] = useState([]);
  const [visibleFacturas, setVisibleFacturas] = useState(10);
  const [showAvisosModal, setShowAvisosModal] = useState(false);
  const [nota, setNota] = useState("");
  const [comunicacion, setComunicacion] = useState([]);
  const [emailText, setEmailText] = useState("");
  const [cuentaCorriente, setCuentaCorriente] = useState(false);
  const [reprogram, setReprogram] = useState(false);

  useEffect(() => {
    const cliente = clienteId;
    const userLogin = localStorage.getItem("userCobranzas");
    const userParse = JSON.parse(userLogin);

    fetch(
      `http://${
        process.env.NEXT_PUBLIC_LOCALHOST
      }:3001/getAllDocumentsByClient?userId=${encodeURIComponent(
        userParse.id
      )}&clienteId=${encodeURIComponent(cliente)}`
    )
      // fetch(`https://${process.env.NEXT_PUBLIC_LOCALHOST}:3001/getAllDocumentsBySalepoint/${userLogin.id}`)
      .then((res) => res.json())
      .then((data) => {
        setFacturasCliente(data);
      });
  }, [clientes, clienteId]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop ===
        document.documentElement.offsetHeight
      ) {
        setVisibleFacturas((prevVisibleFacturas) => prevVisibleFacturas + 10);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const currentFacturas = facturasCliente.slice(0, visibleFacturas);

  const handleAvisosSubmit = ({
    nota,
    comunicacion,
    emailText,
    cuentaCorriente,
    reprogram,
  }) => {
    const avisosData = {
      nota,
      comunicacion,
      emailText,
      cuentaCorriente,
      reprogram,
      numeroCliente: clienteId,
      user: user.id,
    };

    postAvisos(avisosData)
      .then((res) => {
        if (res.state === "success") {
          Swal.fire({
            icon: "success",
            title: "Tu aviso fue creado con éxito!",
            showConfirmButton: false,
            timer: 1000,
          });
        }
      })
      .catch(error => {
        console.error("Error al enviar el formulario:", error);
      });
    setShowAvisosModal(false);
  };

  const openAvisosModal = () => {
    setShowAvisosModal(true);
  };

  return (
    <div className={styles.timeline}>
      <div className={styles.timelineItem}>
        <div className={styles.timelineDate}>.</div>
        <div className={styles.timelineIcon}>
          <AddIcon className={styles.menuicon} />
        </div>
        <div className={styles.timelineContentFirst}>
          <button className={styles.button} onClick={openAvisosModal}>
            <TextSnippetIcon className={styles.buttonIcon} />
            <p className={styles.buttonText}>Avisos</p>
          </button>
        </div>
      </div>
      {currentFacturas.map((documento, index) => {
        const fecha = new Date(
          documento.fechadocumento || documento.createdAt || documento.fecha
        );
        const dia = fecha.getDate().toString().padStart(2, "0");
        const mes = fecha
          .toLocaleString("es-ES", { month: "short" })
          .toUpperCase();

        const today = new Date();
        const currentDay = today.getDate();
        const currentMonth = today.getMonth() + 1; // Los meses en JavaScript son 0-indexados

        return (
          <div key={index} className={styles.timelineItem}>
            <div className={styles.timelineDate}>
              <p>{dia ? dia : currentDay}</p>
              <p>{mes ? mes : currentMonth}</p>
            </div>
            <div className={styles.timelineIcon}>
              {documento.tipodocumento === 9 ? (
                <LocalAtmIcon className={styles.reciboicon} />
              ) : documento.tipodocumento ? (
                <CreateIcon className={styles.facturasicon} />
              ) : documento.typecontact ? (
                <TextSnippetIcon className={styles.notasicon} />
              ) : (
                <NotificationsActiveIcon className={styles.alarmasicon} />
              )}
            </div>
            <div className={styles.timelineContent}>
              <h3 className={styles.timelineTitle}>
                {documento.tipodocumento === 9
                  ? "Pago Recibido"
                  : documento.tipodocumento
                  ? `Documento emitido N° ${
                      documento.numerodocumento?.trim() || documento.id
                    }`
                  : documento.typecontact || documento.comunicacion
                  ? "Nota"
                  : "Alarma"}
              </h3>
              <p className={styles.timelineText}>
                {documento.tipodocumento === 9
                  ? `Monto total pagado: $ ${formatNumber(
                      documento.montooriginal
                    )}`
                  : documento.tipodocumento
                  ? `Monto del Documento: $ ${formatNumber(
                      documento.montooriginal
                    )}`
                  : documento.typecontact || documento.comunicacion
                  ? `Nota: ${documento.detail || documento.nota}`
                  : `Alarma: ${documento.detail || documento.texto}`}
              </p>
            </div>
          </div>
        );
      })}

      <AvisosModal
        showModal={showAvisosModal}
        setShowModal={setShowAvisosModal}
        nota={nota}
        setNota={setNota}
        comunicacion={comunicacion}
        setComunicacion={setComunicacion}
        emailText={emailText}
        setEmailText={setEmailText}
        cuentaCorriente={cuentaCorriente}
        setCuentaCorriente={setCuentaCorriente}
        reprogram={reprogram}
        setReprogram={setReprogram}
        handleSubmit={handleAvisosSubmit}
      />
    </div>
  );
}

export default Gestion;
