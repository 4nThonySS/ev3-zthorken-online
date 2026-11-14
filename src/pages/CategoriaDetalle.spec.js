import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from '../context/CartContext.jsx'
import { backend, instalarBackend } from '../test/backendFalso.js'
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
  beforeEach(() => {
    localStorage.clear()
    instalarBackend()
  })

  it('muestra solo los productos de la categoría', async () => {
    montar(1)
    const esperados = backend.productos.filter((p) => p.categoriaId === 1)
    expect((await screen.findAllByText('Agregar al carrito')).length).toBe(esperados.length)
    expect(backend.peticiones).toContain('GET /productos?categoriaId=1')
  })

  it('muestra mensaje si la categoría no existe', async () => {
    montar(999)
    expect(await screen.findByText('Categoría no encontrada')).toBeTruthy()
  })
})
