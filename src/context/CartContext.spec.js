import { createElement } from 'react'
import { renderHook, act } from '@testing-library/react'
import { CartProvider, useCart } from './CartContext.jsx'

const wrapper = ({ children }) => createElement(CartProvider, null, children)
const producto = { id: 1, nombre: 'Mouse', precio: 10000, precioOferta: null, imagen: '/img/productos/audifonos-hyperx.jpg' }

describe('CartContext', () => {
  beforeEach(() => localStorage.clear())

  it('agrega un producto y calcula el total', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    act(() => result.current.agregar(producto, 2))
    expect(result.current.items.length).toBe(1)
    expect(result.current.total).toBe(20000)
  })

  it('quita un producto', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    act(() => result.current.agregar(producto))
    act(() => result.current.quitar(1))
    expect(result.current.items.length).toBe(0)
  })

  it('usa precioOferta cuando existe', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    act(() => result.current.agregar({ ...producto, precioOferta: 8000 }))
    expect(result.current.total).toBe(8000)
  })
})