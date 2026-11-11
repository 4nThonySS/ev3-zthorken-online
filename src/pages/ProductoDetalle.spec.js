import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from '../context/CartContext.jsx'
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
  beforeEach(() => localStorage.clear())

  it('muestra los datos del producto', () => {
    montar(1)
    expect(screen.getByText('PC Gamer Ryzen 5 RTX 4060')).toBeTruthy()
  })

  it('muestra mensaje si el producto no existe', () => {
    montar(999)
    expect(screen.getByText('Producto no encontrado')).toBeTruthy()
  })

  it('agrega al carrito la cantidad elegida', () => {
    montar(1)
    fireEvent.change(screen.getByLabelText('Cantidad'), { target: { value: '3' } })
    fireEvent.click(screen.getByText('Agregar al carrito'))
    const guardado = JSON.parse(localStorage.getItem('zthorken_carrito'))
    expect(guardado[0].cantidad).toBe(3)
  })
})