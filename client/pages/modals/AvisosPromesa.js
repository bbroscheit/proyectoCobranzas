import React, { useEffect, useState } from "react";
import useUser from "../hooks/useUser";
import styles from "../modules/notaModal.module.css";

function AvisosPromesa({
  showModal,
  setShowModal,
  clienteId,
  setClienteId,
  nota,
  setNota,
  reprogram,
  setReprogram,
  handleSubmit,
}) {
  const [user, setUser] = useUser("");
  const [comunicacion, setComunicacion] = useState("");
  const [clientes, setClientes] = useState([]); // Lista de clientes para el input de búsqueda
  const [filteredClientes, setFilteredClientes] = useState([]); // Clientes filtrados para el input de búsqueda
  const [resumen, setResumen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // Texto del input de búsqueda

  useEffect(() => {
     if (!user?.id) return;

    const fetchLista = async () => {
      try {
        const res = await fetch(
          `http://${process.env.NEXT_PUBLIC_LOCALHOST}:3001/getAllClientBySucursal?usuarioId=${user.id}`,
        );
        if (!res.ok) throw new Error("Error al traer lista de clientes");

        const data = await res.json();

        setClientes(data);
      } catch (error) {
        console.error("❌ Error cargando lista de clientes:", error);
      }
    };

    fetchLista();
  }, [user]); // Fetch de clientes para el input de búsqueda

  const handleNotaChange = (e) => {
    setNota(e.target.value);
  };

  const handleComunicacionChange = (e) => {
     setComunicacion(e.target.value);
        setResumen(!!e.target.value);
  };

  const handleAlarmaFechaChange = (e) => {
    setReprogram(e.target.value);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    if (query === "") {
      setFilteredClientes([]);
      return;
    } else {
      if (clientes) {
        const filtered = clientes.filter((cliente) => {
          return (
            (cliente.name || "").toLowerCase().includes(query) || // Buscar por nombre
            cliente.id.toString().includes(query) // Buscar por número de cliente
          );
        });
        setFilteredClientes(filtered);
      }
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleSubmit({
      clienteId,
      nota,
      reprogram,
    });
    setNota("");
    setComunicacion("");
    setReprogram("");
    setResumen(false);
    setShowModal(false);
  };

  if (!showModal) return null;

  //console.log(`Datos a guardar: cliente : ${clienteId}, Nota : ${nota},COmunicacion :  ${comunicacion}, alarma :  ${reprogram}`);

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h2>Agendar promesa de Pago</h2>
        <form onSubmit={onSubmit}>
          <input
            className={styles.searchInputPromesa}
            type="search"
            placeholder="Ingrese N° o Nombre de Cliente"
            onChange={handleSearchChange}
            value={searchQuery}
          ></input>
          {/* mostrar los clientes filtrados */}
          {filteredClientes.length > 0 && (
            <div className={styles.clientesList}>
              {filteredClientes.map((cliente) => (
                <div
                  className={styles.clientesListItem}
                  key={cliente.id}
                  onClick={() => setClienteId(cliente.id)}
                >
                  <p>
                    {cliente.id} - {cliente.name}{" "}
                  </p>
                  <input
                    type="checkbox"
                    name="comunicacion"
                    value="clienteSeleccionado"
                    checked={clienteId === cliente.id}
                    onChange={handleComunicacionChange}
                  />
                </div>
              ))}
            </div>
          )}

          {resumen && (
            <div className={styles.alarmaForm}>
              <textarea
                value={nota}
                onChange={handleNotaChange}
                placeholder="Ingrese el detalle de la nota"
                rows="3"
                className={styles.textarea}
              />
              <h4>Agregar fecha de cobro</h4>

              <div className={styles.alarmaForm}>
                <input
                  type="date"
                  value={reprogram}
                  onChange={handleAlarmaFechaChange}
                  className={styles.input}
                />
              </div>

              <button type="submit" className={styles.button}>
                Guardar
              </button>
              <button
                type="button"
                className={styles.button}
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default AvisosPromesa;
