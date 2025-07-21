import React, { useState, useEffect, useContext } from "react";
import styles from "../modules/detalle.module.css";
import { useRouter } from "next/router";
import { VscGraph } from "react-icons/vsc";
import { ImParagraphJustify } from "react-icons/im";
import { FaRegWindowRestore } from "react-icons/fa";
import { IoChatbubblesOutline } from "react-icons/io5";
import { IoSettingsOutline } from "react-icons/io5";
import Estadisticas from "../components/Estadisticas";
import Avisos from "../components/Avisos";
import Gestion from "../components/Gestion";

export default function Detalle() {
  const [flag, setFlag] = useState(1);
  const router = useRouter();
  const { id } = router.query;

  function handleClick(a) {
    if (a >= 1 && a <= 5) {
      setFlag(a);
    }
  }

  const components = {
    1: <Estadisticas clienteId={id}/>,
    2: <Gestion clienteId={id}/>,
    // 3: <Avisos />
  };

  const menuItems = [
    { id: 1, icon: <VscGraph />, label: "Pendientes" },
    { id: 2, icon: <ImParagraphJustify />, label: "Historial" },
    // { id: 3, icon: <FaRegWindowRestore />, label: "Avisos" },
  ];

  return (
    <>
      <div className={styles.sectorContainer}>
        <p className={styles.sectionTitle}>Cliente N° {id}</p>
      </div>
      <div className={styles.miniNavbar}>
        {menuItems.map((item) => (
          <div
            key={item.id}
            className={flag === item.id ? styles.sectorActive : styles.sector}
            onClick={() => handleClick(item.id)}
          >
            {item.icon}
            <h3>{item.label}</h3>
          </div>
        ))}
        
      </div>
      <div>{components[flag]}</div>
    </>
  );
}
