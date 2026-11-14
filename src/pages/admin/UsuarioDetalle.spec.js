import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import UsuarioDetalle from './UsuarioDetalle.jsx'
import { backend, instalarBackend } from '../../test/backendFalso.js'

function renderDetalle(id) {
  return render(
    <MemoryRouter initialEntries={[`/admin/usuarios/${id}`]}>
      <Routes>
        <Route path="/admin/usuarios/:id" element={<UsuarioDetalle />} />
      </Routes>
    </MemoryRouter>,
  )
}

const boleta = (usuarioId, fecha, total, estado = 'PAGADA') => ({
  id: backend.boletas.length + 1, usuarioId, fecha, estado, total,
  items: [{ productoId: 1, nombre: 'PC', precio: total, cantidad: 3, subtotal: total }],
})

describe('UsuarioDetalle', () => {
  beforeEach(() => instalarBackend())

  it('muestra los datos del usuario', async () => {
    renderDetalle(3)
    expect(await screen.findByRole('heading', { name: 'Pedro Pérez' })).toBeTruthy()
    expect(screen.getByText('pedro@correo.cl')).toBeTruthy()
    expect(screen.getByText('Los Crisantemos 123, Depto 603')).toBeTruthy()
    expect(screen.getByText('Cerrillos, Región Metropolitana de Santiago')).toBeTruthy()
  })

  it('muestra el historial de compras del usuario que entrega el backend', async () => {
    backend.boletas.unshift(boleta(3, '2026-10-10T09:00:00', 1000))
    backend.boletas.unshift(boleta(1, '2026-10-11T09:00:00', 5000))
    backend.boletas.unshift(boleta(3, '2026-10-12T09:00:00', 7000, 'ANULADA'))
    renderDetalle(3)
    await screen.findByText(/compra\(s\)/)
    const filas = screen.getAllByRole('row').slice(1)
    expect(filas.length).toBe(3)
    expect(filas[0].textContent).toContain('12 de octubre de 2026')
    // La anulada no suma
    expect(screen.getByText('3 compra(s) por un total de $130.970.')).toBeTruthy()
    expect(backend.peticiones).toContain('GET /boletas?usuarioId=3')
  })

  it('tiene enlace a la boleta de cada compra', async () => {
    renderDetalle(3)
    expect((await screen.findByRole('link', { name: 'Ver boleta 1' })).getAttribute('href')).toBe('/admin/ordenes/1')
  })

  it('avisa si el usuario no tiene compras', async () => {
    renderDetalle(1)
    expect(await screen.findByText('Este usuario todavía no tiene compras.')).toBeTruthy()
    expect(screen.queryByRole('table')).toBeNull()
  })

  it('avisa si el usuario no existe', async () => {
    renderDetalle(999)
    expect(await screen.findByText('El usuario no existe.')).toBeTruthy()
  })
})
