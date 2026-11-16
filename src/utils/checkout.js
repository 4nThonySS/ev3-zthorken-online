import { api } from '../api.jsx'

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

export async function procesarPago({ items, cliente, direccion }) {
  if (items.length === 0) return { ok: false, error: 'Tu carrito está vacío' }
  try {
    const orden = await api('/boletas', {
      method: 'POST',
      body: { cliente, direccion, items: items.map(({ productoId, cantidad }) => ({ productoId, cantidad })) },
    })
    return { ok: true, orden }
  } catch (e) {
    return { ok: false, error: e.message }
  }
}