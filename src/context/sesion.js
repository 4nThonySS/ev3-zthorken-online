import { createContext, useContext } from 'react'

export const SesionContext = createContext(null)

export function useSesion() {
  const sesion = useContext(SesionContext)
  if (!sesion) throw new Error('useSesion debe usarse dentro de <SesionProvider>')
  return sesion
}

export function useEsAdmin() {
  return useContext(SesionContext)?.usuario?.rol === 'ADMIN'
}
export const MARGEN_RENOVACION_MS = 5 * 60 * 1000
