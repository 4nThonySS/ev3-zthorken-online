import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from '../context/CartContext.jsx'
import { instalarBackend } from '../test/backendFalso.js'
import ProductoDetalle from './ProductoDetalle.jsx'

const montar = (id) =>
  render(
    <MemoryRouter initialEntries={[`/productos/${id}`]}>
      <CartProvider>
        <Routes>
          <Route path="/productos/:id" element={<ProductoDetalle />} />
        </Routes>
      </CartProvider>
    </MemoryRouter>
  )

describe('ProductoDetalle', () => {
  beforeEach(() => {
    localStorage.clear()
    instalarBackend()
  })

  it('muestra los datos del producto', async () => {
    montar(1)
    expect(await screen.findByText('PC Gamer Ryzen 5 RTX 4060')).toBeTruthy()
    expect(screen.getByText('Stock disponible: 8')).toBeTruthy()
  })

  it('muestra mensaje si el producto no existe', async () => {
    montar(999)
    expect(await screen.findByText('Producto no encontrado')).toBeTruthy()
  })

  it('agrega al carrito la cantidad elegida', async () => {
    montar(1)
    fireEvent.change(await screen.findByLabelText('Cantidad'), { target: { value: '3' } })
    fireEvent.click(screen.getByText('Agregar al carrito'))
    const guardado = JSON.parse(localStorage.getItem('zthorken_carrito'))
    expect(guardado[0].cantidad).toBe(3)
  })
})
