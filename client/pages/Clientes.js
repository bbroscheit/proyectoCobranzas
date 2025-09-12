import React, { useState, useEffect, useContext } from "react";
// import Link from "next/link";
import styles from "./modules/clientes.module.css";
import useUser from "./hooks/useUser";
import { FacturacionContext } from "./context/FacturacionContext";
import { procesarDocumentos } from "./functions/procesarDocumentos";
import CardClientes from "./components/CardClientes";
import CardGestiones from "./components/CardGestiones";
import CardGestionesTerminadas from "./components/CardGestionesTerminadas";
import CardAlarmas from "./components/CardAlarmas";
import CardRecordatorios from "./components/CardRecordatorios";
import { calculaTotalesPorGestor } from "./functions/calculaTotalesPorGestor";
import { montosPorAntiguedadPorGestor } from "./functions/montosPorAntiguedadPorGestor";
import AnticuacionPorGestor from "./charts/AnticuacionPorGestor";
import DiasCallePorGestor from "./charts/DiasCallePorGestor";

const Clientes = () => {
  const [gestor, setGestor] = useUser("");
  const { facturas } = useContext(FacturacionContext);
  const [facturasVencidas, setFacturasVencidas] = useState([
    0, 0, 0, 0, 0, 0, 0, 0,
  ]);
  const [totales, setTotales] = useState({
    recibosMes: 0,
    facturasNoVencidas: 0,
    facturasVencidas: 0,
    facturasMes: 0,
  });
  const [flag, setFlag] = useState(1);
  const facturasTotales = procesarDocumentos(facturas);

  useEffect(() => {
    const fetchData = async () => {
      if (gestor !== "" && facturas && facturas.length > 0) {
        const facturasVencidas = await montosPorAntiguedadPorGestor(
          facturas,
          gestor
        );
        setFacturasVencidas(facturasVencidas);

        const totales = await calculaTotalesPorGestor(facturas, gestor);
        setTotales(totales);
      }
    };

    fetchData();
  }, [facturas, gestor]);

  function handleChange(condition) {
    condition === 1 ? setFlag(1) : condition === 2 ? setFlag(2) : setFlag(3);
  }

  return (
    <>
      <div className={styles.sectorContainer}>
        <div className={styles.sectorContainerTitle}>
          <p className={styles.sectionTitle}>Gestión</p>
        </div>
      </div>
      <div className={styles.container}>
        <div>
          <h1 className={styles.title}>Gestión</h1>
        </div>
      </div>

      {gestor !== "" && totales ? (
        <div className={styles.cardContainer}>
          <CardClientes total={totales.recibosMes} title={"Pagado"} />
          <CardClientes
            total={totales.facturasNoVencidas}
            title={"Por Vencer"}
          />
          <CardClientes total={totales.facturasVencidas} title={"Vencido"} />
          <CardClientes
            total={totales.facturasMes}
            title={"Total Facturado del mes en curso"}
          />
        </div>
      ) : (
        <div className={styles.cardContainer}>
          <CardClientes total={0} title={"Pagado"} />
          <CardClientes total={0} title={"Por Vencer"} />
          <CardClientes total={0} title={"Vencido"} />
          <CardClientes total={0} title={"Total Facturado del mes en curso"} />
        </div>
      )}

      <div className={styles.cardGestionesContainer}>
        <CardGestiones />
        <CardGestionesTerminadas />
        <CardAlarmas />
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
      <div>
        <div className={styles.chartContainer}>
          <AnticuacionPorGestor facturasContext={facturasVencidas} />
          <DiasCallePorGestor facturasContext={facturas} />
        </div>
      </div>
    </>
  );
};

export default Clientes;
