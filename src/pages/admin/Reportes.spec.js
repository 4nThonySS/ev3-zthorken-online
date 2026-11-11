import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Reportes from './Reportes.jsx'
import { getAll, create, remove, resetDB } from '../../data/db.js'

function renderReportes() {
  return render(<MemoryRouter><Reportes /></MemoryRouter>)
}

// Valor de una tarjeta del resumen
function resumen(titulo) {
  return screen.getByRole('heading', { name: titulo }).nextElementSibling.textContent
}

// Celdas de la fila de una categoría en el reporte por categoría
function filaCategoria(nombre) {
  const tabla = screen.getByRole('table', { name: 'Reporte por categoría' })
  return [...within(tabla).getByText(nombre).closest('tr').children].map((td) => td.textContent)
}

describe('Reportes', () => {
  beforeEach(() => resetDB())

  it('muestra el resumen de ventas', () => {
    create('ordenes', { items: [{ productoId: 1, nombre: 'PC Gamer Ryzen 5 RTX 4060', precio: 899990, cantidad: 1 }], total: 899990 })
    renderReportes()
    expect(resumen('Órdenes')).toBe('2')
    expect(resumen('Total vendido')).toBe('$1.029.960')
    expect(resumen('Ticket promedio')).toBe('$514.980')
    expect(resumen('Unidades vendidas')).toBe('4')
  })

  it('muestra una fila por cada categoría', () => {
    renderReportes()
    const tabla = screen.getByRole('table', { name: 'Reporte por categoría' })
    expect(within(tabla).getAllByRole('row').length - 1).toBe(getAll('categorias').length)
  })

  it('calcula inventario y ventas por categoría', () => {
    renderReportes()
    // Periféricos: teclado (25 x 34.990) y mouse (4 x 49.990, crítico); se vendieron 2 teclados
    expect(filaCategoria('Periféricos')).toEqual(['Periféricos', '2', '29', '$1.074.710', '1', '2', '$69.980'])
  })

  it('muestra los productos más vendidos ordenados por unidades', () => {
    renderReportes()
    const tabla = screen.getByRole('table', { name: 'Productos más vendidos' })
    const filas = within(tabla).getAllByRole('row').slice(1)
    expect(filas.length).toBe(2)
    expect(filas[0].textContent).toContain('Teclado Mecánico Redragon Kumara')
    expect(filas[1].textContent).toContain('Audífonos HyperX Cloud II')
  })

  it('avisa si no hay ventas', () => {
    remove('ordenes', 1)
    renderReportes()
    expect(screen.getByText('Todavía no hay ventas.')).toBeTruthy()
    expect(resumen('Ticket promedio')).toBe('$0')
  })
})
