import React, { useState, useEffect } from "react";
// import Link from "next/link";
import styles from "./modules/clientes.module.css";
import useUser from "./hooks/useUser";
import CardClientes from "./components/CardClientes";
import CardGestiones from "./components/CardGestiones";
import CardGestionesTerminadas from "./components/CardGestionesTerminadas";
import CardGestionesNoRealizadas from "./components/CardGestionesNoRealizadas";
import CardRecordatorios from "./components/CardRecordatorios";
import AnticuacionPorGestor from "./charts/AnticuacionPorGestor";
import DiasCallePorGestor from "./charts/DiasCallePorGestor";
import VentasVsCobranzasPorGestor from "./charts/VentasVsCobranzasPorGestor";

const Clientes = () => {
  
  const [user, setUser] = useUser("");
  const initialState = {
      totalCobradoMes: 0,
      saldoPendiente: 0 ,
      saldoVencido: 0 ,
      totalFacturadoMes: 0,
      antiguedad: [],
      diasCalle: 0,
      ventasVsCobranzas: {
        meses: [],
        facturasVencidas: [],
        facturasNoVencidas: [],
        recibosRecibidos: [],
      },
    };
  const initialStateGestiones = {
    hoy: 0,
    completadasMes: 0,
    noCompletadasMes: 0
  }
  const [facturasTotalesBD, setFacturasTotalesBD] = useState(initialState);
  const [flag, setFlag] = useState(1);
  const [gestiones, setGestiones] = useState(initialStateGestiones);
  const [gestionesCompletadas, setGestionesCompletadas] = useState(0);

  useEffect(() => {

  const fetchData = async () => {
    try {
      const userLogin = localStorage.getItem("userCobranzas");
      const userParse = JSON.parse(userLogin);

      if (!userParse) return;

      const [documentosRes, gestionesRes] = await Promise.all([
        fetch(`http://${process.env.NEXT_PUBLIC_LOCALHOST}:3001/getAllDocumentsByGestor/${userParse.id}`),
        fetch(`http://${process.env.NEXT_PUBLIC_LOCALHOST}:3001/gestionesByGestor/${userParse.id}`)
      ]);

      const documentosData = await documentosRes.json();
      const gestionesData = await gestionesRes.json();

      setFacturasTotalesBD(documentosData);
      setGestiones(gestionesData.resumenGestiones);
      

    } catch (err) {
      console.error("Error al cargar datos de gestión:", err);
    }
  };

  fetchData();

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
        <CardClientes total={facturasTotalesBD.totalCobradoMes} title={"Pagado"} />
        <CardClientes total={facturasTotalesBD.saldoPendiente} title={"Por Vencer"} />
        <CardClientes total={facturasTotalesBD.saldoVencido} title={"Vencido"} />
        <CardClientes
          total={facturasTotalesBD.totalFacturadoMes}
          title={"Total Facturado del mes en curso"}
        />
      </div>

      <div className={styles.cardGestionesContainer}>
        <CardGestiones total={gestiones.hoy} />
        <CardGestionesTerminadas total={gestiones.completadasMes} />
        <CardGestionesNoRealizadas total={gestiones.noCompletadasMes} />
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
          {flag === 1 && facturasTotalesBD ? (
            <AnticuacionPorGestor data={facturasTotalesBD.antiguedad}/>
          ) : flag === 2 ? (
            <DiasCallePorGestor data={facturasTotalesBD.diasCalle} />
          ) : (
            <VentasVsCobranzasPorGestor data={facturasTotalesBD.ventasVsCobranzas} />
          )}
        </div>
      
    </>
  );
};

export default Clientes;
