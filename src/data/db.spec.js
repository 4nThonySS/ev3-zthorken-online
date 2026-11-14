import { getAll, getById, create, update, remove, resetDB } from './db.js'

describe('db', () => {
  beforeEach(() => resetDB())

  it('carga los datos iniciales', () => {
    expect(getAll('blogs').length).toBe(2)
    expect(getAll('mensajes')).toEqual([])
  })

  it('crea un registro con id nuevo', () => {
    const nuevo = create('mensajes', { nombre: 'Ana' })
    expect(nuevo.id).toBe(1)
    expect(getById('mensajes', nuevo.id).nombre).toBe('Ana')
  })

  it('actualiza un registro sin cambiar su id', () => {
    const editado = update('blogs', 1, { titulo: 'Nuevo', id: 99 })
    expect(editado.id).toBe(1)
    expect(getById('blogs', 1).titulo).toBe('Nuevo')
  })

  it('elimina un registro', () => {
    expect(remove('blogs', 1)).toBeTrue()
    expect(getById('blogs', 1)).toBeNull()
    expect(remove('blogs', 1)).toBeFalse()
  })

  it('persiste en localStorage', () => {
    create('mensajes', { nombre: 'Ana' })
    const guardado = JSON.parse(localStorage.getItem('zthorken-db-v3'))
    expect(guardado.mensajes.some((m) => m.nombre === 'Ana')).toBeTrue()
  })

  it('agrega colecciones nuevas a datos guardados de antes', () => {
    localStorage.setItem('zthorken-db-v3', JSON.stringify({ blogs: [] }))
    expect(getAll('mensajes')).toEqual([])
    expect(getAll('blogs')).toEqual([])
  })

  it('lanza error con una colección que no existe (productos ahora vienen del backend)', () => {
    expect(() => getAll('productos')).toThrowError(/no existe/)
  })
})
