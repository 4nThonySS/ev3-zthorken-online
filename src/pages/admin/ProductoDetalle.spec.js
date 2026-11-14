import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import ProductoDetalle from './ProductoDetalle.jsx'
import { SesionContext } from '../../context/sesion.js'
import { backend, instalarBackend } from '../../test/backendFalso.js'

function renderDetalle(id, rol = 'ADMIN') {
  return render(
    <MemoryRouter initialEntries={[`/admin/productos/${id}`]}>
      <SesionContext.Provider value={{ usuario: { id: 1, rol } }}>
        <Routes>
          <Route path="/admin/productos/:id" element={<ProductoDetalle />} />
          <Route path="/admin/productos" element={<p>Listado de productos</p>} />
        </Routes>
      </SesionContext.Provider>
    </MemoryRouter>,
  )
}

// Valor que aparece debajo de un título de la ficha, cuando ya cargó
async function valor(titulo) {
  return (await screen.findByText(titulo)).nextElementSibling.textContent
}

describe('ProductoDetalle', () => {
  beforeEach(() => instalarBackend())

  it('muestra los datos del producto', async () => {
    renderDetalle(5)
    expect(await screen.findByRole('heading', { name: 'Audífonos HyperX Cloud II' })).toBeTruthy()
    expect(await valor('Categoría')).toBe('Audio')
    expect(await valor('Precio')).toBe('$79.990')
    expect(await valor('Precio oferta')).toBe('$59.990')
    expect(await valor('Stock')).toBe('20')
  })

  it('muestra las ventas del producto según las boletas', async () => {
    renderDetalle(7)
    expect(await valor('Unidades vendidas')).toBe('2')
    expect(await valor('Total vendido')).toBe('$69.980')
  })

  it('avisa si el producto está en stock crítico', async () => {
    renderDetalle(4)
    expect((await screen.findByRole('alert')).textContent).toBe('Este producto está en stock crítico.')
  })

  it('no muestra el aviso si el stock está bien', async () => {
    renderDetalle(5)
    await screen.findByRole('heading', { name: 'Audífonos HyperX Cloud II' })
    expect(screen.queryByRole('alert')).toBeNull()
  })

  it('tiene un enlace para editar', async () => {
    renderDetalle(5)
    expect((await screen.findByRole('link', { name: 'Editar' })).getAttribute('href')).toBe('/admin/productos/5/editar')
  })

  it('elimina el producto y vuelve al listado', async () => {
    spyOn(window, 'confirm').and.returnValue(true)
    renderDetalle(5)
    fireEvent.click(await screen.findByRole('button', { name: 'Eliminar Audífonos HyperX Cloud II' }))
    expect(await screen.findByText('Listado de productos')).toBeTruthy()
    expect(backend.productos.find((p) => p.id === 5)).toBeUndefined()
  })

  it('el vendedor ve la ficha pero no puede editar ni eliminar', async () => {
    renderDetalle(5, 'VENDEDOR')
    await screen.findByRole('heading', { name: 'Audífonos HyperX Cloud II' })
    expect(screen.queryByRole('link', { name: 'Editar' })).toBeNull()
    expect(screen.queryByRole('button', { name: /Eliminar/ })).toBeNull()
  })

  it('avisa si el producto no existe', async () => {
    renderDetalle(999)
    expect(await screen.findByText('El producto no existe.')).toBeTruthy()
  })
})
