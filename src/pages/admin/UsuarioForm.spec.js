import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import UsuarioForm from './UsuarioForm.jsx'
import { SesionProvider } from '../../context/SesionProvider.jsx'
import { getAll, getById, resetDB } from '../../data/db.js'

// Se renderiza con la sesión del admin (id 1)
function renderForm(ruta = '/admin/usuarios/nuevo') {
  localStorage.setItem('zthorken-sesion', '1')
  return render(
    <MemoryRouter initialEntries={[ruta]}>
      <SesionProvider>
        <Routes>
          <Route path="/admin/usuarios/nuevo" element={<UsuarioForm />} />
          <Route path="/admin/usuarios/:id/editar" element={<UsuarioForm />} />
          <Route path="/admin/usuarios" element={<p>Listado de usuarios</p>} />
        </Routes>
      </SesionProvider>
    </MemoryRouter>,
  )
}

function escribir(label, valor) {
  fireEvent.change(screen.getByLabelText(label), { target: { value: valor } })
}

function guardar() {
  fireEvent.click(screen.getByRole('button', { name: 'Guardar' }))
}

function llenarValido() {
  escribir('Nombre', 'Ana')
  escribir('Apellidos', 'Soto')
  escribir('Correo', 'Ana@Correo.cl')
  escribir('Contraseña', 'ana123')
}

describe('UsuarioForm', () => {
  beforeEach(() => resetDB())
  afterEach(() => localStorage.removeItem('zthorken-sesion'))

  it('actualiza el estado del formulario al escribir', () => {
    renderForm()
    escribir('Nombre', 'Ana')
    escribir('Rol', 'admin')
    expect(screen.getByLabelText('Nombre').value).toBe('Ana')
    expect(screen.getByLabelText('Rol').value).toBe('admin')
  })

  it('muestra errores si se envía vacío y no guarda', () => {
    renderForm()
    guardar()
    expect(screen.getByText('Ingresa el nombre')).toBeTruthy()
    expect(screen.getByText('Ingresa los apellidos')).toBeTruthy()
    expect(screen.getByText('Ingresa el correo')).toBeTruthy()
    expect(screen.getByText('La contraseña debe tener al menos 6 caracteres')).toBeTruthy()
    expect(getAll('usuarios').length).toBe(2)
  })

  it('valida el formato del correo', () => {
    renderForm()
    llenarValido()
    escribir('Correo', 'correo-malo')
    guardar()
    expect(screen.getByText('El correo no es válido')).toBeTruthy()
  })

  it('no permite un correo repetido', () => {
    renderForm()
    llenarValido()
    escribir('Correo', 'PEDRO@correo.cl')
    guardar()
    expect(screen.getByText('Ya existe una cuenta con ese correo')).toBeTruthy()
  })

  it('crea un usuario y vuelve al listado', () => {
    renderForm()
    llenarValido()
    escribir('Comuna (opcional)', 'Maipú')
    guardar()
    expect(screen.getByText('Listado de usuarios')).toBeTruthy()
    const nuevo = getById('usuarios', 3)
    expect(nuevo.correo).toBe('ana@correo.cl')
    expect(nuevo.password).toBe('ana123')
    expect(nuevo.rol).toBe('cliente')
    expect(nuevo.comuna).toBe('Maipú')
  })

  it('al editar carga los datos sin la contraseña', () => {
    renderForm('/admin/usuarios/2/editar')
    expect(screen.getByRole('heading', { name: 'Editar usuario' })).toBeTruthy()
    expect(screen.getByLabelText('Correo').value).toBe('pedro@correo.cl')
    expect(screen.getByLabelText('Contraseña').value).toBe('')
  })

  it('al editar con la contraseña vacía mantiene la anterior', () => {
    renderForm('/admin/usuarios/2/editar')
    escribir('Nombre', 'Pedrito')
    guardar()
    expect(getById('usuarios', 2).nombre).toBe('Pedrito')
    expect(getById('usuarios', 2).password).toBe('pedro123')
  })

  it('al editar a sí mismo no puede cambiar su rol', () => {
    renderForm('/admin/usuarios/1/editar')
    expect(screen.getByLabelText('Rol').disabled).toBeTrue()
  })

  it('avisa si el usuario no existe', () => {
    renderForm('/admin/usuarios/999/editar')
    expect(screen.getByText('El usuario no existe.')).toBeTruthy()
  })
})
