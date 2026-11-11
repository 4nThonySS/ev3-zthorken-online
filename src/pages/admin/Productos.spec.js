import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Productos from './Productos.jsx'
import { getAll, getById, resetDB } from '../../data/db.js'

function renderProductos(props) {
  return render(<MemoryRouter><Productos {...props} /></MemoryRouter>)
}

// Filas del cuerpo de la tabla
function filas() {
  return screen.getAllByRole('row').slice(1)
}

describe('Admin Productos', () => {
  beforeEach(() => resetDB())

  it('renderiza todos los productos en la tabla', () => {
    renderProductos()
    expect(filas().length).toBe(getAll('productos').length)
    for (const p of getAll('productos')) {
      expect(screen.getByText(p.nombre)).toBeTruthy()
    }
  })

  it('muestra precio, oferta y categoría', () => {
    renderProductos()
    const fila = screen.getByText('Audífonos HyperX Cloud II').closest('tr')
    expect(fila.textContent).toContain('Audio')
    expect(fila.textContent).toContain('$79.990')
    expect(fila.textContent).toContain('$59.990')
  })

  it('marca los productos con stock crítico', () => {
    renderProductos()
    expect(screen.getAllByText('Crítico').length).toBe(3)
  })

  it('con soloCriticos muestra solo los de stock crítico', () => {
    renderProductos({ soloCriticos: true })
    expect(screen.getByRole('heading', { name: 'Productos críticos' })).toBeTruthy()
    expect(filas().length).toBe(3)
    expect(screen.queryByText('PC Gamer Ryzen 5 RTX 4060')).toBeNull()
  })

  it('elimina un producto al confirmar', () => {
    spyOn(window, 'confirm').and.returnValue(true)
    renderProductos()
    fireEvent.click(screen.getByRole('button', { name: 'Eliminar SSD Kingston NV2 1 TB' }))
    expect(getById('productos', 12)).toBeNull()
    expect(screen.queryByText('SSD Kingston NV2 1 TB')).toBeNull()
    expect(filas().length).toBe(11)
  })

  it('no elimina si se cancela', () => {
    spyOn(window, 'confirm').and.returnValue(false)
    renderProductos()
    fireEvent.click(screen.getByRole('button', { name: 'Eliminar SSD Kingston NV2 1 TB' }))
    expect(getById('productos', 12)).not.toBeNull()
  })

  it('tiene enlaces para ver y editar cada producto', () => {
    renderProductos()
    expect(screen.getByRole('link', { name: 'Ver SSD Kingston NV2 1 TB' }).getAttribute('href')).toBe('/admin/productos/12')
    expect(screen.getByRole('link', { name: 'Editar SSD Kingston NV2 1 TB' }).getAttribute('href')).toBe('/admin/productos/12/editar')
  })

  it('muestra la imagen de cada producto', () => {
    renderProductos()
    const imagenes = screen.getAllByRole('row').slice(1).map((fila) => fila.querySelector('img').getAttribute('src'))
    expect(imagenes).toEqual(getAll('productos').map((p) => p.imagen))
  })
})
