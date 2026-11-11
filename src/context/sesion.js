import { createContext, useContext } from 'react'

export const SesionContext = createContext(null)

// Uso: const { usuario, esAdmin, login, registrar, actualizarPerfil, logout } = useSesion()
export function useSesion() {
  const sesion = useContext(SesionContext)
  if (!sesion) throw new Error('useSesion debe usarse dentro de <SesionProvider>')
  return sesion
}

// Devuelve true si la sesión es de un administrador (false si no hay sesión o proveedor)
export function useEsAdmin() {
  return useContext(SesionContext)?.usuario?.rol === 'admin'
}