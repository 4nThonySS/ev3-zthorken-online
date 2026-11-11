import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import BlogDetalle from './BlogDetalle.jsx'
import { getById, resetDB } from '../data/db.js'

function renderDetalle(id) {
  return render(
    <MemoryRouter initialEntries={[`/blogs/${id}`]}>
      <Routes>
        <Route path="/blogs/:id" element={<BlogDetalle />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('BlogDetalle', () => {
  beforeEach(() => resetDB())

  it('muestra la publicación del id de la URL', () => {
    renderDetalle(2)
    const blog = getById('blogs', 2)
    expect(screen.getByRole('heading', { level: 1, name: blog.titulo })).toBeTruthy()
    expect(screen.getByText(/5 de octubre de 2026 · Equipo Zthorken/)).toBeTruthy()
  })

  it('separa el contenido en párrafos', () => {
    const { container } = renderDetalle(1)
    const parrafos = getById('blogs', 1).contenido.split('\n\n').length
    // + fecha + resumen
    expect(container.querySelectorAll('article p').length).toBe(parrafos + 2)
  })

  it('tiene un enlace para volver al blog', () => {
    renderDetalle(1)
    expect(screen.getByRole('link', { name: '← Volver al blog' }).getAttribute('href')).toBe('/blogs')
  })

  it('muestra un aviso si la publicación no existe', () => {
    renderDetalle(999)
    expect(screen.getByRole('heading', { name: 'Publicación no encontrada' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Volver al blog' })).toBeTruthy()
  })
})
