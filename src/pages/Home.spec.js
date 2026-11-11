import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Home from './Home.jsx'
import { getAll, resetDB } from '../data/db.js'

function renderHome() {
  return render(<MemoryRouter><Home /></MemoryRouter>)
}

describe('Home', () => {
  beforeEach(() => resetDB())

  it('muestra el título de la tienda', () => {
    renderHome()
    expect(screen.getByRole('heading', { level: 1, name: 'Zthorken Online' })).toBeTruthy()
  })

  it('muestra el carrusel', () => {
    renderHome()
    expect(screen.getByRole('heading', { name: 'Nuevos lanzamientos' })).toBeTruthy()
  })

  it('muestra todas las categorías con enlace a su página', () => {
    renderHome()
    for (const c of getAll('categorias')) {
      const enlace = screen.getByRole('link', { name: c.nombre })
      expect(enlace.getAttribute('href')).toBe(`/categorias/${c.id}`)
    }
  })
})
