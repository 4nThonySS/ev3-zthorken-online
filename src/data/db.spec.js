import { getAll, getById, create, update, remove, resetDB } from './db.js'

describe('db', () => {
  beforeEach(() => resetDB())

  it('carga los datos iniciales', () => {
    expect(getAll('productos').length).toBeGreaterThan(0)
    expect(getById('usuarios', 1).rol).toBe('admin')
  })

  it('crea un registro con id nuevo', () => {
    const total = getAll('categorias').length
    const nueva = create('categorias', { nombre: 'Accesorios' })
    expect(nueva.id).toBe(total + 1)
    expect(getById('categorias', nueva.id).nombre).toBe('Accesorios')
  })

  it('actualiza un registro sin cambiar su id', () => {
    const editado = update('productos', 1, { precio: 1000, id: 99 })
    expect(editado.id).toBe(1)
    expect(getById('productos', 1).precio).toBe(1000)
  })

  it('elimina un registro', () => {
    expect(remove('blogs', 1)).toBeTrue()
    expect(getById('blogs', 1)).toBeNull()
    expect(remove('blogs', 1)).toBeFalse()
  })

  it('persiste en localStorage', () => {
    create('categorias', { nombre: 'Accesorios' })
    const guardado = JSON.parse(localStorage.getItem('zthorken-db-v2'))
    expect(guardado.categorias.some((c) => c.nombre === 'Accesorios')).toBeTrue()
  })

  it('agrega colecciones nuevas a datos guardados de antes', () => {
    localStorage.setItem('zthorken-db-v2', JSON.stringify({ productos: [] }))
    expect(getAll('mensajes')).toEqual([])
    expect(getAll('productos')).toEqual([])
  })

  it('lanza error con una colección que no existe', () => {
    expect(() => getAll('noExiste')).toThrowError(/no existe/)
  })
})
