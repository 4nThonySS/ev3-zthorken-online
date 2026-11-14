import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Home from './Home.jsx'
import { backend, instalarBackend } from '../test/backendFalso.js'

function renderHome() {
  return render(<MemoryRouter><Home /></MemoryRouter>)
}

describe('Home', () => {
  beforeEach(() => instalarBackend())

  it('muestra el título de la tienda', () => {
    renderHome()
    expect(screen.getByRole('heading', { level: 1, name: 'Zthorken Online' })).toBeTruthy()
  })

  it('muestra el carrusel', () => {
    renderHome()
    expect(screen.getByRole('heading', { name: 'Nuevos lanzamientos' })).toBeTruthy()
  })

  it('muestra todas las categorías del backend con enlace a su página', async () => {
    renderHome()
    await screen.findByRole('link', { name: 'Audio' })
    for (const c of backend.categorias) {
      expect(screen.getByRole('link', { name: c.nombre }).getAttribute('href')).toBe(`/categorias/${c.id}`)
    }
  })
})
