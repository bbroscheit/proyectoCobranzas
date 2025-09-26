import React, { useState, useEffect, useContext } from "react";
import styles from "@/pages/modules/agendadellamadas.module.css";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CardAgenda from "./components/CardAgenda";
import { FacturacionContext } from "../pages/context/FacturacionContext"
import useUser from "./hooks/useUser";

export default function AgendaDeLlamadas() {
  const [user, setUser] = useUser("");
  const [lista, setLista] = useState(null); // Lista de llamadas
  const [cliente, setCliente] = useState(null);
  const [filteredClientes, setFilteredClientes] = useState(null); // Clientes filtrados
  const [searchQuery, setSearchQuery] = useState(""); // Texto del input de búsqueda
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const recordsPerPage = 20; // Número de registros por página

  const { totalesPorCliente, totalesVencidosPorCliente } = useContext(FacturacionContext);

  useEffect(() => {
  const fetchLista = async () => {
    try {
      const res = await fetch(`http://${process.env.NEXT_PUBLIC_LOCALHOST}:3001/lista-llamadas?usuarioId=${user.id}`); 
      if (!res.ok) throw new Error("Error al traer lista");

      const data = await res.json();
      console.log("✅ Lista de llamadas:", data);

      if (data?.clientes) {
        
        const clientesSinLlamar = data.clientes.filter(c => !c.llamado);

        setCliente(clientesSinLlamar);
        setFilteredClientes(clientesSinLlamar);
        setLista({ ...data, clientes: clientesSinLlamar });
      }
    } catch (error) {
      console.error("❌ Error cargando lista de llamadas:", error);
    }
  };

  fetchLista();
}, [user]);

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (cliente) {
      const filtered = cliente.filter((cliente) => {
        return (
          cliente.name.toLowerCase().includes(query) || // Buscar por nombre
          cliente.id.toString().includes(query) // Buscar por número de cliente
        );
      });
      setFilteredClientes(filtered);
      setCurrentPage(1); // Reiniciar a la primera página
    }
  };

  const handleSortChange = (e) => {
    const sortOption = e.target.value;

    if (filteredClientes) {
      
      let sortedClientes = [...filteredClientes];

      switch (sortOption) {
        case "No vencido primero":
          sortedClientes.sort(
            (a, b) =>
              (totalesPorCliente[b.id] || 0) -
              (totalesPorCliente[a.id] || 0)
          );
          break;

        case "Vencido primero":
          sortedClientes.sort(
            (a, b) =>
              (totalesVencidosPorCliente[b.id] || 0) -
              (totalesVencidosPorCliente[a.id] || 0)
          );
          break;

        case "Deuda total":
          sortedClientes.sort(
            (a, b) =>
              ((totalesPorCliente[b.id] || 0) +
                (totalesVencidosPorCliente[b.id] || 0)) -
              ((totalesPorCliente[a.id] || 0) +
                (totalesVencidosPorCliente[a.id] || 0))
          );
          break;

        case "Nombre":
          sortedClientes.sort((a, b) => a.name.localeCompare(b.name));
          break;

        default:
          break;
      }

      setFilteredClientes(sortedClientes);
      setCurrentPage(1); // Reiniciar a la primera página
    }
  };

  // Calcular los índices de los registros a mostrar en la página actual
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords =
    filteredClientes?.slice(indexOfFirstRecord, indexOfLastRecord) || [];

  // Calcular el número total de páginas
  const totalPages = Math.ceil(filteredClientes?.length / recordsPerPage) || 0;

  // Cambiar la página actual
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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

  //console.log("Clientes para agenda de llamadas:", cliente);

  return (
    <>
      <div className={styles.sectorContainer}>
        <p className={styles.sectionTitle}>Agenda de LLamadas</p>
      </div>
      <div className={styles.container}>
        <div>
          {
            user ? <h1 className={styles.title}>{`Hola ${user.firstname}`}</h1> 
            : <h1 className={styles.title}>Hola Invitado</h1>
          }
          
          <p className={styles.subtitle}>
            Revisa el estado de tu cartera a continuación
          </p>
        </div>
        {/* <div className={styles.positionContainer}>
          <div className={styles.position}>Ejecutivo</div>
        </div> */}
        <div className={styles.positionContainer2}>
        <input
            type="search"
            placeholder="Ingresa el N° de cliente o nombre"
            className={styles.positionFinder}
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <select
            className={styles.positionSelect}
            onChange={handleSortChange}
            defaultValue="Ordenar por"
          >
            <option disabled>Ordenar por</option>
            <option>No vencido primero</option>
            <option>Vencido primero</option>
            <option>Deuda total</option>
            <option>Nombre</option>
          </select>
        </div>
        {currentRecords && currentRecords.length > 0 ? (
          currentRecords.map((e, index) => <CardAgenda  key={index} 
                                                        numCliente={e.id} 
                                                        clientes={e.name} 
                                                        cuit={e.cuit} 
                                                        contacto={e.contacto} 
                                                        deudaAVencer={e.deudaNoVencida}
                                                        deudaVencida={e.deudaVencida}
                                                        deudaTotal={e.deudaTotal}
                                                        /> )
        ) : (
          <p>No hay registros para mostrar</p>
        )}

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
    </>
  );
}
