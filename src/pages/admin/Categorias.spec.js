import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Categorias from './Categorias.jsx'
import { getAll, getById, create, resetDB } from '../../data/db.js'

function renderCategorias() {
  return render(<MemoryRouter><Categorias /></MemoryRouter>)
}

describe('Admin Categorias', () => {
  beforeEach(() => resetDB())

  it('renderiza todas las categorías en la tabla', () => {
    renderCategorias()
    expect(screen.getAllByRole('row').length - 1).toBe(getAll('categorias').length)
    for (const c of getAll('categorias')) {
      expect(screen.getByText(c.nombre)).toBeTruthy()
    }
  })

  it('muestra cuántos productos tiene cada categoría', () => {
    renderCategorias()
    expect(screen.getByText('Audio').closest('tr').children[2].textContent).toBe('2')
  })

  it('elimina una categoría sin productos', () => {
    spyOn(window, 'confirm').and.returnValue(true)
    const nueva = create('categorias', { nombre: 'Accesorios' })
    renderCategorias()
    fireEvent.click(screen.getByRole('button', { name: 'Eliminar Accesorios' }))
    expect(getById('categorias', nueva.id)).toBeNull()
    expect(screen.queryByText('Accesorios')).toBeNull()
  })

  it('no elimina una categoría con productos y muestra un error', () => {
    spyOn(window, 'confirm').and.returnValue(true)
    renderCategorias()
    fireEvent.click(screen.getByRole('button', { name: 'Eliminar Audio' }))
    expect(getById('categorias', 3)).not.toBeNull()
    expect(screen.getByRole('alert').textContent).toBe('No se puede eliminar "Audio" porque tiene productos.')
  })

  it('tiene enlaces para editar', () => {
    renderCategorias()
    expect(screen.getByRole('link', { name: 'Editar Audio' }).getAttribute('href')).toBe('/admin/categorias/3/editar')
  })
})
