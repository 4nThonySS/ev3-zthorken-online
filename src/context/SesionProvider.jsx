import { useState, useReducer } from 'react'
import { SesionContext } from './sesion.js'
import { getAll, getById, create, update } from '../data/db.js'

// Solo se guarda el id del usuario; sus datos se leen siempre desde db.js
const STORAGE_KEY = 'zthorken-sesion'

function leerSesion() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY))
  } catch {
    return null
  }
}

function sinPassword(usuario) {
  if (!usuario) return null
  const { password: _password, ...datos } = usuario
  return datos
}

function buscarPorCorreo(correo) {
  const normalizado = correo.trim().toLowerCase()
  return getAll('usuarios').find((u) => u.correo.toLowerCase() === normalizado)
}

export function SesionProvider({ children }) {
  const [usuarioId, setUsuarioId] = useState(leerSesion)
  // Fuerza un render cuando cambian los datos del usuario en db.js
  const [, refrescar] = useReducer((n) => n + 1, 0)
  const usuario = sinPassword(usuarioId ? getById('usuarios', usuarioId) : null)

  function iniciar(id) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(id))
    setUsuarioId(id)
  }

  // Devuelve { ok: true } o { ok: false, error: 'mensaje' }
  function login(correo, password) {
    const encontrado = buscarPorCorreo(correo)
    if (!encontrado || encontrado.password !== password) {
      return { ok: false, error: 'Correo o contraseña incorrectos' }
    }
    iniciar(encontrado.id)
    return { ok: true }
  }

  // Crea un usuario con rol cliente e inicia su sesión
  function registrar(datos) {
    if (buscarPorCorreo(datos.correo)) {
      return { ok: false, error: 'Ya existe una cuenta con ese correo' }
    }
    const nuevo = create('usuarios', {
      calle: '',
      departamento: '',
      region: '',
      comuna: '',
      ...datos,
      correo: datos.correo.trim().toLowerCase(),
      rol: 'cliente',
    })
    iniciar(nuevo.id)
    return { ok: true }
  }

  // Edita los datos del usuario con sesión iniciada
  function actualizarPerfil(cambios) {
    const otro = cambios.correo && buscarPorCorreo(cambios.correo)
    if (otro && otro.id !== usuarioId) {
      return { ok: false, error: 'Ya existe una cuenta con ese correo' }
    }
    update('usuarios', usuarioId, cambios.correo ? { ...cambios, correo: cambios.correo.trim().toLowerCase() } : cambios)
    refrescar()
    return { ok: true }
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY)
    setUsuarioId(null)
  }

  const valor = { usuario, esAdmin: usuario?.rol === 'admin', login, registrar, actualizarPerfil, logout }

  return <SesionContext.Provider value={valor}>{children}</SesionContext.Provider>
}
