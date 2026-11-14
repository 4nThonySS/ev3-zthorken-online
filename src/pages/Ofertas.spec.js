import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { CartProvider } from '../context/CartContext.jsx'
import { backend, instalarBackend } from '../test/backendFalso.js'
import Ofertas from './Ofertas.jsx'

describe('Ofertas', () => {
  beforeEach(() => {
    localStorage.clear()
    instalarBackend()
  })

  it('muestra solo productos con precioOferta', async () => {
    render(
      <MemoryRouter>
        <CartProvider>
          <Ofertas />
        </CartProvider>
      </MemoryRouter>
    )
    const esperados = backend.productos.filter((p) => p.precioOferta !== null)
    expect((await screen.findAllByText('Oferta')).length).toBe(esperados.length)
  })
})
