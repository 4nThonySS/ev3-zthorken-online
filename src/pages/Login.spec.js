import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import Login from './Login.jsx'
import { SesionProvider } from '../context/SesionProvider.jsx'
import { instalarBackend } from '../test/backendFalso.js'

function renderLogin() {
  return render(
    <MemoryRouter initialEntries={['/login']}>
      <SesionProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<p>Página de inicio</p>} />
        </Routes>
      </SesionProvider>
    </MemoryRouter>,
  )
}

function escribir(label, valor) {
  fireEvent.change(screen.getByLabelText(label), { target: { value: valor } })
}

describe('Login', () => {
  beforeEach(() => instalarBackend())

  it('actualiza el estado del formulario al escribir', () => {
    renderLogin()
    escribir('Correo', 'pedro@correo.cl')
    expect(screen.getByLabelText('Correo').value).toBe('pedro@correo.cl')
  })

  it('no muestra errores antes de enviar', () => {
    renderLogin()
    expect(screen.queryByRole('alert')).toBeNull()
    expect(screen.queryByText('Ingresa tu correo')).toBeNull()
  })

  it('muestra errores si se envía vacío', () => {
    renderLogin()
    fireEvent.click(screen.getByRole('button', { name: 'Ingresar' }))
    expect(screen.getByText('Ingresa tu correo')).toBeTruthy()
    expect(screen.getByText('Ingresa tu contraseña')).toBeTruthy()
  })

  it('valida el formato del correo', () => {
    renderLogin()
    escribir('Correo', 'correo-malo')
    escribir('Contraseña', '123456')
    fireEvent.click(screen.getByRole('button', { name: 'Ingresar' }))
    expect(screen.getByText('El correo no es válido')).toBeTruthy()
  })

  it('muestra el error del backend con credenciales incorrectas', async () => {
    renderLogin()
    escribir('Correo', 'pedro@correo.cl')
    escribir('Contraseña', 'incorrecta')
    fireEvent.click(screen.getByRole('button', { name: 'Ingresar' }))
    expect((await screen.findByRole('alert')).textContent).toBe('Correo o contraseña incorrectos')
  })

  it('inicia sesión, guarda el token y redirige al inicio', async () => {
    renderLogin()
    escribir('Correo', 'pedro@correo.cl')
    escribir('Contraseña', 'pedro123')
    fireEvent.click(screen.getByRole('button', { name: 'Ingresar' }))
    expect(await screen.findByText('Página de inicio')).toBeTruthy()
    expect(JSON.parse(localStorage.getItem('zthorken-sesion')).token).toBe('token-3')
  })

  it('tiene un enlace a registro', () => {
    renderLogin()
    expect(screen.getByRole('link', { name: 'Regístrate' }).getAttribute('href')).toBe('/registro')
  })
})
