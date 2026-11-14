import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import Boleta from './Boleta.jsx'
import { SesionContext } from '../../context/sesion.js'
import { instalarBackend } from '../../test/backendFalso.js'

async function renderBoleta(id, rol = 'ADMIN') {
  render(
    <MemoryRouter initialEntries={[`/admin/ordenes/${id}`]}>
      <SesionContext.Provider value={{ usuario: { id: 1, rol } }}>
        <Routes>
          <Route path="/admin/ordenes/:id" element={<Boleta />} />
        </Routes>
      </SesionContext.Provider>
    </MemoryRouter>,
  )
  if (id !== 999) await screen.findByRole('heading', { name: `Boleta N° ${id}` })
}

describe('Boleta', () => {
  beforeEach(() => instalarBackend())

  it('muestra el número, el cliente y la dirección', async () => {
    await renderBoleta(1)
    expect(screen.getByText('Pedro Pérez')).toBeTruthy()
    expect(screen.getByText('Los Crisantemos 123, Depto 603')).toBeTruthy()
    expect(screen.getByText('Fecha: 1 de octubre de 2026')).toBeTruthy()
  })

  it('muestra los productos con su subtotal y el total', async () => {
    await renderBoleta(1)
    const fila = screen.getByText('Teclado Mecánico Redragon Kumara').closest('tr')
    expect(fila.textContent).toContain('$34.990')
    expect(fila.textContent).toContain('$69.980')
    expect(screen.getByText('Total').nextElementSibling.textContent).toBe('$129.970')
  })

  it('el admin tiene enlace al usuario que compró', async () => {
    await renderBoleta(1)
    expect(screen.getByRole('link', { name: 'Ver usuario' }).getAttribute('href')).toBe('/admin/usuarios/3')
  })

  it('el vendedor no ve el enlace al usuario', async () => {
    await renderBoleta(1, 'VENDEDOR')
    expect(screen.queryByRole('link', { name: 'Ver usuario' })).toBeNull()
  })

  it('el botón imprimir llama a window.print', async () => {
    spyOn(window, 'print')
    await renderBoleta(1)
    fireEvent.click(screen.getByRole('button', { name: 'Imprimir' }))
    expect(window.print).toHaveBeenCalled()
  })

  it('avisa si la orden no existe', async () => {
    await renderBoleta(999)
    expect(await screen.findByText('La orden no existe.')).toBeTruthy()
  })
})
