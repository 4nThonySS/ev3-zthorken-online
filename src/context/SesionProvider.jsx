import { useCallback, useEffect, useState } from 'react'
import { SesionContext, MARGEN_RENOVACION_MS } from './sesion.js'
import { api, leerSesion, CLAVE_SESION, EVENTO_SESION_EXPIRADA } from '../api.jsx'

export function SesionProvider({ children }) {
  const [sesion, setSesion] = useState(leerSesion)
  const [expirada, setExpirada] = useState(false)
  const usuario = sesion?.usuario ?? null

  const guardar = useCallback((nueva) => {
    if (nueva) localStorage.setItem(CLAVE_SESION, JSON.stringify(nueva))
    else localStorage.removeItem(CLAVE_SESION)
    setSesion(nueva)
  }, [])

  useEffect(() => {
    function alExpirar() {
      setSesion(null)
      setExpirada(true)
    }
    function alCambiarEnOtraPestana(e) {
      if (e.key === CLAVE_SESION || e.key === null) setSesion(leerSesion())
    }
    window.addEventListener(EVENTO_SESION_EXPIRADA, alExpirar)
    window.addEventListener('storage', alCambiarEnOtraPestana)
    return () => {
      window.removeEventListener(EVENTO_SESION_EXPIRADA, alExpirar)
      window.removeEventListener('storage', alCambiarEnOtraPestana)
    }
  }, [])

  const token = sesion?.token
  const expiraEn = sesion?.expiraEn
  useEffect(() => {
    if (!token || !expiraEn) return
    const espera = Math.max(expiraEn - Date.now() - MARGEN_RENOVACION_MS, 0)
    const renovar = setTimeout(() => {
      api('/auth/refresh', { method: 'POST' })
        .then(guardar)
        .catch(() => {})
    }, espera)
    const vencer = setTimeout(() => {
      localStorage.removeItem(CLAVE_SESION)
      setSesion(null)
      setExpirada(true)
    }, Math.max(expiraEn - Date.now(), 0))
    return () => {
      clearTimeout(renovar)
      clearTimeout(vencer)
    }
  }, [token, expiraEn, guardar])

  async function intentar(accion) {
    try {
      await accion()
      setExpirada(false)
      return { ok: true }
    } catch (e) {
      return { ok: false, error: e.message }
    }
  }

  const login = (correo, password) =>
    intentar(async () => guardar(await api('/auth/login', { method: 'POST', body: { correo, password } })))

  const registrar = (datos) =>
    intentar(async () => guardar(await api('/auth/register', { method: 'POST', body: datos })))

  const actualizarPerfil = (cambios) =>
    intentar(async () => {
      const actualizado = await api('/auth/perfil', { method: 'PUT', body: { ...usuario, ...cambios } })
      guardar({ ...sesion, usuario: actualizado })
    })

  const logout = () => {
    setExpirada(false)
    guardar(null)
  }

  const valor = {
    usuario,
    expirada,
    esAdmin: usuario?.rol === 'ADMIN',
    esVendedor: usuario?.rol === 'VENDEDOR',
    login,
    registrar,
    actualizarPerfil,
    logout,
  }

  return <SesionContext.Provider value={valor}>{children}</SesionContext.Provider>
}
