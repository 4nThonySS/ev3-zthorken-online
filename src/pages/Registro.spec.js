import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import Registro from './Registro.jsx'
import { SesionProvider } from '../context/SesionProvider.jsx'
import { backend, instalarBackend } from '../test/backendFalso.js'

function renderRegistro() {
  return render(
    <MemoryRouter initialEntries={['/registro']}>
      <SesionProvider>
        <Routes>
          <Route path="/registro" element={<Registro />} />
          <Route path="/" element={<p>Página de inicio</p>} />
        </Routes>
      </SesionProvider>
    </MemoryRouter>,
  )
}

function llenar(datos) {
  for (const [label, valor] of Object.entries(datos)) {
    fireEvent.change(screen.getByLabelText(label), { target: { value: valor } })
  }
}

const datosValidos = {
  Nombre: 'Ana',
  Apellidos: 'Soto',
  Correo: 'ana@correo.cl',
  Contraseña: 'ana12345',
  'Confirmar contraseña': 'ana12345',
}

function enviar() {
  fireEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }))
}

describe('Registro', () => {
  beforeEach(() => instalarBackend())

  it('muestra errores en todos los campos si se envía vacío', () => {
    renderRegistro()
    enviar()
    expect(screen.getByText('Ingresa tu nombre')).toBeTruthy()
    expect(screen.getByText('Ingresa tus apellidos')).toBeTruthy()
    expect(screen.getByText('Ingresa tu correo')).toBeTruthy()
    expect(screen.getByText('La contraseña debe tener al menos 6 caracteres')).toBeTruthy()
  })

  it('avisa si las contraseñas no coinciden', () => {
    renderRegistro()
    llenar({ ...datosValidos, 'Confirmar contraseña': 'otra123' })
    enviar()
    expect(screen.getByText('Las contraseñas no coinciden')).toBeTruthy()
    expect(backend.peticiones).toEqual([])
  })

  it('muestra el error del backend si el correo ya está registrado', async () => {
    renderRegistro()
    llenar({ ...datosValidos, Correo: 'pedro@correo.cl' })
    enviar()
    expect((await screen.findByRole('alert')).textContent).toBe('Ya existe un usuario con el correo pedro@correo.cl')
  })

  it('crea la cuenta en el backend, inicia sesión y redirige al inicio', async () => {
    renderRegistro()
    llenar(datosValidos)
    enviar()
    expect(await screen.findByText('Página de inicio')).toBeTruthy()
    const nuevo = backend.usuarios.find((u) => u.correo === 'ana@correo.cl')
    expect(nuevo.rol).toBe('CLIENTE')
    expect(nuevo.confirmar).toBeUndefined()
    expect(JSON.parse(localStorage.getItem('zthorken-sesion')).usuario.id).toBe(nuevo.id)
  })
})
