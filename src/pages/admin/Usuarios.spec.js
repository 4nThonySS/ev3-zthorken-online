import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Usuarios from './Usuarios.jsx'
import { SesionProvider } from '../../context/SesionProvider.jsx'
import { getAll, getById, create, resetDB } from '../../data/db.js'

// Se renderiza con la sesión del admin (id 1)
function renderUsuarios() {
  localStorage.setItem('zthorken-sesion', '1')
  return render(
    <MemoryRouter>
      <SesionProvider>
        <Usuarios />
      </SesionProvider>
    </MemoryRouter>,
  )
}

describe('Admin Usuarios', () => {
  beforeEach(() => resetDB())
  afterEach(() => localStorage.removeItem('zthorken-sesion'))

  it('renderiza todos los usuarios en la tabla', () => {
    create('usuarios', { nombre: 'Ana', apellidos: 'Soto', correo: 'ana@correo.cl', rol: 'cliente' })
    renderUsuarios()
    expect(screen.getAllByRole('row').length - 1).toBe(getAll('usuarios').length)
    for (const u of getAll('usuarios')) {
      expect(screen.getByText(u.correo)).toBeTruthy()
    }
  })

  it('muestra el rol de cada usuario', () => {
    renderUsuarios()
    expect(screen.getByText('pedro@correo.cl').closest('tr').textContent).toContain('cliente')
    expect(screen.getByText('admin@zthorken.cl').closest('tr').textContent).toContain('admin')
  })

  it('elimina un usuario al confirmar', () => {
    spyOn(window, 'confirm').and.returnValue(true)
    renderUsuarios()
    fireEvent.click(screen.getByRole('button', { name: 'Eliminar Pedro Pérez' }))
    expect(getById('usuarios', 2)).toBeNull()
    expect(screen.queryByText('pedro@correo.cl')).toBeNull()
  })

  it('el admin no puede eliminarse a sí mismo', () => {
    renderUsuarios()
    expect(screen.queryByRole('button', { name: 'Eliminar Admin Zthorken' })).toBeNull()
  })

  it('tiene enlaces para ver y editar', () => {
    renderUsuarios()
    expect(screen.getByRole('link', { name: 'Ver Pedro Pérez' }).getAttribute('href')).toBe('/admin/usuarios/2')
    expect(screen.getByRole('link', { name: 'Editar Pedro Pérez' }).getAttribute('href')).toBe('/admin/usuarios/2/editar')
  })
})
