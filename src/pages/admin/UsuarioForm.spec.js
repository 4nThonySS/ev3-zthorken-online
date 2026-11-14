import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import UsuarioForm from './UsuarioForm.jsx'
import { SesionProvider } from '../../context/SesionProvider.jsx'
import { backend, iniciarSesion, instalarBackend } from '../../test/backendFalso.js'

// Se renderiza con la sesión del admin (id 1) y espera a que cargue el formulario
async function renderForm(ruta = '/admin/usuarios/nuevo') {
  iniciarSesion('admin@zthorken.cl')
  render(
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
  if (!ruta.includes('999')) await screen.findByRole('button', { name: 'Guardar' })
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
  beforeEach(() => instalarBackend())

  it('actualiza el estado del formulario al escribir y ofrece los tres roles', async () => {
    await renderForm()
    escribir('Nombre', 'Ana')
    escribir('Rol', 'VENDEDOR')
    expect(screen.getByLabelText('Nombre').value).toBe('Ana')
    expect(screen.getByLabelText('Rol').value).toBe('VENDEDOR')
    expect([...screen.getByLabelText('Rol').options].map((o) => o.value)).toEqual(['CLIENTE', 'VENDEDOR', 'ADMIN'])
  })

  it('muestra errores si se envía vacío y no llama al backend', async () => {
    await renderForm()
    guardar()
    expect(screen.getByText('Ingresa el nombre')).toBeTruthy()
    expect(screen.getByText('Ingresa los apellidos')).toBeTruthy()
    expect(screen.getByText('Ingresa el correo')).toBeTruthy()
    expect(screen.getByText('La contraseña debe tener al menos 6 caracteres')).toBeTruthy()
    expect(backend.usuarios.length).toBe(3)
  })

  it('valida el formato del correo', async () => {
    await renderForm()
    llenarValido()
    escribir('Correo', 'correo-malo')
    guardar()
    expect(screen.getByText('El correo no es válido')).toBeTruthy()
  })

  it('muestra el error del backend si el correo está repetido', async () => {
    await renderForm()
    llenarValido()
    escribir('Correo', 'PEDRO@correo.cl')
    guardar()
    expect((await screen.findByRole('alert')).textContent).toBe('Ya existe un usuario con el correo pedro@correo.cl')
  })

  it('crea un usuario en el backend y vuelve al listado', async () => {
    await renderForm()
    llenarValido()
    escribir('Comuna (opcional)', 'Maipú')
    guardar()
    expect(await screen.findByText('Listado de usuarios')).toBeTruthy()
    const nuevo = backend.usuarios.find((u) => u.id === 4)
    expect(nuevo.correo).toBe('ana@correo.cl')
    expect(nuevo.password).toBe('ana123')
    expect(nuevo.rol).toBe('CLIENTE')
    expect(nuevo.comuna).toBe('Maipú')
  })

  it('al editar carga los datos sin la contraseña', async () => {
    await renderForm('/admin/usuarios/3/editar')
    expect(screen.getByRole('heading', { name: 'Editar usuario' })).toBeTruthy()
    expect(screen.getByLabelText('Correo').value).toBe('pedro@correo.cl')
    expect(screen.getByLabelText('Contraseña').value).toBe('')
  })

  it('al editar con la contraseña vacía no la envía y se mantiene', async () => {
    await renderForm('/admin/usuarios/3/editar')
    escribir('Nombre', 'Pedrito')
    guardar()
    await screen.findByText('Listado de usuarios')
    expect(backend.usuarios.find((u) => u.id === 3).nombre).toBe('Pedrito')
    expect(backend.usuarios.find((u) => u.id === 3).password).toBe('pedro123')
  })

  it('al editar a sí mismo no puede cambiar su rol', async () => {
    await renderForm('/admin/usuarios/1/editar')
    expect(screen.getByLabelText('Rol').disabled).toBeTrue()
  })

  it('avisa si el usuario no existe', async () => {
    await renderForm('/admin/usuarios/999/editar')
    expect(await screen.findByText('El usuario no existe.')).toBeTruthy()
  })
})
