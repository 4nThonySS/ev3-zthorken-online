export function formatearFecha(fecha) {
  return new Date(`${fecha.slice(0, 10)}T00:00:00`).toLocaleDateString('es-CL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function formatearPrecio(valor) {
  return `$${valor.toLocaleString('es-CL')}`
}

export function formatearPrecioCorto(valor) {
  if (valor >= 1000000) return `$${(valor / 1000000).toLocaleString('es-CL', { maximumFractionDigits: 1 })} M`
  if (valor >= 1000) return `$${Math.round(valor / 1000).toLocaleString('es-CL')} mil`
  return formatearPrecio(valor)
}

export function ultimosMeses(cantidad, hoy = new Date()) {
  return Array.from({ length: cantidad }, (_, i) => {
    const fecha = new Date(hoy.getFullYear(), hoy.getMonth() - (cantidad - 1 - i), 1)
    const clave = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`
    const mes = fecha.toLocaleDateString('es-CL', { month: 'short' }).replace('.', '')
    return { clave, etiqueta: `${mes} ${String(fecha.getFullYear()).slice(2)}` }
  })
}

export const img = (texto) => `https://placehold.co/400x300?text=${encodeURIComponent(texto)}`
