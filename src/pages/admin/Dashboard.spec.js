import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Dashboard from './Dashboard.jsx'
import { backend, instalarBackend } from '../../test/backendFalso.js'

function renderDashboard() {
  return render(<MemoryRouter><Dashboard /></MemoryRouter>)
}

const tarjeta = (titulo) => screen.getByRole('heading', { name: titulo }).nextElementSibling.textContent

describe('Dashboard', () => {
  beforeEach(() => instalarBackend())

  it('muestra las tarjetas con los totales del backend', async () => {
    renderDashboard()
    await screen.findByRole('heading', { name: 'Compras' })
    expect(tarjeta('Compras')).toBe('1')
    expect(tarjeta('Productos')).toBe('12')
    expect(tarjeta('Usuarios')).toBe('3')
  })

  it('muestra el total vendido, los productos críticos y los clientes', async () => {
    renderDashboard()
    expect(await screen.findByText('Total vendido: $129.970')).toBeTruthy()
    expect(screen.getByText('En stock crítico: 3')).toBeTruthy()
    expect(screen.getByText('Clientes: 1')).toBeTruthy()
  })

  it('no cuenta las boletas anuladas como venta', async () => {
    backend.boletas[0].estado = 'ANULADA'
    renderDashboard()
    expect(await screen.findByText('Total vendido: $0')).toBeTruthy()
  })

  it('tiene accesos directos', async () => {
    renderDashboard()
    expect((await screen.findByRole('link', { name: 'Nuevo producto' })).getAttribute('href')).toBe('/admin/productos/nuevo')
    expect(screen.getByRole('link', { name: 'Productos críticos' }).getAttribute('href')).toBe('/admin/productos/criticos')
  })
})
