import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { CartProvider } from '../context/CartContext.jsx'
import Carrito from './Carrito.jsx'

const ITEM = { productoId: 1, nombre: 'PC Gamer Ryzen 5 RTX 4060', precio: 899990, imagen: '/img/productos/audifonos-hyperx.jpg', cantidad: 1 }

const montar = () =>
  render(
    <MemoryRouter>
      <CartProvider>
        <Carrito />
      </CartProvider>
    </MemoryRouter>
  )

describe('Carrito', () => {
  beforeEach(() => {
    localStorage.clear()
    localStorage.setItem('zthorken_carrito', JSON.stringify([ITEM]))
  })

  it('sumar cambia la cantidad en el estado', () => {
    montar()
    fireEvent.click(screen.getByLabelText('Aumentar PC Gamer Ryzen 5 RTX 4060'))
    const guardado = JSON.parse(localStorage.getItem('zthorken_carrito'))
    expect(guardado[0].cantidad).toBe(2)
  })

  it('quitar deja el carrito vacío', () => {
    montar()
    fireEvent.click(screen.getByText('Quitar'))
    expect(screen.getByText('Tu carrito está vacío.')).toBeTruthy()
  })

  it('vaciar carrito elimina todos los items', () => {
    montar()
    fireEvent.click(screen.getByText('Vaciar carrito'))
    expect(JSON.parse(localStorage.getItem('zthorken_carrito')).length).toBe(0)
  })
})