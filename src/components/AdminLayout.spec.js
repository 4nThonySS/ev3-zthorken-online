import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import AdminLayout, { SoloAdmin } from './AdminLayout.jsx'
import { SesionProvider } from '../context/SesionProvider.jsx'
import { iniciarSesion, instalarBackend } from '../test/backendFalso.js'

function renderAdmin(correo, ruta = '/admin') {
  if (correo) iniciarSesion(correo)
  return render(
    <MemoryRouter initialEntries={[ruta]}>
      <SesionProvider>
        <Routes>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="ordenes" element={<p>Órdenes</p>} />
            <Route element={<SoloAdmin />}>
              <Route index element={<p>Contenido admin</p>} />
            </Route>
          </Route>
          <Route path="/" element={<p>Página de inicio</p>} />
          <Route path="/login" element={<p>Página de login</p>} />
        </Routes>
      </SesionProvider>
    </MemoryRouter>,
  )
}

const enlacesDelMenu = () =>
  [...screen.getByRole('navigation', { name: 'Menú de administración' }).querySelectorAll('a')].map((a) => a.textContent)

describe('AdminLayout', () => {
  beforeEach(() => instalarBackend())

  it('bloquea el acceso sin sesión y redirige al login', () => {
    renderAdmin(null)
    expect(screen.getByText('Página de login')).toBeTruthy()
    expect(screen.queryByText('Contenido admin')).toBeNull()
  })

  it('bloquea el acceso a un cliente y redirige al inicio', () => {
    renderAdmin('pedro@correo.cl')
    expect(screen.getByText('Página de inicio')).toBeTruthy()
    expect(screen.queryByText('Contenido admin')).toBeNull()
  })

  it('deja entrar al admin y muestra el menú completo', () => {
    renderAdmin('admin@zthorken.cl')
    expect(screen.getByText('Contenido admin')).toBeTruthy()
    expect(enlacesDelMenu().length).toBe(7)
  })

  it('el vendedor solo ve Órdenes, Productos y Perfil', () => {
    renderAdmin('vendedor@zthorken.cl', '/admin/ordenes')
    expect(screen.getByText('Zthorken Vendedor')).toBeTruthy()
    expect(enlacesDelMenu()).toEqual(['Órdenes', 'Productos', 'Perfil'])
  })

  it('si el vendedor entra a una ruta de admin lo manda a Órdenes', () => {
    renderAdmin('vendedor@zthorken.cl')
    expect(screen.queryByText('Contenido admin')).toBeNull()
    expect(screen.getAllByText('Órdenes').length).toBe(2)
  })

  it('cierra sesión y lleva al login', () => {
    renderAdmin('admin@zthorken.cl')
    fireEvent.click(screen.getByRole('button', { name: 'Cerrar sesión' }))
    expect(screen.getByText('Página de login')).toBeTruthy()
    expect(localStorage.getItem('zthorken-sesion')).toBeNull()
  })
})
