import { renderHook, act } from '@testing-library/react'
import { SesionProvider } from './SesionProvider.jsx'
import { useSesion } from './sesion.js'
import { getAll, resetDB } from '../data/db.js'

function renderSesion() {
  return renderHook(() => useSesion(), { wrapper: SesionProvider })
}

describe('SesionProvider', () => {
  beforeEach(() => {
    resetDB()
    localStorage.removeItem('zthorken-sesion')
  })

  it('parte sin sesión', () => {
    const { result } = renderSesion()
    expect(result.current.usuario).toBeNull()
    expect(result.current.esAdmin).toBeFalse()
  })

  it('inicia sesión con datos correctos y no expone la contraseña', () => {
    const { result } = renderSesion()
    let respuesta
    act(() => { respuesta = result.current.login('ADMIN@zthorken.cl ', 'admin123') })
    expect(respuesta.ok).toBeTrue()
    expect(result.current.usuario.nombre).toBe('Admin')
    expect(result.current.usuario.password).toBeUndefined()
    expect(result.current.esAdmin).toBeTrue()
  })

  it('rechaza una contraseña incorrecta', () => {
    const { result } = renderSesion()
    let respuesta
    act(() => { respuesta = result.current.login('admin@zthorken.cl', 'mala') })
    expect(respuesta).toEqual({ ok: false, error: 'Correo o contraseña incorrectos' })
    expect(result.current.usuario).toBeNull()
  })

  it('mantiene la sesión al recargar', () => {
    const primera = renderSesion()
    act(() => { primera.result.current.login('pedro@correo.cl', 'pedro123') })
    primera.unmount()

    const { result } = renderSesion()
    expect(result.current.usuario.correo).toBe('pedro@correo.cl')
    expect(result.current.esAdmin).toBeFalse()
  })

  it('cierra sesión', () => {
    const { result } = renderSesion()
    act(() => { result.current.login('pedro@correo.cl', 'pedro123') })
    act(() => { result.current.logout() })
    expect(result.current.usuario).toBeNull()
    expect(localStorage.getItem('zthorken-sesion')).toBeNull()
  })

  it('registra un cliente nuevo e inicia su sesión', () => {
    const { result } = renderSesion()
    let respuesta
    act(() => {
      respuesta = result.current.registrar({ nombre: 'Ana', apellidos: 'Soto', correo: 'Ana@Correo.cl', password: 'ana12345', rol: 'admin' })
    })
    expect(respuesta.ok).toBeTrue()
    expect(result.current.usuario.correo).toBe('ana@correo.cl')
    expect(result.current.usuario.rol).toBe('cliente')
    expect(getAll('usuarios').length).toBe(3)
  })

  it('no permite registrar un correo repetido', () => {
    const { result } = renderSesion()
    let respuesta
    act(() => {
      respuesta = result.current.registrar({ nombre: 'Otro', apellidos: 'Pedro', correo: 'pedro@correo.cl', password: '123456' })
    })
    expect(respuesta).toEqual({ ok: false, error: 'Ya existe una cuenta con ese correo' })
    expect(getAll('usuarios').length).toBe(2)
  })

  it('actualiza el perfil y refleja los cambios', () => {
    const { result } = renderSesion()
    act(() => { result.current.login('pedro@correo.cl', 'pedro123') })
    let respuesta
    act(() => { respuesta = result.current.actualizarPerfil({ nombre: 'Pedrito', correo: 'Pedrito@Correo.cl' }) })
    expect(respuesta.ok).toBeTrue()
    expect(result.current.usuario.nombre).toBe('Pedrito')
    expect(result.current.usuario.correo).toBe('pedrito@correo.cl')
  })

  it('no permite cambiar el perfil a un correo de otra cuenta', () => {
    const { result } = renderSesion()
    act(() => { result.current.login('pedro@correo.cl', 'pedro123') })
    let respuesta
    act(() => { respuesta = result.current.actualizarPerfil({ correo: 'admin@zthorken.cl' }) })
    expect(respuesta).toEqual({ ok: false, error: 'Ya existe una cuenta con ese correo' })
    expect(result.current.usuario.correo).toBe('pedro@correo.cl')
  })
})
