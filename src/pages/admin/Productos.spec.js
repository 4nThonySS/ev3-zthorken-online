import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Productos from './Productos.jsx'
import { SesionContext } from '../../context/sesion.js'
import { backend, instalarBackend, hasta } from '../../test/backendFalso.js'

function renderProductos(props, rol = 'ADMIN') {
  return render(
    <MemoryRouter>
      <SesionContext.Provider value={{ usuario: { id: 1, rol } }}>
        <Productos {...props} />
      </SesionContext.Provider>
    </MemoryRouter>,
  )
}

// Filas del cuerpo de la tabla, cuando ya cargaron
async function filas() {
  await screen.findByText('Audífonos HyperX Cloud II')
  return screen.getAllByRole('row').slice(1)
}

describe('Admin Productos', () => {
  beforeEach(() => instalarBackend())

  it('renderiza todos los productos en la tabla', async () => {
    renderProductos()
    expect((await filas()).length).toBe(backend.productos.length)
    for (const p of backend.productos) expect(screen.getByText(p.nombre)).toBeTruthy()
  })

  it('muestra precio, oferta y categoría', async () => {
    renderProductos()
    const fila = (await screen.findByText('Audífonos HyperX Cloud II')).closest('tr')
    expect(fila.textContent).toContain('Audio')
    expect(fila.textContent).toContain('$79.990')
    expect(fila.textContent).toContain('$59.990')
  })

  it('marca los productos con stock crítico', async () => {
    renderProductos()
    expect((await screen.findAllByText('Crítico')).length).toBe(3)
  })

  it('con soloCriticos pide al backend solo los de stock crítico', async () => {
    renderProductos({ soloCriticos: true })
    await screen.findByText('Mouse Logitech G502 Hero')
    expect(screen.getByRole('heading', { name: 'Productos críticos' })).toBeTruthy()
    expect(screen.getAllByRole('row').length - 1).toBe(3)
    expect(screen.queryByText('PC Gamer Ryzen 5 RTX 4060')).toBeNull()
    expect(backend.peticiones).toContain('GET /productos/stock-critico')
  })

  it('elimina un producto en el backend al confirmar', async () => {
    spyOn(window, 'confirm').and.returnValue(true)
    renderProductos()
    fireEvent.click(await screen.findByRole('button', { name: 'Eliminar SSD Kingston NV2 1 TB' }))
    await hasta(() => !screen.queryByText('SSD Kingston NV2 1 TB'))
    expect(backend.productos.find((p) => p.id === 12)).toBeUndefined()
    expect(screen.getAllByRole('row').length - 1).toBe(11)
  })

  it('no elimina si se cancela', async () => {
    spyOn(window, 'confirm').and.returnValue(false)
    renderProductos()
    fireEvent.click(await screen.findByRole('button', { name: 'Eliminar SSD Kingston NV2 1 TB' }))
    expect(backend.peticiones).not.toContain('DELETE /productos/12')
  })

  it('tiene enlaces para ver y editar cada producto', async () => {
    renderProductos()
    expect((await screen.findByRole('link', { name: 'Ver SSD Kingston NV2 1 TB' })).getAttribute('href')).toBe('/admin/productos/12')
    expect(screen.getByRole('link', { name: 'Editar SSD Kingston NV2 1 TB' }).getAttribute('href')).toBe('/admin/productos/12/editar')
  })

  it('el vendedor solo puede ver: no hay botones de crear, editar ni eliminar', async () => {
    renderProductos({}, 'VENDEDOR')
    expect((await filas()).length).toBe(12)
    expect(screen.getByRole('link', { name: 'Ver SSD Kingston NV2 1 TB' })).toBeTruthy()
    expect(screen.queryByRole('link', { name: 'Nuevo producto' })).toBeNull()
    expect(screen.queryByRole('link', { name: 'Editar SSD Kingston NV2 1 TB' })).toBeNull()
    expect(screen.queryByRole('button', { name: 'Eliminar SSD Kingston NV2 1 TB' })).toBeNull()
  })
})
