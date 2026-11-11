// '2026-10-05' -> '5 de octubre de 2026'
// Se agrega la hora para que la fecha no se corra un día por la zona horaria
export function formatearFecha(fecha) {
  return new Date(`${fecha}T00:00:00`).toLocaleDateString('es-CL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

// 129970 -> '$129.970'
export function formatearPrecio(valor) {
  return `$${valor.toLocaleString('es-CL')}`
}
