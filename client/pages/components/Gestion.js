import React, { useState, useContext, useEffect } from 'react'
import styles from '../modules/gestion.module.css'
import Swal from "sweetalert2";
import { FacturacionContext } from '../context/FacturacionContext'
import { formatNumber } from '../functions/formatNumber'
import { filterFacturasByCliente } from '../functions/filterFacturasByCliente'
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import CreateIcon from '@mui/icons-material/Create';
import AddIcon from '@mui/icons-material/Add';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import NotaModal from '../modals/NotaModal'
import AlarmaModal from '../modals/AlarmaModal'
import { postAlarm } from '../api/postAlarm'
import { postNote } from '../api/postNote'

function Gestion({clienteId}) {
  const { clientes } = useContext(FacturacionContext)
  const [ facturasCliente, setFacturasCliente ] = useState([])
  const [visibleFacturas, setVisibleFacturas] = useState(10)
  const [showNotaModal, setShowNotaModal] = useState(false)
  const [showAlarmaModal, setShowAlarmaModal] = useState(false)
  const [nota, setNota] = useState('')
  const [comunicacion, setComunicacion] = useState([])

  useEffect(() => {
    setFacturasCliente(filterFacturasByCliente(clientes, clienteId));
  }, [clientes, clienteId]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight) {
        setVisibleFacturas(prevVisibleFacturas => prevVisibleFacturas + 10)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const currentFacturas = facturasCliente.slice(0, visibleFacturas)

  const handleNotaSubmit = ({ nota, comunicacion, alarma }) => {
    if (alarma) {
      const noteData = {
        nota,
        comunicacion,
        numeroCliente: clienteId,
        user : "Belen Soria"
      };
      const alarmaData = {
        texto: alarma.texto,
        fecha: alarma.fecha,
        hora: alarma.hora,
        numeroCliente: clienteId,
        user : "Belen Soria"
      }
      postNote(noteData)
        .then((res) => {
          if (res.state === 'success') {
            postAlarm(alarmaData)
              .then((res) => {
                if (res.state === 'success') {
                  Swal.fire(({
                    icon: "success",
                    title: "Tu Nota y Alarma fueron creadas con éxito!",
                    showConfirmButton: false,
                    timer: 1000
                  }));
                } else {
                  Swal.fire({
                    icon: "error",
                    title: "Error al crear la alarma",
                    text: "Por favor, intenta nuevamente"
                  })
                }
              })
              setFacturasCliente([noteData, alarmaData , ...facturasCliente])
          } else {
            Swal.fire({
              icon: "error",
              title: "Error al crear la nota",
              text: "Por favor, intenta nuevamente"
            })
          }
        })

    } else {
      const noteData = {
        nota,
        comunicacion,
        numeroCliente: clienteId,
        user : "Belen Soria"
      };
      postNote(noteData)
      .then((res) => {
        if (res.state === 'success') {
          Swal.fire(({
            icon: "success",
            title: "Tu Nota fue creada con éxito!",
            showConfirmButton: false,
            timer: 1000
          }));
          setFacturasCliente([noteData, ...facturasCliente])
        } else {
          Swal.fire({
            icon: "error",
            title: "Error al crear la nota",
            text: "Por favor, intenta nuevamente"
          })
        }
      })
    }
    setShowNotaModal(false)
  }

  const handleAlarmaSubmit = ({ texto, fecha, hora }) => {
    const alarmaData = {
      texto,
      fecha,
      hora,
      numeroCliente: clienteId,
      user : "Belen Soria"
    };
    postAlarm(alarmaData)
      .then((res) => {
        if (res.state === 'success') {
          
          Swal.fire(({
            icon: "success",
            title: "Tu alarma fue creada con éxito!",
            showConfirmButton: false,
            timer: 1000
          }));
          setFacturasCliente([alarmaData , ...facturasCliente])
        } else {
          Swal.fire({
            icon: "error",
            title: "Error al crear la alarma",
            text: "Por favor, intenta nuevamente"
          })
        }
      })
    setShowAlarmaModal(false)
  }

  const openNotaModal = () => {
    setShowNotaModal(true)
  }

  const openAlarmaModal = () => {
    setShowAlarmaModal(true)
  }

  console.log('facturasCliente', facturasCliente)

  return (
    <div className={styles.timeline}>
      <div className={styles.timelineItem}>
        <div className={styles.timelineDate}>.</div>
        <div className={styles.timelineIcon}>
          <AddIcon className={styles.menuicon}/>
        </div>
        <div className={styles.timelineContentFirst}>
          <button className={styles.button} onClick={openAlarmaModal}>
            <NotificationsActiveIcon className={styles.buttonIcon}/> 
            <p className={styles.buttonText}>Alarma</p>
          </button>
          <button className={styles.button} onClick={openNotaModal}>
            <TextSnippetIcon className={styles.buttonIcon}/>
            <p className={styles.buttonText}>Nota</p>
          </button>
          {/* <button className={styles.button}>
            Manual
          </button> */}
        </div>
      </div>
      {currentFacturas.map((documento, index) => {
        const fecha = new Date(documento.FechaDocumento || documento.createdAt || documento.fecha);
        const dia = fecha.getDate().toString().padStart(2, '0')
        const mes = fecha.toLocaleString('es-ES', { month: 'short' }).toUpperCase()

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
                    {documento.TipoDocumento === 9 
                      ? <LocalAtmIcon className={styles.reciboicon}/>
                      : documento.TipoDocumento 
                        ? <CreateIcon className={styles.facturasicon}/> 
                        : documento.typecontact 
                          ? <TextSnippetIcon className={styles.notasicon}/>
                          : <NotificationsActiveIcon className={styles.alarmasicon}/>
                    }
            </div>
            <div className={styles.timelineContent}>
                <h3 className={styles.timelineTitle}> 
                    {documento.TipoDocumento === 9 
                      ? 'Pago Recibido' 
                      : documento.TipoDocumento 
                        ? `Documento emitido N° ${documento.NumeroDocumento?.trim() || documento.id}` 
                        : documento.typecontact || documento.comunicacion
                          ? 'Nota' 
                          : 'Alarma'
                    }
                </h3>
                <p className={styles.timelineText}>
                    {documento.TipoDocumento === 9
                        ? `Monto total pagado: $ ${formatNumber(documento.MontoOriginal)}`
                        : documento.TipoDocumento
                            ? `Monto del Documento: $ ${formatNumber(documento.MontoOriginal)}`
                            : documento.typecontact || documento.comunicacion
                                ? `Nota: ${documento.detail || documento.nota}`
                                : `Alarma: ${documento.detail || documento.texto}`}
                </p>
            </div>
          </div>
        )
      })}

            
        <NotaModal
          showModal={showNotaModal}
          setShowModal={setShowNotaModal}
          nota={nota}
          setNota={setNota}
          comunicacion={comunicacion}
          setComunicacion={setComunicacion}
          handleSubmit={handleNotaSubmit}
        /> 
      
        <AlarmaModal
          showModal={showAlarmaModal}
          setShowModal={setShowAlarmaModal}
          handleSubmit={handleAlarmaSubmit}
        />
      
    </div>
  )
}

export default Gestion