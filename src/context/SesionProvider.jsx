import { useState } from 'react'
import { SesionContext } from './sesion.js'
import { api, leerSesion, CLAVE_SESION } from '../api.jsx'

// La sesión ({ token, usuario }) viene del backend y se guarda en localStorage para no perderla al recargar
export function SesionProvider({ children }) {
  // ponytail: si el token vence (24 h) la sesión sigue en pantalla y el backend responde 401; basta con volver a entrar
  const [sesion, setSesion] = useState(leerSesion)
  const usuario = sesion?.usuario ?? null

  function guardar(nueva) {
    if (nueva) localStorage.setItem(CLAVE_SESION, JSON.stringify(nueva))
    else localStorage.removeItem(CLAVE_SESION)
    setSesion(nueva)
  }

  // Todas devuelven { ok: true } o { ok: false, error: 'mensaje' }
  async function intentar(accion) {
    try {
      await accion()
      return { ok: true }
    } catch (e) {
      return { ok: false, error: e.message }
    }
  }

  const login = (correo, password) =>
    intentar(async () => guardar(await api('/auth/login', { method: 'POST', body: { correo, password } })))

  // El backend crea siempre un CLIENTE y devuelve su token
  const registrar = (datos) =>
    intentar(async () => guardar(await api('/auth/register', { method: 'POST', body: datos })))

  // Se manda el perfil completo: lo que no viene en cambios se mantiene
  const actualizarPerfil = (cambios) =>
    intentar(async () => {
      const actualizado = await api('/auth/perfil', { method: 'PUT', body: { ...usuario, ...cambios } })
      guardar({ ...sesion, usuario: actualizado })
    })

  const logout = () => guardar(null)

  const valor = {
    usuario,
    esAdmin: usuario?.rol === 'ADMIN',
    esVendedor: usuario?.rol === 'VENDEDOR',
    login,
    registrar,
    actualizarPerfil,
    logout,
  }

  return <SesionContext.Provider value={valor}>{children}</SesionContext.Provider>
}
