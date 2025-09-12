export function getClientesPorGestor( user, clientes) {
  let nombreGestor = `${user.firstname} ${user.lastname}`
  let sucursal = user.sucursal

  // nos traemos del back toda la informacion que tenemos guardada de cada cliente
  
  let filteredClientes = clientes.filter(
    (cliente) => cliente.gestor === nombreGestor
  );


  // filtramos los clientes que no tienen deuda
  let clientWithoutDebt = filteredClientes.filter(
    (cliente) =>
      cliente.totalFacturasVencidas !== 0 ||
      cliente.totalFacturasSinVencer !== 0
  );

  // Dividimos los clientes en dos arrays: sin documentos con fecha y con documentos con fecha
  let clientsWithoutFecha = clientWithoutDebt.filter(
    (cliente) => !cliente.documentos.some((documento) => documento.fecha)
  );

  let clientsWithFecha = clientWithoutDebt.filter((cliente) =>
    cliente.documentos.some(
      (documento) => documento.fecha && !documento.typecontact
    )
  );

  // Excluimos los clientes que tengan una alarma posterior a la fecha actual
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0); // Ignorar la hora para la comparación

  let validClientsWithFecha = clientsWithFecha.filter((cliente) => {
    return cliente.documentos.some((documento) => {
      let documentoFecha = new Date(documento.fecha);
      documentoFecha.setHours(0, 0, 0, 0); // Ignorar la hora para la comparación
      return documentoFecha <= currentDate;
    });
  });

  // concatenamos los clientes sin fecha con los clientes con fecha válida
  let allFilteredClients = [...clientsWithoutFecha, ...validClientsWithFecha];

  // Ordenamos los clientes
  allFilteredClients.sort((a, b) => {
    // Primer nivel: Ordenar por fecha de alarma (los que no tienen alarmas van al final)
    let aFecha =
      a.documentos
        .filter((doc) => doc.fecha && !doc.typecontact)
        .map((doc) => new Date(doc.fecha).setHours(0, 0, 0, 0))
        .sort()[0] || Infinity;
    let bFecha =
      b.documentos
        .filter((doc) => doc.fecha && !doc.typecontact)
        .map((doc) => new Date(doc.fecha).setHours(0, 0, 0, 0))
        .sort()[0] || Infinity;
    if (aFecha !== bFecha) return aFecha - bFecha;
    // Segundo nivel: Ordenar por totalFacturasVencidas de mayor a menor
    if (a.totalFacturasVencidas !== b.totalFacturasVencidas)
      return b.totalFacturasVencidas - a.totalFacturasVencidas;
    // Tercer nivel: Ordenar por totalFacturasSinVencer de mayor a menor
    if (a.totalFacturasSinVencer !== b.totalFacturasSinVencer)
      return b.totalFacturasSinVencer - a.totalFacturasSinVencer;

    return 0;
  });


  // Verificamos la fecha antes de guardar en localStorage
  const storedData = JSON.parse(localStorage.getItem("filteredClientsData"));
  if (storedData) {
    let storedDate = new Date(storedData.date);
    storedDate.setHours(0, 0, 0, 0); // Ignorar la hora para la comparación
    if (storedDate.getTime() === currentDate.getTime()){
      // La fecha es la misma y el clients tiene datos, no guardamos nada
      return allFilteredClients;
    }
  }

  // Guardamos la fecha actual y el array en localStorage
  const dataToStore = {
    date: currentDate.toISOString(),
    clients: allFilteredClients,
  };

  localStorage.setItem("filteredClientsData", JSON.stringify(dataToStore));

  return allFilteredClients;
}
