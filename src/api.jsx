import { useCallback, useEffect, useState } from 'react'

export const API_URL = import.meta.env?.VITE_API_URL ?? 'http://localhost:8080/api/v1'

export const CLAVE_SESION = 'zthorken-sesion'

export const EVENTO_SESION_EXPIRADA = 'zthorken-sesion-expirada'

export function leerSesion() {
  let sesion
  try {
    sesion = JSON.parse(localStorage.getItem(CLAVE_SESION))
  } catch {
    sesion = null
  }
  if (!sesion?.token || (sesion.expiraEn && sesion.expiraEn <= Date.now())) {
    localStorage.removeItem(CLAVE_SESION)
    return null
  }
  return sesion
}

function cerrarSesionExpirada() {
  localStorage.removeItem(CLAVE_SESION)
  window.dispatchEvent(new Event(EVENTO_SESION_EXPIRADA))
}

export async function api(ruta, { method = 'GET', body } = {}) {
  const headers = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  const token = leerSesion()?.token
  if (token) headers.Authorization = `Bearer ${token}`

  let respuesta
  try {
    respuesta = await fetch(API_URL + ruta, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) })
  } catch {
    throw Object.assign(new Error('No se pudo conectar con el servidor'), { status: 0, campos: {} })
  }

  const datos = respuesta.status === 204 ? null : await respuesta.json().catch(() => null)
  if (respuesta.status === 401 && token) {
    cerrarSesionExpirada()
    throw Object.assign(new Error('Tu sesión expiró. Vuelve a iniciar sesión'), { status: 401, campos: {} })
  }
  if (!respuesta.ok) {
    const error = new Error(datos?.mensaje ?? mensajePorEstado(respuesta.status))
    error.status = respuesta.status
    error.campos = datos?.campos ?? {}
    throw error
  }
  return datos
}

function mensajePorEstado(status) {
  if (status === 401) return 'Debes iniciar sesión'
  if (status === 403) return 'No tienes permiso para hacer esto'
  return 'Ocurrió un error en el servidor'
}

export function useApi(ruta) {
  const [estado, setEstado] = useState({ ruta: null, datos: null, error: null })

  const recargar = useCallback(() => {
    if (!ruta) return
    api(ruta)
      .then((datos) => setEstado({ ruta, datos, error: null }))
      .catch((error) => setEstado({ ruta, datos: null, error }))
  }, [ruta])

  useEffect(recargar, [recargar])

  const vigente = estado.ruta === ruta
  return { datos: vigente ? estado.datos : null, error: vigente ? estado.error : null, recargar }
}

export function Estado({ error }) {
  if (error) return <div className="alert alert-danger m-3" role="alert">{error.message}</div>
  return <p className="text-muted m-3">Cargando...</p>
}
