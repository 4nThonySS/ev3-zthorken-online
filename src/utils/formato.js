// '2026-10-05' o '2026-10-05T14:30:00' (backend) -> '5 de octubre de 2026'
// Se usa la hora local 00:00 para que la fecha no se corra un día por la zona horaria
export function formatearFecha(fecha) {
  return new Date(`${fecha.slice(0, 10)}T00:00:00`).toLocaleDateString('es-CL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

// 129970 -> '$129.970'
export function formatearPrecio(valor) {
  return `$${valor.toLocaleString('es-CL')}`
}

// Imagen provisoria para productos y categorías nuevos sin foto
export const img = (texto) => `https://placehold.co/400x300?text=${encodeURIComponent(texto)}`
