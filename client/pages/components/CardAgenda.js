import React from "react";
import { useRouter } from "next/router";
import styles from "../modules/cardagenda.module.css";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import { IoMdAdd } from "react-icons/io";
import PermContactCalendarIcon from "@mui/icons-material/PermContactCalendar";
import CardAgendaAVencer from "./CardAgendaAVencer";
import CardAgendaVencido from "./CardAgendaVencido";
import CardAgendaAFavor from "./CardAgendaAFavor";

// Separa un string de valores separados por coma o punto y coma
function parseValues(raw) {
  if (!raw) return [];
  return String(raw).split(/[,;]/).map(v => v.trim()).filter(Boolean);
}

// Si hay un solo valor muestra un <h3>, si hay varios muestra un desplegable nativo
function MultiValueField({ values, className, emptyLabel }) {
  if (!values || values.length === 0) {
    return emptyLabel ? <h3 className={className}>{emptyLabel}</h3> : null;
  }
  if (values.length === 1) {
    return <h3 className={className}>{values[0]}</h3>;
  }
  return (
    <details style={{ margin: 0 }}>
      <summary className={className} style={{ cursor: "pointer", listStyle: "none" }}>
        {values[0]} <span style={{ fontSize: "0.75em", opacity: 0.7 }}>+{values.length - 1}</span>
      </summary>
      <ul style={{ margin: "2px 0 0 0", padding: "0 0 0 12px", listStyle: "none" }}>
        {values.slice(1).map((v, i) => (
          <li key={i} className={className} style={{ marginTop: 2 }}>{v}</li>
        ))}
      </ul>
    </details>
  );
}

function CardAgenda({
  numCliente,
  clientes,
  cuit,
  contacto,
  email,
  deudaAVencer,
  deudaVencida,
  deudaTotal,
}) {
  const router = useRouter();

  const contactos = parseValues(contacto);
  const emails    = parseValues(email);

  return (
    <div className={styles.container}>
      <div>
        <div
          className={styles.containerClient}
          onClick={() =>
            router.push({
              pathname: `/detalle/${numCliente}`,
              query: { nombre: clientes },
            })
          }
        >
          <AccountBoxIcon />
          <h1 className={styles.cardTitle}>{clientes}</h1>
        </div>
        <div className={styles.containerContact}>
          <div className={styles.containerCuit}>
            <PermContactCalendarIcon />
            <h3>{cuit}</h3>
          </div>
          <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
            <MultiValueField values={contactos} className={styles.cardContact} />
            <MultiValueField values={emails}    className={styles.cardContact} />
          </div>
        </div>
      </div>
      {deudaTotal && deudaTotal > 0 ? (
        <>
          <CardAgendaAVencer cliente={numCliente} deuda={deudaAVencer} />
          <IoMdAdd className={styles.addicon} />
          <CardAgendaVencido cliente={numCliente} deuda={deudaVencida} />
        </>
      ) : (
        <>
          <CardAgendaAFavor cliente={numCliente} deuda={deudaTotal} />
        </>
      )}
    </div>
  );
}

export default CardAgenda;
