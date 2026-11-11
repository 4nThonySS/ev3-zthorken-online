import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Perfil from './Perfil.jsx'
import { SesionProvider } from '../../context/SesionProvider.jsx'
import { getById, resetDB } from '../../data/db.js'

// Se renderiza con la sesión del admin (id 1)
function renderPerfil() {
  localStorage.setItem('zthorken-sesion', '1')
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

describe('Perfil', () => {
  beforeEach(() => resetDB())
  afterEach(() => localStorage.removeItem('zthorken-sesion'))

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

  it('guarda los cambios sin tocar la contraseña', () => {
    renderPerfil()
    escribir('Nombre', 'Administrador')
    guardar()
    expect(screen.getByRole('alert').textContent).toBe('Perfil actualizado')
    expect(getById('usuarios', 1).nombre).toBe('Administrador')
    expect(getById('usuarios', 1).password).toBe('admin123')
  })

  it('cambia la contraseña', () => {
    renderPerfil()
    escribir('Nueva contraseña (opcional)', 'nueva123')
    escribir('Confirmar contraseña', 'nueva123')
    guardar()
    expect(getById('usuarios', 1).password).toBe('nueva123')
    expect(screen.getByLabelText('Nueva contraseña (opcional)').value).toBe('')
  })

  it('no permite usar el correo de otra cuenta', () => {
    renderPerfil()
    escribir('Correo', 'pedro@correo.cl')
    guardar()
    expect(screen.getByRole('alert').textContent).toBe('Ya existe una cuenta con ese correo')
    expect(getById('usuarios', 1).correo).toBe('admin@zthorken.cl')
  })
})
