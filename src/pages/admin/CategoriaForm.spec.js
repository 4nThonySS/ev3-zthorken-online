import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import CategoriaForm from './CategoriaForm.jsx'
import { backend, instalarBackend } from '../../test/backendFalso.js'

async function renderForm(ruta = '/admin/categorias/nueva') {
  render(
    <MemoryRouter initialEntries={[ruta]}>
      <Routes>
        <Route path="/admin/categorias/nueva" element={<CategoriaForm />} />
        <Route path="/admin/categorias/:id/editar" element={<CategoriaForm />} />
        <Route path="/admin/categorias" element={<p>Listado de categorías</p>} />
      </Routes>
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

describe('CategoriaForm', () => {
  beforeEach(() => instalarBackend())

  it('muestra un error si el nombre está vacío', async () => {
    await renderForm()
    guardar()
    expect(screen.getByText('Ingresa el nombre')).toBeTruthy()
    expect(backend.peticiones).toEqual([])
  })

  it('muestra el error del backend si el nombre está repetido', async () => {
    await renderForm()
    escribir('Nombre', 'audio')
    guardar()
    expect(await screen.findByText('Ya existe la categoría audio')).toBeTruthy()
  })

  it('crea una categoría y vuelve al listado', async () => {
    await renderForm()
    escribir('Nombre', 'Accesorios')
    guardar()
    expect(await screen.findByText('Listado de categorías')).toBeTruthy()
    const nueva = backend.categorias.find((c) => c.id === 7)
    expect(nueva.nombre).toBe('Accesorios')
    expect(nueva.imagen).toContain('placehold.co')
  })

  it('al editar carga el nombre y permite guardarlo igual', async () => {
    await renderForm('/admin/categorias/3/editar')
    expect(screen.getByLabelText('Nombre').value).toBe('Audio')
    guardar()
    expect(await screen.findByText('Listado de categorías')).toBeTruthy()
  })

  it('edita una categoría', async () => {
    await renderForm('/admin/categorias/3/editar')
    escribir('Nombre', 'Audio y Sonido')
    guardar()
    await screen.findByText('Listado de categorías')
    expect(backend.categorias.find((c) => c.id === 3).nombre).toBe('Audio y Sonido')
    expect(backend.categorias.length).toBe(6)
  })

  it('avisa si la categoría no existe', async () => {
    await renderForm('/admin/categorias/999/editar')
    expect(await screen.findByText('La categoría no existe.')).toBeTruthy()
  })

  it('al editar muestra la vista previa de la imagen actual', async () => {
    await renderForm('/admin/categorias/3/editar')
    expect(screen.getByAltText('Vista previa').getAttribute('src')).toBe('/img/categorias/audio.jpg')
  })
})
