import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import ProductoDetalle from './ProductoDetalle.jsx'
import { getById, resetDB } from '../../data/db.js'

function renderDetalle(id) {
  return render(
    <MemoryRouter initialEntries={[`/admin/productos/${id}`]}>
      <Routes>
        <Route path="/admin/productos/:id" element={<ProductoDetalle />} />
        <Route path="/admin/productos" element={<p>Listado de productos</p>} />
      </Routes>
    </MemoryRouter>,
  )
}

// Valor que aparece debajo de un título de la ficha
function valor(titulo) {
  return screen.getByText(titulo).nextElementSibling.textContent
}

describe('ProductoDetalle', () => {
  beforeEach(() => resetDB())

  it('muestra los datos del producto', () => {
    renderDetalle(5)
    expect(screen.getByRole('heading', { name: 'Audífonos HyperX Cloud II' })).toBeTruthy()
    expect(valor('Categoría')).toBe('Audio')
    expect(valor('Precio')).toBe('$79.990')
    expect(valor('Precio oferta')).toBe('$59.990')
    expect(valor('Stock')).toBe('20')
  })

  it('muestra las ventas del producto según las órdenes', () => {
    renderDetalle(7)
    expect(valor('Unidades vendidas')).toBe('2')
    expect(valor('Total vendido')).toBe('$69.980')
  })

  it('avisa si el producto está en stock crítico', () => {
    renderDetalle(4)
    expect(screen.getByRole('alert').textContent).toBe('Este producto está en stock crítico.')
  })

  it('no muestra el aviso si el stock está bien', () => {
    renderDetalle(5)
    expect(screen.queryByRole('alert')).toBeNull()
  })

  it('tiene un enlace para editar', () => {
    renderDetalle(5)
    expect(screen.getByRole('link', { name: 'Editar' }).getAttribute('href')).toBe('/admin/productos/5/editar')
  })

  it('elimina el producto y vuelve al listado', () => {
    spyOn(window, 'confirm').and.returnValue(true)
    renderDetalle(5)
    fireEvent.click(screen.getByRole('button', { name: 'Eliminar Audífonos HyperX Cloud II' }))
    expect(getById('productos', 5)).toBeNull()
    expect(screen.getByText('Listado de productos')).toBeTruthy()
  })

  it('avisa si el producto no existe', () => {
    renderDetalle(999)
    expect(screen.getByText('El producto no existe.')).toBeTruthy()
  })
})
