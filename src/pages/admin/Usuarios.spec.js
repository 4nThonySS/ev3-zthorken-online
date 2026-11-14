import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Usuarios from './Usuarios.jsx'
import { SesionProvider } from '../../context/SesionProvider.jsx'
import { backend, iniciarSesion, instalarBackend, hasta } from '../../test/backendFalso.js'

// Se renderiza con la sesión del admin (id 1) y espera a que carguen los usuarios
async function renderUsuarios() {
  iniciarSesion('admin@zthorken.cl')
  render(
    <MemoryRouter>
      <SesionProvider>
        <Usuarios />
      </SesionProvider>
    </MemoryRouter>,
  )
  await screen.findByText('pedro@correo.cl')
}

describe('Admin Usuarios', () => {
  beforeEach(() => instalarBackend())

  it('renderiza todos los usuarios en la tabla', async () => {
    await renderUsuarios()
    expect(screen.getAllByRole('row').length - 1).toBe(backend.usuarios.length)
    for (const u of backend.usuarios) expect(screen.getByText(u.correo)).toBeTruthy()
  })

  it('muestra el rol de cada usuario', async () => {
    await renderUsuarios()
    expect(screen.getByText('pedro@correo.cl').closest('tr').textContent).toContain('CLIENTE')
    expect(screen.getByText('vendedor@zthorken.cl').closest('tr').textContent).toContain('VENDEDOR')
    expect(screen.getByText('admin@zthorken.cl').closest('tr').textContent).toContain('ADMIN')
  })

  it('elimina un usuario en el backend al confirmar', async () => {
    spyOn(window, 'confirm').and.returnValue(true)
    await renderUsuarios()
    fireEvent.click(screen.getByRole('button', { name: 'Eliminar Pedro Pérez' }))
    await hasta(() => !screen.queryByText('pedro@correo.cl'))
    expect(backend.usuarios.find((u) => u.id === 3)).toBeUndefined()
  })

  it('el admin no puede eliminarse a sí mismo', async () => {
    await renderUsuarios()
    expect(screen.queryByRole('button', { name: 'Eliminar Admin Zthorken' })).toBeNull()
  })

  it('tiene enlaces para ver y editar', async () => {
    await renderUsuarios()
    expect(screen.getByRole('link', { name: 'Ver Pedro Pérez' }).getAttribute('href')).toBe('/admin/usuarios/3')
    expect(screen.getByRole('link', { name: 'Editar Pedro Pérez' }).getAttribute('href')).toBe('/admin/usuarios/3/editar')
  })
})
