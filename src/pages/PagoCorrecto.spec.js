import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import PagoCorrecto from './PagoCorrecto.jsx'

const montar = (id) =>
  render(
    <MemoryRouter initialEntries={[`/pago-exitoso/${id}`]}>
      <Routes>
        <Route path="/pago-exitoso/:id" element={<PagoCorrecto />} />
      </Routes>
    </MemoryRouter>
  )

describe('PagoCorrecto', () => {
  beforeEach(() => localStorage.clear())

  it('muestra la boleta con el número de orden', () => {
    montar(1)
    expect(screen.getByText('Orden N° 1')).toBeTruthy()
    expect(screen.getByText('Imprimir boleta')).toBeTruthy()
  })

  it('muestra mensaje si la orden no existe', () => {
    montar(999)
    expect(screen.getByText('Orden no encontrada')).toBeTruthy()
  })
})