import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Categorias from './Categorias.jsx'
import { backend, instalarBackend, hasta } from '../../test/backendFalso.js'

async function renderCategorias() {
  render(<MemoryRouter><Categorias /></MemoryRouter>)
  await screen.findByText('Audio')
}

describe('Admin Categorias', () => {
  beforeEach(() => instalarBackend())

  it('renderiza todas las categorías en la tabla', async () => {
    await renderCategorias()
    expect(screen.getAllByRole('row').length - 1).toBe(backend.categorias.length)
    for (const c of backend.categorias) expect(screen.getByText(c.nombre)).toBeTruthy()
  })

  it('muestra cuántos productos tiene cada categoría', async () => {
    await renderCategorias()
    expect(screen.getByText('Audio').closest('tr').children[2].textContent).toBe('2')
  })

  it('elimina una categoría sin productos', async () => {
    spyOn(window, 'confirm').and.returnValue(true)
    backend.categorias.push({ id: 7, nombre: 'Accesorios', imagen: null })
    await renderCategorias()
    fireEvent.click(screen.getByRole('button', { name: 'Eliminar Accesorios' }))
    await hasta(() => !screen.queryByText('Accesorios'))
    expect(backend.categorias.length).toBe(6)
  })

  it('si tiene productos muestra el error del backend y no la elimina', async () => {
    spyOn(window, 'confirm').and.returnValue(true)
    await renderCategorias()
    fireEvent.click(screen.getByRole('button', { name: 'Eliminar Audio' }))
    expect((await screen.findByRole('alert')).textContent).toBe('No se puede eliminar la categoría Audio porque tiene productos')
    expect(backend.categorias.length).toBe(6)
  })

  it('tiene enlaces para editar', async () => {
    await renderCategorias()
    expect(screen.getByRole('link', { name: 'Editar Audio' }).getAttribute('href')).toBe('/admin/categorias/3/editar')
  })
})
