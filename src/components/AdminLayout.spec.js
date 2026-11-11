import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import AdminLayout from './AdminLayout.jsx'
import { SesionProvider } from '../context/SesionProvider.jsx'
import { resetDB } from '../data/db.js'

// usuarioId: 1 = admin, 2 = cliente, null = sin sesión
function renderAdmin(usuarioId) {
  if (usuarioId) localStorage.setItem('zthorken-sesion', JSON.stringify(usuarioId))
  return render(
    <MemoryRouter initialEntries={['/admin']}>
      <SesionProvider>
        <Routes>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<p>Contenido admin</p>} />
          </Route>
          <Route path="/" element={<p>Página de inicio</p>} />
          <Route path="/login" element={<p>Página de login</p>} />
        </Routes>
      </SesionProvider>
    </MemoryRouter>,
  )
}

describe('AdminLayout', () => {
  beforeEach(() => {
    resetDB()
    localStorage.removeItem('zthorken-sesion')
  })

  it('bloquea el acceso sin sesión y redirige al login', () => {
    renderAdmin(null)
    expect(screen.getByText('Página de login')).toBeTruthy()
    expect(screen.queryByText('Contenido admin')).toBeNull()
  })

  it('bloquea el acceso a un cliente y redirige al inicio', () => {
    renderAdmin(2)
    expect(screen.getByText('Página de inicio')).toBeTruthy()
    expect(screen.queryByText('Contenido admin')).toBeNull()
  })

  it('deja entrar al admin y muestra el menú y el contenido', () => {
    renderAdmin(1)
    expect(screen.getByText('Contenido admin')).toBeTruthy()
    const menu = screen.getByRole('navigation', { name: 'Menú de administración' })
    expect(menu.querySelectorAll('a').length).toBe(7)
  })

  it('cierra sesión y lleva al login', () => {
    renderAdmin(1)
    fireEvent.click(screen.getByRole('button', { name: 'Cerrar sesión' }))
    expect(screen.getByText('Página de login')).toBeTruthy()
    expect(localStorage.getItem('zthorken-sesion')).toBeNull()
  })
})
