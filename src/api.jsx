import { useCallback, useEffect, useState } from 'react'

// URL del backend; se cambia con VITE_API_URL en un archivo .env
export const API_URL = import.meta.env?.VITE_API_URL ?? 'http://localhost:8080/api/v1'

// La sesión ({ token, usuario }) se guarda aquí para mandar el token en cada petición
export const CLAVE_SESION = 'zthorken-sesion'

export function leerSesion() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_SESION))
  } catch {
    return null
  }
}

// Llama al backend y devuelve el JSON. Si responde con error lanza un Error con el mensaje del backend
// (y los errores por campo en error.campos, si los hay).
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

// Carga una ruta al montar el componente: const { datos, error, recargar } = useApi('/productos')
// datos es null mientras carga. Con ruta null no hace nada (útil si la ruta depende de otro dato).
export function useApi(ruta) {
  const [estado, setEstado] = useState({ ruta: null, datos: null, error: null })

  const recargar = useCallback(() => {
    if (!ruta) return
    api(ruta)
      .then((datos) => setEstado({ ruta, datos, error: null }))
      .catch((error) => setEstado({ ruta, datos: null, error }))
  }, [ruta])

  useEffect(recargar, [recargar])

  // Si cambió la ruta, los datos anteriores ya no sirven
  const vigente = estado.ruta === ruta
  return { datos: vigente ? estado.datos : null, error: vigente ? estado.error : null, recargar }
}

// Muestra "Cargando..." o el error mientras no hay datos. Uso: if (!datos) return <Estado error={error} />
export function Estado({ error }) {
  if (error) return <div className="alert alert-danger m-3" role="alert">{error.message}</div>
  return <p className="text-muted m-3">Cargando...</p>
}
