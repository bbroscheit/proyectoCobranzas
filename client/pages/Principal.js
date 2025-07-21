import React,{useState , useContext} from "react";
import { FacturacionContext } from './context/FacturacionContext';
import { procesarDocumentos } from './functions/procesarDocumentos'
import { montosPorAntiguedad } from './functions/montosPorAntiguedad';
import styles from "./modules/index.module.css"
import CardIndex from "./components/CardIndex";
import Anticuacion from "./charts/Anticuacion";
import DiasCalle from "./charts/DiasCalle";
import VentasVsCobranzas from "./charts/VentasVsCobranzas";
 
export default function Principal() {
  const { facturas } = useContext(FacturacionContext)
  const facturasTotales = procesarDocumentos(facturas)
  const facturasVencidas = montosPorAntiguedad(facturas)
  const [ flag , setFlag ] = useState(1)

  function handleChange(condition){
    condition === 1 ? setFlag(1) : condition === 2 ? setFlag(2) : setFlag(3)
  }

  return (
    <>
    <div className={styles.sectorContainer}>
      <p className={styles.sectionTitle}>Inicio</p>
    </div>
    <div className={styles.container}>
      <div>
        <h1 className={styles.title}>Hola Usuario</h1>
        <p className={styles.subtitle}>Revisa el estado de tu empresa a continuacion</p>
      </div>
      <div className={styles.positionContainer}>
        <div className={styles.position}>Ejecutivo</div>
      </div>
      <div className={styles.cardContainer}>
        {
          facturasTotales && facturasTotales !== null ? <CardIndex total={facturasTotales.recibosMes.total} cant={facturasTotales.recibosMes.cantidad} title={"pagado"} /> : <CardIndex total={0} cant={0} title={"pagado"} />
        }
        {
          facturasTotales && facturasTotales !== null ? <CardIndex total={facturasTotales.facturasNoVencidas.total} cant={facturasTotales.facturasNoVencidas.cantidad} title={"por vencer"} /> : <CardIndex total={0} cant={0} title={"por vencer"} />
        }
        {
          facturasTotales && facturasTotales !== null ? <CardIndex total={facturasTotales.facturasVencidas.total} cant={facturasTotales.facturasVencidas.cantidad} title={"vencido"} /> : <CardIndex total={0} cant={0} title={"vencido"} />
        }

      </div>
      <div className={styles.buttonContainer}>
        <button className={ flag === 1 ? styles.buttonActive : styles.buttonContainerButton } onClick={ e => handleChange(1)}>Anticuacion</button>
        <button className={ flag === 2 ? styles.buttonActive : styles.buttonContainerButton } onClick={ e => handleChange(2)}>Dias en calle</button>
        <button className={ flag === 3 ? styles.buttonActive : styles.buttonContainerButton } onClick={ e => handleChange(3)}>Ventas vs Cobranzas</button>
      </div>
      <div>
      {
        flag === 1 && facturasTotales && facturasTotales !== null 
          ? <Anticuacion facturasContext={facturasVencidas}/> 
          : flag === 2 
            ? <DiasCalle facturasContext={facturas}/>
            : <VentasVsCobranzas facturasContext={facturas}/>
      }
      </div>
    </div>
    </>
  );
}

