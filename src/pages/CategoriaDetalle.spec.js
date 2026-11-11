import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from '../context/CartContext.jsx'
import { getAll } from '../data/db.js'
import CategoriaDetalle from './CategoriaDetalle.jsx'

const montar = (id) =>
  render(
    <MemoryRouter initialEntries={[`/categorias/${id}`]}>
      <CartProvider>
        <Routes>
          <Route path="/categorias/:id" element={<CategoriaDetalle />} />
        </Routes>
      </CartProvider>
    </MemoryRouter>
  )

describe('CategoriaDetalle', () => {
  beforeEach(() => localStorage.clear())

  it('muestra solo los productos de la categoría', () => {
    montar(1)
    const esperados = getAll('productos').filter((p) => p.categoriaId === 1)
    expect(screen.getAllByText('Agregar al carrito').length).toBe(esperados.length)
  })

  it('muestra mensaje si la categoría no existe', () => {
    montar(999)
    expect(screen.getByText('Categoría no encontrada')).toBeTruthy()
  })
})