import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import UsuarioDetalle from './UsuarioDetalle.jsx'
import { create, resetDB } from '../../data/db.js'

function renderDetalle(id) {
  return render(
    <MemoryRouter initialEntries={[`/admin/usuarios/${id}`]}>
      <Routes>
        <Route path="/admin/usuarios/:id" element={<UsuarioDetalle />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('UsuarioDetalle', () => {
  beforeEach(() => resetDB())

  it('muestra los datos del usuario', () => {
    renderDetalle(2)
    expect(screen.getByRole('heading', { name: 'Pedro Pérez' })).toBeTruthy()
    expect(screen.getByText('pedro@correo.cl')).toBeTruthy()
    expect(screen.getByText('Los Crisantemos 123, Depto 603')).toBeTruthy()
    expect(screen.getByText('Cerrillos, Región Metropolitana de Santiago')).toBeTruthy()
  })

  it('muestra el historial de compras del usuario', () => {
    create('ordenes', { usuarioId: 2, fecha: '2026-10-10', estado: 'pagada', items: [{ productoId: 1, nombre: 'PC', precio: 1000, cantidad: 3 }], total: 1000 })
    create('ordenes', { usuarioId: 1, fecha: '2026-10-11', estado: 'pagada', items: [], total: 5000 })
    renderDetalle(2)
    const filas = screen.getAllByRole('row').slice(1)
    expect(filas.length).toBe(2)
    // La más reciente primero
    expect(filas[0].textContent).toContain('10 de octubre de 2026')
    expect(screen.getByText('2 compra(s) por un total de $130.970.')).toBeTruthy()
  })

  it('tiene enlace a la boleta de cada compra', () => {
    renderDetalle(2)
    expect(screen.getByRole('link', { name: 'Ver boleta 1' }).getAttribute('href')).toBe('/admin/ordenes/1')
  })

  it('avisa si el usuario no tiene compras', () => {
    renderDetalle(1)
    expect(screen.getByText('Este usuario todavía no tiene compras.')).toBeTruthy()
    expect(screen.queryByRole('table')).toBeNull()
  })

  it('avisa si el usuario no existe', () => {
    renderDetalle(999)
    expect(screen.getByText('El usuario no existe.')).toBeTruthy()
  })
})
