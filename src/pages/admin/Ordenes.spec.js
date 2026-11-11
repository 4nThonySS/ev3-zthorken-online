import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Ordenes from './Ordenes.jsx'
import { getAll, create, resetDB } from '../../data/db.js'

function renderOrdenes() {
  return render(<MemoryRouter><Ordenes /></MemoryRouter>)
}

function crearOrden(fecha) {
  return create('ordenes', {
    usuarioId: null,
    fecha,
    estado: 'pagada',
    items: [{ productoId: 1, nombre: 'PC', precio: 1000, cantidad: 1 }],
    total: 1000,
    cliente: { nombre: 'Ana', apellidos: 'Soto', correo: 'ana@correo.cl' },
    direccion: { calle: 'Calle 1', departamento: '', region: 'Valparaíso', comuna: 'Viña del Mar', indicaciones: '' },
  })
}

describe('Admin Ordenes', () => {
  beforeEach(() => resetDB())

  it('renderiza todas las órdenes en la tabla', () => {
    crearOrden('2026-10-10')
    renderOrdenes()
    expect(screen.getAllByRole('row').length - 1).toBe(getAll('ordenes').length)
  })

  it('muestra cliente, cantidad de productos y total', () => {
    renderOrdenes()
    const fila = screen.getAllByRole('row')[1]
    expect(fila.textContent).toContain('Pedro Pérez')
    expect(fila.textContent).toContain('pedro@correo.cl')
    expect(fila.children[3].textContent).toBe('3')
    expect(fila.textContent).toContain('$129.970')
  })

  it('muestra primero las más recientes', () => {
    crearOrden('2026-10-10')
    renderOrdenes()
    expect(screen.getAllByRole('row')[1].textContent).toContain('Ana Soto')
  })

  it('tiene enlace a la boleta', () => {
    renderOrdenes()
    expect(screen.getByRole('link', { name: 'Ver boleta 1' }).getAttribute('href')).toBe('/admin/ordenes/1')
  })
})
