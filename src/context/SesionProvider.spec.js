import { renderHook, act } from '@testing-library/react'
import { SesionProvider } from './SesionProvider.jsx'
import { useSesion } from './sesion.js'
import { backend, instalarBackend } from '../test/backendFalso.js'

function renderSesion() {
  return renderHook(() => useSesion(), { wrapper: SesionProvider })
}

// Ejecuta una acción async de la sesión y devuelve su respuesta
async function hacer(accion) {
  let respuesta
  await act(async () => { respuesta = await accion() })
  return respuesta
}

describe('SesionProvider', () => {
  beforeEach(() => instalarBackend())

  it('parte sin sesión', () => {
    const { result } = renderSesion()
    expect(result.current.usuario).toBeNull()
    expect(result.current.esAdmin).toBeFalse()
  })

  it('inicia sesión contra el backend y guarda el token', async () => {
    const { result } = renderSesion()
    const respuesta = await hacer(() => result.current.login('ADMIN@zthorken.cl', 'admin123'))
    expect(respuesta.ok).toBeTrue()
    expect(result.current.usuario.nombre).toBe('Admin')
    expect(result.current.usuario.password).toBeUndefined()
    expect(result.current.esAdmin).toBeTrue()
    expect(JSON.parse(localStorage.getItem('zthorken-sesion')).token).toBe('token-1')
  })

  it('reconoce al vendedor', async () => {
    const { result } = renderSesion()
    await hacer(() => result.current.login('vendedor@zthorken.cl', 'vendedor123'))
    expect(result.current.esVendedor).toBeTrue()
    expect(result.current.esAdmin).toBeFalse()
  })

  it('rechaza una contraseña incorrecta con el mensaje del backend', async () => {
    const { result } = renderSesion()
    const respuesta = await hacer(() => result.current.login('admin@zthorken.cl', 'mala'))
    expect(respuesta).toEqual({ ok: false, error: 'Correo o contraseña incorrectos' })
    expect(result.current.usuario).toBeNull()
  })

  it('mantiene la sesión al recargar', async () => {
    const primera = renderSesion()
    await hacer(() => primera.result.current.login('pedro@correo.cl', 'pedro123'))
    primera.unmount()

    const { result } = renderSesion()
    expect(result.current.usuario.correo).toBe('pedro@correo.cl')
    expect(result.current.esAdmin).toBeFalse()
  })

  it('cierra sesión', async () => {
    const { result } = renderSesion()
    await hacer(() => result.current.login('pedro@correo.cl', 'pedro123'))
    act(() => result.current.logout())
    expect(result.current.usuario).toBeNull()
    expect(localStorage.getItem('zthorken-sesion')).toBeNull()
  })

  it('registra un cliente nuevo e inicia su sesión', async () => {
    const { result } = renderSesion()
    const respuesta = await hacer(() =>
      result.current.registrar({ nombre: 'Ana', apellidos: 'Soto', correo: 'Ana@Correo.cl', password: 'ana12345' }))
    expect(respuesta.ok).toBeTrue()
    expect(result.current.usuario.correo).toBe('ana@correo.cl')
    expect(result.current.usuario.rol).toBe('CLIENTE')
    expect(backend.usuarios.length).toBe(4)
  })

  it('no permite registrar un correo repetido', async () => {
    const { result } = renderSesion()
    const respuesta = await hacer(() =>
      result.current.registrar({ nombre: 'Otro', apellidos: 'Pedro', correo: 'pedro@correo.cl', password: '123456' }))
    expect(respuesta).toEqual({ ok: false, error: 'Ya existe un usuario con el correo pedro@correo.cl' })
    expect(backend.usuarios.length).toBe(3)
  })

  it('actualiza el perfil en el backend sin perder los demás datos', async () => {
    const { result } = renderSesion()
    await hacer(() => result.current.login('pedro@correo.cl', 'pedro123'))
    const respuesta = await hacer(() => result.current.actualizarPerfil({ nombre: 'Pedrito', correo: 'Pedrito@Correo.cl' }))
    expect(respuesta.ok).toBeTrue()
    expect(result.current.usuario.nombre).toBe('Pedrito')
    expect(result.current.usuario.correo).toBe('pedrito@correo.cl')
    expect(result.current.usuario.comuna).toBe('Cerrillos')
    expect(backend.peticiones).toContain('PUT /auth/perfil')
  })

  it('no permite cambiar el perfil a un correo de otra cuenta', async () => {
    const { result } = renderSesion()
    await hacer(() => result.current.login('pedro@correo.cl', 'pedro123'))
    const respuesta = await hacer(() => result.current.actualizarPerfil({ correo: 'admin@zthorken.cl' }))
    expect(respuesta).toEqual({ ok: false, error: 'Ya existe un usuario con el correo admin@zthorken.cl' })
    expect(result.current.usuario.correo).toBe('pedro@correo.cl')
  })
})
