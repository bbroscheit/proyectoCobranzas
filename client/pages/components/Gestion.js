import React, { useState, useContext, useEffect } from "react";
import Router from "next/router";
import styles from "../modules/gestion.module.css";
import Swal from "sweetalert2";
import { formatNumber } from "../functions/formatNumber";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import CreateIcon from "@mui/icons-material/Create";
import AddIcon from "@mui/icons-material/Add";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import ForwardToInboxIcon from "@mui/icons-material/ForwardToInbox"; 
import GavelIcon from '@mui/icons-material/Gavel';
import MailLockIcon from '@mui/icons-material/MailLock';
import EmailIcon from '@mui/icons-material/Email';
import AvisosModal from "../modals/AvisosModal";
import CuentaCorrienteModal from "../modals/CuentaCorrienteModal";
import EnvioPreSuspensionModal from "../modals/EnvioPreSuspensionModal";
import EnvioLegalesModal from "../modals/EnvioLegales";
import EnvioSuspensionModal from "../modals/EnvioSuspensionModal";
import { postAvisos } from "../api/postAvisos";
import useUser from "../hooks/useUser";

function Gestion({ clienteId }) {
  const [user, setUser] = useUser("");
  const [cliente, setCliente] = useState("");
  const [usuarioId, setUsuarioId] = useState("");
  const [facturasCliente, setFacturasCliente] = useState([]);
  const [visibleFacturas, setVisibleFacturas] = useState(10);
  const [showAvisosModal, setShowAvisosModal] = useState(false);
  const [showCuentaCorrienteModal, setShowCuentaCorrienteModal] =
    useState(false);
  const [showEnvioPreSuspensionModal, setShowEnvioPreSuspensionModal] =
    useState(false);
  const [showEnvioSuspensionModal, setShowEnvioSuspensionModal] =
    useState(false);
  const [showEnvioLegalesModal, setShowEnvioLegalesModal] = useState(false);
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

    setCliente(clienteId);
    setUsuarioId(userLogin.id);
  }, [clienteId]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 100 &&
        visibleFacturas < facturasCliente.length
      ) {
        setVisibleFacturas((prev) => prev + 10);
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
        setTimeout(() => {
          Router.push("/AgendaDeLlamadas");
        }, 1000);
      })
      .catch((error) => {
        console.error("Error al enviar el formulario:", error);
      });
    setShowAvisosModal(false);
  };

  const openAvisosModal = () => {
    setShowAvisosModal(true);
  };

  const openCuentaCorrienteModal = () => {
    setShowCuentaCorrienteModal(true);
  };

  const openEnvioPreSuspensionModal = () => {
    setShowEnvioPreSuspensionModal(true);
  };

  const openEnvioSuspensionModal = () => {
    setShowEnvioSuspensionModal(true);
  };

  const openEnvioLegalesModal = () => {
    setShowEnvioLegalesModal(true);
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
          <button className={styles.button} onClick={openCuentaCorrienteModal}>
            <EmailIcon className={styles.buttonIcon} />
            <p className={styles.buttonText}>Enviar CC</p>
          </button>
          <button className={styles.button} onClick={openEnvioPreSuspensionModal}>
            <ForwardToInboxIcon className={styles.buttonIcon} />
            <p className={styles.buttonText}>Enviar Pre-Suspensión</p>
          </button>
          <button className={styles.button} onClick={openEnvioSuspensionModal}>
            <MailLockIcon className={styles.buttonIcon} />
            <p className={styles.buttonText}>Enviar Suspensión</p>
          </button>
          <button className={styles.button} onClick={openEnvioLegalesModal}>
            <GavelIcon className={styles.buttonIcon} />
            <p className={styles.buttonText}>Enviar Legales</p>
          </button>
        </div>
      </div>
      {currentFacturas.map((item, index) => {
        const data = item.payload;

        const fecha = new Date(item.fechaOrden);

        const dia = fecha.getDate().toString().padStart(2, "0");
        const mes = fecha
          .toLocaleString("es-ES", { month: "short" })
          .toUpperCase();

        return (
          <div key={index} className={styles.timelineItem}>
            <div className={styles.timelineDate}>
              <p>{dia}</p>
              <p>{mes}</p>
            </div>

            <div className={styles.timelineIcon}>
              {item.tipo === "documento" && data.tipodocumento === 9 ? (
                <LocalAtmIcon className={styles.reciboicon} />
              ) : item.tipo === "documento" ? (
                <CreateIcon className={styles.facturasicon} />
              ) : item.tipo === "nota" ? (
                <TextSnippetIcon className={styles.notasicon} />
              ) : (
                <NotificationsActiveIcon className={styles.alarmasicon} />
              )}
            </div>

            <div className={styles.timelineContent}>
              <h3 className={styles.timelineTitle}>
                {item.tipo === "documento" && data.tipodocumento === 9
                  ? "Pago Recibido"
                  : item.tipo === "documento"
                  ? `Documento emitido N° ${
                      data.numerodocumento?.trim() || data.id
                    }`
                  : item.tipo === "nota"
                  ? "Nota"
                  : "Evento"}
              </h3>

              <p className={styles.timelineText}>
                {item.tipo === "documento" && data.tipodocumento === 9
                  ? `Monto total pagado: $ ${formatNumber(data.montooriginal)}`
                  : item.tipo === "documento"
                  ? `Monto del Documento: $ ${formatNumber(data.montooriginal)}`
                  : item.tipo === "nota"
                  ? `Nota: ${data.detail}`
                  : ""}
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

      <CuentaCorrienteModal
        showModal={showCuentaCorrienteModal}
        setShowModal={setShowCuentaCorrienteModal}
        cliente={cliente}
      />

      <EnvioPreSuspensionModal
        showModal={showEnvioPreSuspensionModal}
        setShowModal={setShowEnvioPreSuspensionModal}
        cliente={cliente}
      />

      <EnvioSuspensionModal
        showModal={showEnvioSuspensionModal}
        setShowModal={setShowEnvioSuspensionModal}
        cliente={cliente}
      />

       <EnvioLegalesModal
        showModal={showEnvioLegalesModal}
        setShowModal={setShowEnvioLegalesModal}
        cliente={cliente}
      />
        
        
    </div>
  );
}

export default Gestion;
