import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import Boleta from './Boleta.jsx'
import { resetDB } from '../../data/db.js'

function renderBoleta(id) {
  return render(
    <MemoryRouter initialEntries={[`/admin/ordenes/${id}`]}>
      <Routes>
        <Route path="/admin/ordenes/:id" element={<Boleta />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('Boleta', () => {
  beforeEach(() => resetDB())

  it('muestra el número, el cliente y la dirección', () => {
    renderBoleta(1)
    expect(screen.getByRole('heading', { name: 'Boleta N° 1' })).toBeTruthy()
    expect(screen.getByText('Pedro Pérez')).toBeTruthy()
    expect(screen.getByText('Los Crisantemos 123, Depto 603')).toBeTruthy()
    expect(screen.getByText('Fecha: 1 de octubre de 2026')).toBeTruthy()
  })

  it('muestra los productos con su subtotal y el total', () => {
    renderBoleta(1)
    const fila = screen.getByText('Teclado Mecánico Redragon Kumara').closest('tr')
    expect(fila.textContent).toContain('$34.990')
    expect(fila.textContent).toContain('$69.980')
    expect(screen.getByText('Total').nextElementSibling.textContent).toBe('$129.970')
  })

  it('tiene enlace al usuario que compró', () => {
    renderBoleta(1)
    expect(screen.getByRole('link', { name: 'Ver usuario' }).getAttribute('href')).toBe('/admin/usuarios/2')
  })

  it('el botón imprimir llama a window.print', () => {
    spyOn(window, 'print')
    renderBoleta(1)
    fireEvent.click(screen.getByRole('button', { name: 'Imprimir' }))
    expect(window.print).toHaveBeenCalled()
  })

  it('avisa si la orden no existe', () => {
    renderBoleta(999)
    expect(screen.getByText('La orden no existe.')).toBeTruthy()
  })
})
