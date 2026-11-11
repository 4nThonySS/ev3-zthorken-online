import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Dashboard from './Dashboard.jsx'
import { create, resetDB } from '../../data/db.js'

function renderDashboard() {
  return render(<MemoryRouter><Dashboard /></MemoryRouter>)
}

describe('Dashboard', () => {
  beforeEach(() => resetDB())

  it('muestra las tarjetas con los totales', () => {
    renderDashboard()
    expect(screen.getByRole('heading', { name: 'Compras' }).nextElementSibling.textContent).toBe('1')
    expect(screen.getByRole('heading', { name: 'Productos' }).nextElementSibling.textContent).toBe('12')
    expect(screen.getByRole('heading', { name: 'Usuarios' }).nextElementSibling.textContent).toBe('2')
  })

  it('muestra el total vendido, los productos críticos y los clientes', () => {
    renderDashboard()
    expect(screen.getByText('Total vendido: $129.970')).toBeTruthy()
    expect(screen.getByText('En stock crítico: 3')).toBeTruthy()
    expect(screen.getByText('Clientes: 1')).toBeTruthy()
  })

  it('se actualiza con los datos nuevos', () => {
    create('usuarios', { nombre: 'Ana', rol: 'cliente' })
    renderDashboard()
    expect(screen.getByRole('heading', { name: 'Usuarios' }).nextElementSibling.textContent).toBe('3')
  })

  it('tiene accesos directos', () => {
    renderDashboard()
    expect(screen.getByRole('link', { name: 'Nuevo producto' }).getAttribute('href')).toBe('/admin/productos/nuevo')
    expect(screen.getByRole('link', { name: 'Productos críticos' }).getAttribute('href')).toBe('/admin/productos/criticos')
  })
})
