import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { CartProvider } from '../context/CartContext.jsx'
import { getAll } from '../data/db.js'
import Ofertas from './Ofertas.jsx'

describe('Ofertas', () => {
  beforeEach(() => localStorage.clear())

  it('muestra solo productos con precioOferta', () => {
    render(
      <MemoryRouter>
        <CartProvider>
          <Ofertas />
        </CartProvider>
      </MemoryRouter>
    )
    const esperados = getAll('productos').filter((p) => p.precioOferta !== null)
    expect(screen.getAllByText('Oferta').length).toBe(esperados.length)
  })
})