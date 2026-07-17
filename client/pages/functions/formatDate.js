export  function formatDate (date)  {
    let newDate = new Date(date)
  if (isNaN(newDate)) {
    return 'Fecha inválida'
  }
  return newDate.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'UTC',
  })
}