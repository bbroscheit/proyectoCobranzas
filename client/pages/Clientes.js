import React, { useState, useEffect, useContext } from "react";
// import Link from "next/link";
import styles from "./modules/clientes.module.css";
import useUser from "./hooks/useUser";
import CardClientes from "./components/CardClientes";
import CardGestiones from "./components/CardGestiones";
import CardGestionesTerminadas from "./components/CardGestionesTerminadas";
import CardAlarmas from "./components/CardAlarmas";
import CardRecordatorios from "./components/CardRecordatorios";
import { calculaTotalesPorGestor } from "./functions/calculaTotalesPorGestor";
import { montosPorAntiguedadPorGestor } from "./functions/montosPorAntiguedadPorGestor";
import AnticuacionPorGestor from "./charts/AnticuacionPorGestor";
import DiasCallePorGestor from "./charts/DiasCallePorGestor";
import VentasVsCobranzasPorGestor from "./charts/VentasVsCobranzasPorGestor";

const Clientes = () => {
  const [gestor, setGestor] = useUser("");
  const [user, setUser] = useUser("");
  const [facturasPorGestor, setFacturasPorGestor] = useState(null);
  const [totales, setTotales] = useState({
    recibosMes: 0,
    facturasNoVencidas: 0,
    facturasVencidas: 0,
    facturasMes: 0,
  });
  const [flag, setFlag] = useState(1);
  const [gestiones, setGestiones] = useState(0);
  const [gestionesCompletadas, setGestionesCompletadas] = useState(0);

  useEffect(() => {
    const userLogin = localStorage.getItem("userCobranzas");
    const userParse = JSON.parse(userLogin);

    fetch(
      `http://${process.env.NEXT_PUBLIC_LOCALHOST}:3001/getAllDocumentsByGestor/${userParse.id}`
    )
      // fetch(`https://${process.env.NEXT_PUBLIC_LOCALHOST}:3001/getAllDocumentsBySalepoint/${userLogin.id}`)
      .then((res) => res.json())
      .then((data) => {
        setFacturasPorGestor(data);

        // Una vez que tenemos los documentos, calculamos totales y montos
          const totalesCalc = calculaTotalesPorGestor(data, userParse);
          setTotales(totalesCalc);        
      })
      .catch((err) => console.error("Error al obtener documentos:", err));

    fetch(
      `http://${process.env.NEXT_PUBLIC_LOCALHOST}:3001/gestionesByGestor/${userParse.id}`
    )
      // fetch(`https://${process.env.NEXT_PUBLIC_LOCALHOST}:3001/gestionesByGestor/${userLogin.id}`)
      .then((res) => res.json())
      .then((data) => {
        setGestiones(data.gestion);
        setGestionesCompletadas(data.gestioncompletada);
      })
      .catch((err) => console.error("Error al obtener gestiones:", err))
  }, []);


  function handleChange(condition) {
    condition === 1 ? setFlag(1) : condition === 2 ? setFlag(2) : setFlag(3);
  }

  //console.log("gestiones terminadas por gestor:", gestionesCompletadas);
  return (
    <>
      <div className={styles.sectorContainer}>
        <div className={styles.sectorContainerTitle}>
          <p className={styles.sectionTitle}>Gestión</p>
        </div>
      </div>
      <div className={styles.container}>
        <div>
          {
            user ? <h1 className={styles.title}>{`Hola ${user.firstname}`}</h1> 
            : <h1 className={styles.title}>Hola Invitado</h1>
          }
        </div>
      </div>

      <div className={styles.cardContainer}>
        <CardClientes total={totales.recibosMes} title={"Pagado"} />
        <CardClientes total={totales.facturasNoVencidas} title={"Por Vencer"} />
        <CardClientes total={totales.facturasVencidas} title={"Vencido"} />
        <CardClientes
          total={totales.facturasMes}
          title={"Total Facturado del mes en curso"}
        />
      </div>

      <div className={styles.cardGestionesContainer}>
        <CardGestiones total={gestiones} />
        <CardGestionesTerminadas total={gestionesCompletadas} />
        <CardRecordatorios />
      </div>
      <div className={styles.buttonContainer}>
          <button
            className={
              flag === 1 ? styles.buttonActive : styles.buttonContainerButton
            }
            onClick={(e) => handleChange(1)}
          >
            Anticuacion
          </button>
          <button
            className={
              flag === 2 ? styles.buttonActive : styles.buttonContainerButton
            }
            onClick={(e) => handleChange(2)}
          >
            Dias en calle
          </button>
          <button
            className={
              flag === 3 ? styles.buttonActive : styles.buttonContainerButton
            }
            onClick={(e) => handleChange(3)}
          >
            Ventas vs Cobranzas
          </button>
        </div>
        <div className={styles.chartContainer}>
          {flag === 1 && facturasPorGestor && facturasPorGestor !== null ? (
            <AnticuacionPorGestor />
          ) : flag === 2 ? (
            <DiasCallePorGestor />
          ) : (
            <VentasVsCobranzasPorGestor />
          )}
        </div>
      
    </>
  );
};

export default Clientes;
