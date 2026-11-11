import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import Registro from './Registro.jsx'
import { SesionProvider } from '../context/SesionProvider.jsx'
import { getAll, resetDB } from '../data/db.js'

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
  beforeEach(() => {
    resetDB()
    localStorage.removeItem('zthorken-sesion')
  })

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
    expect(getAll('usuarios').length).toBe(2)
  })

  it('no permite un correo ya registrado', () => {
    renderRegistro()
    llenar({ ...datosValidos, Correo: 'pedro@correo.cl' })
    enviar()
    expect(screen.getByRole('alert').textContent).toBe('Ya existe una cuenta con ese correo')
  })

  it('crea la cuenta, inicia sesión y redirige al inicio', () => {
    renderRegistro()
    llenar(datosValidos)
    enviar()
    expect(screen.getByText('Página de inicio')).toBeTruthy()
    const nuevo = getAll('usuarios').find((u) => u.correo === 'ana@correo.cl')
    expect(nuevo.rol).toBe('cliente')
    expect(nuevo.confirmar).toBeUndefined()
    expect(localStorage.getItem('zthorken-sesion')).toBe(String(nuevo.id))
  })
})
