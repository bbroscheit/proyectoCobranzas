import React, { useState, useEffect } from "react";
import useUser from "./hooks/useUser";
import styles from "./modules/index.module.css";
import CardIndex from "./components/CardIndex";
import Anticuacion from "./charts/Anticuacion";
import DiasCalle from "./charts/DiasCalle";
import VentasVsCobranzas from "./charts/VentasVsCobranzas";

export default function Principal() {
  const [gestor, setGestor] = useUser("");
  const initialState = {
    recibosMes: { total: 0, cantidad: 0 },
    facturasNoVencidas: { total: 0, cantidad: 0 },
    facturasVencidas: { total: 0, cantidad: 0 },
    antiguedad: [],
    diasCalle: 0,
    ventasVsCobranzas: {
      meses: [],
      facturasVencidas: [],
      facturasNoVencidas: [],
      recibosRecibidos: [],
    },
  };
  const [facturasTotalesBD, setFacturasTotalesBD] = useState(initialState);
  const [flag, setFlag] = useState(1);

  function handleChange(condition) {
    condition === 1 ? setFlag(1) : condition === 2 ? setFlag(2) : setFlag(3);
  }

  useEffect(() => {
    //if (!gestor) return;

    const userLogin = localStorage.getItem("userCobranzas");
    const userParse = JSON.parse(userLogin);

    fetch(
      `http://${process.env.NEXT_PUBLIC_LOCALHOST}:3001/getAllDocumentsBySalepoint/${userParse.id}`
    )
      // fetch(`https://${process.env.NEXT_PUBLIC_LOCALHOST}:3001/getAllDocumentsBySalepoint/${userLogin.id}`)
      .then((res) => res.json())
      .then(setFacturasTotalesBD);
  }, []);

  //console.log("facturasTotalesBD", facturasTotalesBD);

  return (
    <>
      <div className={styles.sectorContainer}>
        <p className={styles.sectionTitle}>Inicio</p>
      </div>
      <div className={styles.container}>
        <div>
          {gestor && gestor !== "" ? (
            <h1 className={styles.title}>Hola {`${gestor.firstname}`}</h1>
          ) : (
            <h1 className={styles.title}>Bienvenido</h1>
          )}

          <p className={styles.subtitle}>
            Revisa el estado de tu empresa a continuacion
          </p>
        </div>
        <div className={styles.cardContainer}>
          <CardIndex
            total={facturasTotalesBD?.resumen?.recibosMes?.total ?? 0}
            cant={facturasTotalesBD?.resumen?.recibosMes?.cantidad ?? 0}
            title={"pagado"}
          />
          <CardIndex
            total={facturasTotalesBD?.resumen?.facturasNoVencidas?.total ?? 0}
            cant={facturasTotalesBD?.resumen?.facturasNoVencidas?.cantidad ?? 0}
            title={"por vencer"}
          />
          <CardIndex
            total={facturasTotalesBD?.resumen?.facturasVencidas?.total ?? 0}
            cant={facturasTotalesBD?.resumen?.facturasVencidas?.cantidad ?? 0}
            title={"vencido"}
          />
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
        <div>
          {facturasTotalesBD && flag === 1 && (
            <Anticuacion data={facturasTotalesBD.antiguedad} />
          )}

          {facturasTotalesBD && flag === 2 && (
            <DiasCalle data={facturasTotalesBD.diasCalle} />
          )}

          {facturasTotalesBD &&
            flag === 3 &&
            facturasTotalesBD.ventasVsCobranzas && (
              <VentasVsCobranzas data={facturasTotalesBD.ventasVsCobranzas} />
            )}
        </div>
      </div>
    </>
  );
}
