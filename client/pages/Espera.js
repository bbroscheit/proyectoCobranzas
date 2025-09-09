import React,{ useEffect, useContext } from "react";
import styles from "../pages/modules/waiting.module.css"
import { useRouter } from "next/router";
import { FacturacionContext } from './context/FacturacionContext';
import PacmanLoader from "react-spinners/PacmanLoader";

export default function Home() {
  const {facturas} = useContext(FacturacionContext)
  const router = useRouter();

  console.log( "facturas en espera", facturas)
  
  // Redirigir cuando el contexto esté cargado
  useEffect(() => {
    if (facturas && facturas.length > 0) {
      router.push("/Principal"); 
    }
  }, [facturas, router]); 

  return (
    <>
      <div className={styles.container}>
        <PacmanLoader 
          color= {"#ebe423"}
        />
        <h1>Espera...</h1>
      </div>
    </>
  );
}
