import React, { useContext } from "react";
import styles from "../modules/cardTotalFacturado.module.css";
import { formatNumber } from "../functions/formatNumber";
import { FacturacionContext } from "../context/FacturacionContext";

function CardTotalFacturado({ facturado }) {
  return (
    <div className={`${styles.divContainer} ${styles.background}`}>
      <h2>$ {formatNumber(facturado)}</h2>

      <p>Total Facturado del Mes</p>
    </div>
  );
}

export default CardTotalFacturado;
