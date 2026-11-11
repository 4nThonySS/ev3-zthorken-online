import { render, screen, fireEvent } from '@testing-library/react'
import Contacto from './Contacto.jsx'
import { SesionProvider } from '../context/SesionProvider.jsx'
import { getAll, resetDB } from '../data/db.js'

function renderContacto() {
  return render(<SesionProvider><Contacto /></SesionProvider>)
}

function llenar(datos) {
  for (const [label, valor] of Object.entries(datos)) {
    fireEvent.change(screen.getByLabelText(label), { target: { value: valor } })
  }
}

function enviar() {
  fireEvent.click(screen.getByRole('button', { name: 'Enviar mensaje' }))
}

describe('Contacto', () => {
  beforeEach(() => {
    resetDB()
    localStorage.removeItem('zthorken-sesion')
  })

  it('no muestra errores ni confirmación antes de enviar', () => {
    renderContacto()
    expect(screen.queryByText('Ingresa tu nombre')).toBeNull()
    expect(screen.queryByRole('status')).toBeNull()
  })

  it('muestra errores si se envía vacío', () => {
    renderContacto()
    enviar()
    expect(screen.getByText('Ingresa tu nombre')).toBeTruthy()
    expect(screen.getByText('Ingresa tu correo')).toBeTruthy()
    expect(screen.getByText('El mensaje debe tener al menos 10 caracteres')).toBeTruthy()
    expect(getAll('mensajes').length).toBe(0)
  })

  it('valida el formato del correo', () => {
    renderContacto()
    llenar({ Nombre: 'Ana', Correo: 'ana@', Mensaje: 'Hola, quiero cotizar un notebook.' })
    enviar()
    expect(screen.getByText('El correo no es válido')).toBeTruthy()
  })

  it('actualiza el contador de caracteres al escribir', () => {
    renderContacto()
    llenar({ Mensaje: 'Hola' })
    expect(screen.getByText('4/500')).toBeTruthy()
  })

  it('guarda el mensaje, muestra confirmación y limpia el formulario', () => {
    renderContacto()
    llenar({ Nombre: 'Ana Soto', Correo: 'Ana@Correo.cl', Mensaje: 'Hola, quiero cotizar un notebook.' })
    enviar()

    expect(screen.getByRole('status')).toBeTruthy()
    const [mensaje] = getAll('mensajes')
    expect(mensaje.nombre).toBe('Ana Soto')
    expect(mensaje.correo).toBe('ana@correo.cl')
    expect(screen.getByLabelText('Mensaje').value).toBe('')
  })

  it('llena nombre y correo si hay sesión iniciada', () => {
    localStorage.setItem('zthorken-sesion', '2')
    renderContacto()
    expect(screen.getByLabelText('Nombre').value).toBe('Pedro Pérez')
    expect(screen.getByLabelText('Correo').value).toBe('pedro@correo.cl')
  })
})
