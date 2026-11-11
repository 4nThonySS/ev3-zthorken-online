import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import CategoriaForm from './CategoriaForm.jsx'
import { getAll, getById, resetDB } from '../../data/db.js'

function renderForm(ruta = '/admin/categorias/nueva') {
  return render(
    <MemoryRouter initialEntries={[ruta]}>
      <Routes>
        <Route path="/admin/categorias/nueva" element={<CategoriaForm />} />
        <Route path="/admin/categorias/:id/editar" element={<CategoriaForm />} />
        <Route path="/admin/categorias" element={<p>Listado de categorías</p>} />
      </Routes>
    </MemoryRouter>,
  )
}

function escribir(label, valor) {
  fireEvent.change(screen.getByLabelText(label), { target: { value: valor } })
}

function guardar() {
  fireEvent.click(screen.getByRole('button', { name: 'Guardar' }))
}

describe('CategoriaForm', () => {
  beforeEach(() => resetDB())

  it('muestra un error si el nombre está vacío', () => {
    renderForm()
    guardar()
    expect(screen.getByText('Ingresa el nombre')).toBeTruthy()
    expect(getAll('categorias').length).toBe(6)
  })

  it('no permite un nombre repetido', () => {
    renderForm()
    escribir('Nombre', 'audio')
    guardar()
    expect(screen.getByText('Ya existe una categoría con ese nombre')).toBeTruthy()
  })

  it('crea una categoría y vuelve al listado', () => {
    renderForm()
    escribir('Nombre', 'Accesorios')
    guardar()
    expect(screen.getByText('Listado de categorías')).toBeTruthy()
    expect(getById('categorias', 7).nombre).toBe('Accesorios')
    expect(getById('categorias', 7).imagen).toContain('placehold.co')
  })

  it('al editar carga el nombre y permite guardarlo igual', () => {
    renderForm('/admin/categorias/3/editar')
    expect(screen.getByLabelText('Nombre').value).toBe('Audio')
    guardar()
    expect(screen.getByText('Listado de categorías')).toBeTruthy()
  })

  it('edita una categoría', () => {
    renderForm('/admin/categorias/3/editar')
    escribir('Nombre', 'Audio y Sonido')
    guardar()
    expect(getById('categorias', 3).nombre).toBe('Audio y Sonido')
    expect(getAll('categorias').length).toBe(6)
  })

  it('avisa si la categoría no existe', () => {
    renderForm('/admin/categorias/999/editar')
    expect(screen.getByText('La categoría no existe.')).toBeTruthy()
  })

  it('al editar muestra la vista previa de la imagen actual', () => {
    renderForm('/admin/categorias/3/editar')
    expect(screen.getByAltText('Vista previa').getAttribute('src')).toBe('/img/categorias/audio.jpg')
  })
})
