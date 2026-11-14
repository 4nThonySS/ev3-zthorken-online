import { backend, instalarBackend } from '../test/backendFalso.js'
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
  beforeEach(() => instalarBackend())

  it('envía solo producto y cantidad; el backend calcula el total', async () => {
    const items = [{ productoId: 5, nombre: 'Audífonos', precio: 1, cantidad: 2 }]
    const r = await procesarPago({ items, cliente, direccion })
    expect(r.ok).toBe(true)
    expect(r.orden.total).toBe(2 * 59990)
    expect(JSON.parse(window.fetch.calls.mostRecent().args[1].body).items).toEqual([{ productoId: 5, cantidad: 2 }])
    expect(backend.boletas.length).toBe(2)
  })

  it('devuelve el mensaje del backend si la cantidad supera el stock', async () => {
    const items = [{ productoId: 4, nombre: 'ASUS TUF', precio: 949990, cantidad: 3 }]
    const r = await procesarPago({ items, cliente, direccion })
    expect(r).toEqual({ ok: false, error: 'Stock insuficiente para Notebook ASUS TUF Gaming F15: disponible 2, solicitado 3' })
    expect(backend.productos[3].stock).toBe(2)
  })

  it('rechaza un carrito vacío sin llamar al backend', async () => {
    const r = await procesarPago({ items: [], cliente, direccion })
    expect(r.ok).toBe(false)
    expect(backend.peticiones).toEqual([])
  })
})