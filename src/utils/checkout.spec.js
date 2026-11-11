import { getById, getAll } from '../data/db.js'
import { validarCheckout, procesarPago } from './checkout.js'

const completo = {
  nombre: 'Ana', apellidos: 'Soto', correo: 'ana@correo.cl',
  calle: 'Calle 1', departamento: '', region: 'Región de Coquimbo', comuna: 'Ovalle', indicaciones: '',
}
const cliente = { nombre: 'Ana', apellidos: 'Soto', correo: 'ana@correo.cl' }
const direccion = { calle: 'Calle 1', departamento: '', region: 'Región de Coquimbo', comuna: 'Ovalle', indicaciones: '' }

describe('validarCheckout', () => {
  it('no da errores con datos completos', () => {
    expect(Object.keys(validarCheckout(completo)).length).toBe(0)
  })

  it('detecta campos vacíos y correo inválido', () => {
    const e = validarCheckout({ ...completo, nombre: '', correo: 'malo', comuna: '' })
    expect(e.nombre).toBeTruthy()
    expect(e.correo).toBeTruthy()
    expect(e.comuna).toBeTruthy()
  })
})

describe('procesarPago', () => {
  beforeEach(() => localStorage.clear())

  it('crea la orden y descuenta el stock', () => {
    const antes = getById('productos', 5).stock
    const items = [{ productoId: 5, nombre: 'Audífonos', precio: 59990, cantidad: 2 }]
    const r = procesarPago({ items, total: 119980, cliente, direccion, usuarioId: null })
    expect(r.ok).toBe(true)
    expect(getById('productos', 5).stock).toBe(antes - 2)
    expect(getAll('ordenes').length).toBe(2)
  })

  it('rechaza si la cantidad supera el stock', () => {
    const items = [{ productoId: 4, nombre: 'ASUS TUF', precio: 949990, cantidad: 3 }]
    const r = procesarPago({ items, total: 2849970, cliente, direccion, usuarioId: null })
    expect(r.ok).toBe(false)
    expect(getById('productos', 4).stock).toBe(2)
    expect(getAll('ordenes').length).toBe(1)
  })

  it('rechaza un carrito vacío', () => {
    const r = procesarPago({ items: [], total: 0, cliente, direccion, usuarioId: null })
    expect(r.ok).toBe(false)
  })
})