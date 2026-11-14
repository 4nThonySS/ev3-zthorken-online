import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Ordenes from './Ordenes.jsx'
import { backend, instalarBackend } from '../../test/backendFalso.js'

async function renderOrdenes() {
  render(<MemoryRouter><Ordenes /></MemoryRouter>)
  await screen.findByRole('table')
}

describe('Admin Ordenes', () => {
  beforeEach(() => instalarBackend())

  it('renderiza las boletas del backend en el orden en que llegan', async () => {
    backend.boletas.unshift({
      id: 2, usuarioId: null, fecha: '2026-10-10T09:00:00', estado: 'PAGADA', total: 1000,
      items: [{ productoId: 1, nombre: 'PC', precio: 1000, cantidad: 1, subtotal: 1000 }],
      cliente: { nombre: 'Ana', apellidos: 'Soto', correo: 'ana@correo.cl' },
    })
    await renderOrdenes()
    const filas = screen.getAllByRole('row').slice(1)
    expect(filas.length).toBe(2)
    expect(filas[0].textContent).toContain('Ana Soto')
  })

  it('muestra cliente, cantidad de productos, total y estado', async () => {
    await renderOrdenes()
    const fila = screen.getAllByRole('row')[1]
    expect(fila.textContent).toContain('Pedro Pérez')
    expect(fila.textContent).toContain('pedro@correo.cl')
    expect(fila.children[3].textContent).toBe('3')
    expect(fila.textContent).toContain('$129.970')
    expect(fila.textContent).toContain('PAGADA')
  })

  it('tiene enlace a la boleta', async () => {
    await renderOrdenes()
    expect(screen.getByRole('link', { name: 'Ver boleta 1' }).getAttribute('href')).toBe('/admin/ordenes/1')
  })
})
