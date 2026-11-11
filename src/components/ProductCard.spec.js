import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { CartProvider } from '../context/CartContext.jsx'
import ProductCard from './ProductCard.jsx'

const base = { id: 1, nombre: 'Mouse Gamer', precio: 20000, precioOferta: null, stock: 5, imagen: '/img/productos/audifonos-hyperx.jpg' }

const montar = (producto) =>
  render(
    <MemoryRouter>
      <CartProvider>
        <ProductCard producto={producto} />
      </CartProvider>
    </MemoryRouter>
  )

describe('ProductCard', () => {
  beforeEach(() => localStorage.clear())

  it('muestra el nombre y el precio recibidos por props', () => {
    montar(base)
    expect(screen.getByText('Mouse Gamer')).toBeTruthy()
    expect(screen.getByText('$20.000')).toBeTruthy()
  })

  it('muestra la etiqueta Oferta cuando hay precioOferta', () => {
    montar({ ...base, precioOferta: 15000 })
    expect(screen.getByText('Oferta')).toBeTruthy()
    expect(screen.getByText('$15.000')).toBeTruthy()
  })

  it('agrega al carrito al hacer clic', () => {
    montar(base)
    fireEvent.click(screen.getByText('Agregar al carrito'))
    const guardado = JSON.parse(localStorage.getItem('zthorken_carrito'))
    expect(guardado.length).toBe(1)
    expect(guardado[0].productoId).toBe(1)
  })
})