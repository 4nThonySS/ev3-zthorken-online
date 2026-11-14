import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { backend, iniciarSesion, instalarBackend } from '../test/backendFalso.js'
import PagoCorrecto from './PagoCorrecto.jsx'

const montar = (id, state) =>
  render(
    <MemoryRouter initialEntries={[{ pathname: `/pago-exitoso/${id}`, state }]}>
      <Routes>
        <Route path="/pago-exitoso/:id" element={<PagoCorrecto />} />
      </Routes>
    </MemoryRouter>
  )

describe('PagoCorrecto', () => {
  beforeEach(() => instalarBackend())

  it('muestra la boleta recibida desde el checkout sin pedirla al backend', () => {
    montar(1, { orden: backend.boletas[0] })
    expect(screen.getByText('Orden N° 1')).toBeTruthy()
    expect(screen.getByText('Fecha: 1 de octubre de 2026')).toBeTruthy()
    expect(screen.getByText('Imprimir boleta')).toBeTruthy()
    expect(backend.peticiones).toEqual([])
  })

  it('al recargar la página pide la boleta al backend', async () => {
    iniciarSesion('pedro@correo.cl')
    montar(1)
    expect(await screen.findByText('Orden N° 1')).toBeTruthy()
  })

  it('muestra mensaje si la orden no existe', async () => {
    montar(999)
    expect(await screen.findByText('Orden no encontrada')).toBeTruthy()
  })
})
