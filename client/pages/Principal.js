import React, { useState, useContext, useEffect } from "react";
import useUser from "./hooks/useUser";
import { FacturacionContext } from "./context/FacturacionContext";
import { procesarDocumentos } from "./functions/procesarDocumentos";
import { montosPorAntiguedad } from "./functions/montosPorAntiguedad";
import styles from "./modules/index.module.css";
import CardIndex from "./components/CardIndex";
import Anticuacion from "./charts/Anticuacion";
import DiasCalle from "./charts/DiasCalle";
import VentasVsCobranzas from "./charts/VentasVsCobranzas";

export default function Principal() {
  const [gestor, setGestor] = useUser("");
  const [facturasTotalesBD, setFacturasTotalesBD] = useState(null);
  const [flag, setFlag] = useState(1);

  function handleChange(condition) {
    condition === 1 ? setFlag(1) : condition === 2 ? setFlag(2) : setFlag(3);
  }

  useEffect(() => {
    const userLogin = localStorage.getItem("userCobranzas");
    const userParse = JSON.parse(userLogin);

    fetch(
      `http://${process.env.NEXT_PUBLIC_LOCALHOST}:3001/getAllDocumentsBySalepoint/${userParse.id}`
    )
      // fetch(`https://${process.env.NEXT_PUBLIC_LOCALHOST}:3001/getAllDocumentsBySalepoint/${userLogin.id}`)
      .then((res) => res.json())
      .then((data) => {
        setFacturasTotalesBD(procesarDocumentos(data));
        //setFacturasVencidasBD(montosPorAntiguedad(data));
      });
  }, [gestor]);

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
          {facturasTotalesBD && facturasTotalesBD !== null ? (
            <CardIndex
              total={facturasTotalesBD.recibosMes.total}
              cant={facturasTotalesBD.recibosMes.cantidad}
              title={"pagado"}
            />
          ) : (
            <CardIndex total={0} cant={0} title={"pagado"} />
          )}
          {facturasTotalesBD && facturasTotalesBD !== null ? (
            <CardIndex
              total={facturasTotalesBD.facturasNoVencidas.total}
              cant={facturasTotalesBD.facturasNoVencidas.cantidad}
              title={"por vencer"}
            />
          ) : (
            <CardIndex total={0} cant={0} title={"por vencer"} />
          )}
          {facturasTotalesBD && facturasTotalesBD !== null ? (
            <CardIndex
              total={facturasTotalesBD.facturasVencidas.total}
              cant={facturasTotalesBD.facturasVencidas.cantidad}
              title={"vencido"}
            />
          ) : (
            <CardIndex total={0} cant={0} title={"vencido"} />
          )}
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
          {flag === 1 && facturasTotalesBD && facturasTotalesBD !== null ? (
            <Anticuacion />
          ) : flag === 2 ? (
            <DiasCalle />
          ) : (
            <VentasVsCobranzas />
          )}
        </div>
      </div>
    </>
  );
}
