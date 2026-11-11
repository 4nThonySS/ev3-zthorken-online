import { getById, create, update } from '../data/db.js'

export function validarCheckout(d) {
  const errores = {}
  if (!d.nombre.trim()) errores.nombre = 'Ingresa tu nombre'
  if (!d.apellidos.trim()) errores.apellidos = 'Ingresa tus apellidos'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.correo.trim())) errores.correo = 'Ingresa un correo válido'
  if (!d.calle.trim()) errores.calle = 'Ingresa tu calle y número'
  if (!d.region) errores.region = 'Selecciona una región'
  if (!d.comuna) errores.comuna = 'Selecciona una comuna'
  return errores
}

// Devuelve { ok: true, orden } o { ok: false, error }
export function procesarPago({ items, total, cliente, direccion, usuarioId }) {
  if (items.length === 0) return { ok: false, error: 'Tu carrito está vacío' }

  for (const i of items) {
    const producto = getById('productos', i.productoId)
    if (!producto) return { ok: false, error: `El producto "${i.nombre}" ya no existe` }
    if (i.cantidad > producto.stock) {
      return { ok: false, error: `Stock insuficiente de "${i.nombre}" (disponible: ${producto.stock})` }
    }
  }

  const orden = create('ordenes', {
    usuarioId: usuarioId ?? null,
    fecha: new Date().toISOString().slice(0, 10),
    estado: 'pagada',
    items: items.map(({ productoId, nombre, precio, cantidad }) => ({ productoId, nombre, precio, cantidad })),
    total,
    cliente,
    direccion,
  })

  items.forEach((i) => {
    const producto = getById('productos', i.productoId)
    update('productos', producto.id, { stock: producto.stock - i.cantidad })
  })

  return { ok: true, orden }
}