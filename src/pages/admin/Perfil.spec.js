import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Perfil from './Perfil.jsx'
import { SesionProvider } from '../../context/SesionProvider.jsx'
import { backend, iniciarSesion, instalarBackend } from '../../test/backendFalso.js'

// Se renderiza con la sesión del admin (id 1)
function renderPerfil() {
  iniciarSesion('admin@zthorken.cl')
  return render(
    <MemoryRouter>
      <SesionProvider>
        <Perfil />
      </SesionProvider>
    </MemoryRouter>,
  )
}

function escribir(label, valor) {
  fireEvent.change(screen.getByLabelText(label), { target: { value: valor } })
}

function guardar() {
  fireEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }))
}

const admin = () => backend.usuarios.find((u) => u.id === 1)

describe('Perfil', () => {
  beforeEach(() => instalarBackend())

  it('carga los datos del usuario con sesión', () => {
    renderPerfil()
    expect(screen.getByLabelText('Nombre').value).toBe('Admin')
    expect(screen.getByLabelText('Correo').value).toBe('admin@zthorken.cl')
    expect(screen.getByLabelText('Nueva contraseña (opcional)').value).toBe('')
  })

  it('muestra errores si se borran los datos', () => {
    renderPerfil()
    escribir('Nombre', '')
    escribir('Correo', 'correo-malo')
    guardar()
    expect(screen.getByText('Ingresa tu nombre')).toBeTruthy()
    expect(screen.getByText('El correo no es válido')).toBeTruthy()
    expect(screen.queryByRole('alert')).toBeNull()
  })

  it('valida la nueva contraseña', () => {
    renderPerfil()
    escribir('Nueva contraseña (opcional)', '123')
    escribir('Confirmar contraseña', '456')
    guardar()
    expect(screen.getByText('La contraseña debe tener al menos 6 caracteres')).toBeTruthy()
    expect(screen.getByText('Las contraseñas no coinciden')).toBeTruthy()
  })

  it('guarda los cambios en el backend sin tocar la contraseña ni el rol', async () => {
    renderPerfil()
    escribir('Nombre', 'Administrador')
    guardar()
    expect((await screen.findByRole('alert')).textContent).toBe('Perfil actualizado')
    expect(admin().nombre).toBe('Administrador')
    expect(admin().password).toBe('admin123')
    expect(admin().rol).toBe('ADMIN')
  })

  it('cambia la contraseña', async () => {
    renderPerfil()
    escribir('Nueva contraseña (opcional)', 'nueva123')
    escribir('Confirmar contraseña', 'nueva123')
    guardar()
    await screen.findByRole('alert')
    expect(admin().password).toBe('nueva123')
    expect(screen.getByLabelText('Nueva contraseña (opcional)').value).toBe('')
  })

  it('muestra el error del backend si el correo es de otra cuenta', async () => {
    renderPerfil()
    escribir('Correo', 'pedro@correo.cl')
    guardar()
    expect((await screen.findByRole('alert')).textContent).toBe('Ya existe un usuario con el correo pedro@correo.cl')
    expect(admin().correo).toBe('admin@zthorken.cl')
  })
})
