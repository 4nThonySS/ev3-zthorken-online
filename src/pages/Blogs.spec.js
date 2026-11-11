import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Blogs from './Blogs.jsx'
import { getAll, remove, resetDB } from '../data/db.js'

function renderBlogs() {
  return render(<MemoryRouter><Blogs /></MemoryRouter>)
}

describe('Blogs', () => {
  beforeEach(() => resetDB())

  it('muestra todas las publicaciones con enlace a su detalle', () => {
    renderBlogs()
    for (const b of getAll('blogs')) {
      expect(screen.getByRole('heading', { name: b.titulo })).toBeTruthy()
      const enlace = screen.getByRole('link', { name: `Leer más: ${b.titulo}` })
      expect(enlace.getAttribute('href')).toBe(`/blogs/${b.id}`)
    }
  })

  it('ordena las publicaciones de la más reciente a la más antigua', () => {
    renderBlogs()
    const titulos = screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)
    expect(titulos).toEqual(['Guía para armar tu setup', '¿Notebook o PC de escritorio?'])
  })

  it('muestra la fecha formateada', () => {
    renderBlogs()
    expect(screen.getByText('5 de octubre de 2026')).toBeTruthy()
  })

  it('avisa cuando no hay publicaciones', () => {
    for (const b of getAll('blogs')) remove('blogs', b.id)
    renderBlogs()
    expect(screen.getByText('Todavía no hay publicaciones.')).toBeTruthy()
  })
})
