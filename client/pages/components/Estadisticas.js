import React, { useState, useContext, useEffect } from 'react'
import styles from '../modules/estadisticas.module.css'
import useUser from "../hooks/useUser";
import CardEstadisticasSaldos from './CardEstadisticasSaldos'
import CardTotalFacturado from './CardTotalFacturado'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { FacturacionContext } from '../context/FacturacionContext'
import CardFacturaCliente from './CardFacturaCliente'
import { filterAndSortDocuments } from '../functions/filterAndSortDocuments';
import { calculaTotales } from '../functions/calculaTotales';


function Estadisticas({clienteId}) {
  const [gestor, setGestor] = useUser("");
  const [ facturasPorGestor, setFacturasPorGestor ] = useState(null);
  const [ facturasCliente, setFacturasCliente ] = useState([])
  const [ totales, setTotales ] = useState({
    recibosMes: 0,
    facturasNoVencidas: 0,
    facturasVencidas: 0,
    facturasMes: 0,
  })
  const [nombreCliente, setNombreCliente] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const facturasPerPage = 10
  const [sortCriteria, setSortCriteria] = useState('FechaDocumentoDesc')
  const { documentosSinRecibos } = useContext(FacturacionContext)

  useEffect(() => {
    const cliente = clienteId;
    const userLogin = localStorage.getItem("userCobranzas")
    const userParse = JSON.parse(userLogin)

    fetch(`http://${process.env.NEXT_PUBLIC_LOCALHOST}:3001/getAllDocumentsByClient?userId=${encodeURIComponent(userParse.id)}&clienteId=${encodeURIComponent(cliente)}`)
          // fetch(`https://${process.env.NEXT_PUBLIC_LOCALHOST}:3001/getAllDocumentsBySalepoint/${userLogin.id}`)
            .then((res) => res.json())
            .then((data) => {
              setFacturasPorGestor(data);
              setFacturasCliente(filterAndSortDocuments(data))
              setTotales(calculaTotales(data));
            });
          
    fetch(`http://${process.env.NEXT_PUBLIC_LOCALHOST}:3001/clientName?userId=${encodeURIComponent(userParse.id)}&clienteId=${encodeURIComponent(cliente)}`)
          .then((res) => res.json())
          .then((data) => {
            setNombreCliente(data.nombre)
          });
              
  }, [documentosSinRecibos, clienteId])

  const sortFacturas = (documentosSinRecibos, criteria) => {
    switch (criteria) {
      case 'MontoAsc':
        return documentosSinRecibos.sort((a, b) => a.montooriginal - b.montooriginal)
      case 'MontoDesc':
        return documentosSinRecibos.sort((a, b) => b.montooriginal - a.montooriginal)
      case 'FechaDocumentoAsc':
        return documentosSinRecibos.sort((a, b) => new Date(a.fechadocumento) - new Date(b.fechadocumento))
      case 'FechaDocumentoDesc':
        return documentosSinRecibos.sort((a, b) => new Date(b.fechadocumento) - new Date(a.fechadocumento))
      case 'MontoPendiente':
        return documentosSinRecibos.sort((a, b) => b.montopendiente - a.montopendiente)
      default:
        return documentosSinRecibos
    }
  }

  const sortedFacturas = sortFacturas([...facturasCliente], sortCriteria)

  // Calcular los índices de las facturas a mostrar
  const indexOfLastFactura = currentPage * facturasPerPage
  const indexOfFirstFactura = indexOfLastFactura - facturasPerPage
  const currentFacturas = sortedFacturas.slice(indexOfFirstFactura, indexOfLastFactura)
  
   const totalPages = Math.ceil(facturasCliente?.length / facturasPerPage) || 0;
   // Cambiar de página
   const paginate = (pageNumber) => setCurrentPage(pageNumber)

   const getPaginationButtons = () => {
    const buttons = [];
    const visibleRange = 10; // Número máximo de botones antes de truncar
    const rangeStart = Math.max(1, currentPage - Math.floor(visibleRange / 2));
    const rangeEnd = Math.min(totalPages, rangeStart + visibleRange - 1);

    if (rangeStart > 1) {
      buttons.push(
        <button
          key={1}
          onClick={() => paginate(1)}
          className={styles.pageButton}
        >
          1
        </button>
      );
      if (rangeStart > 2) {
        buttons.push(
          <span key="start-dots" className={styles.ellipsis}>
            ...
          </span>
        );
      }
    }

    for (let i = rangeStart; i <= rangeEnd; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => paginate(i)}
          className={`${styles.pageButton} ${
            currentPage === i ? styles.active : ""
          }`}
        >
          {i}
        </button>
      );
    }

    if (rangeEnd < totalPages) {
      if (rangeEnd < totalPages - 1) {
        buttons.push(
          <span key="end-dots" className={styles.ellipsis}>
            ...
          </span>
        );
      }
      buttons.push(
        <button
          key={totalPages}
          onClick={() => paginate(totalPages)}
          className={styles.pageButton}
        >
          {totalPages}
        </button>
      );
    }

    return buttons;
  };

  console.log("Totales en Estadisticas:", totales);

  return (
    <div>
      <div className={styles.containerGrid}>
        <CardEstadisticasSaldos totalVencidas={totales.facturasVencidas} totalNoVencido={totales.facturasNoVencidas} recibosMes={totales.recibosMes}/>
        <CardTotalFacturado facturado={totales.facturasMes}/>
      </div>
      <div className={styles.sortOptions}>
          <label htmlFor="sort">Ordenar por: </label>
          <select id="sort" value={sortCriteria} onChange={(e) => setSortCriteria(e.target.value)}>
            <option value="MontoAsc">Monto más bajo</option>
            <option value="MontoDesc">Monto más alto</option>
            <option value="FechaDocumentoAsc">Fecha más antigua</option>
            <option value="FechaDocumentoDesc">Fecha más nueva</option>
            <option value="MontoPendiente">Monto pendiente</option>
          </select>
      </div>
      <div className={styles.facturasContainer}>
        
          {currentFacturas && currentFacturas.length > 0 ? 
            currentFacturas.map((factura, index) => (
              <CardFacturaCliente key={index} factura={factura} nombreCliente={nombreCliente} />
            )) : <p>No hay facturas para este cliente</p>}
        
        {/*Paginación*/}
        <div className={styles.pagination}>
          <button
            disabled={currentPage === 1}
            onClick={() => paginate(currentPage - 1)}
          >
            <ChevronLeftIcon />
          </button>
          {getPaginationButtons()}
          <button
            disabled={currentPage === totalPages}
            onClick={() => paginate(currentPage + 1)}
          >
            <ChevronRightIcon />
          </button>
          </div>
      </div>
    </div>
  )
}

export default Estadisticas