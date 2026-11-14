import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { backend, instalarBackend } from '../test/backendFalso.js'
import Categorias from './Categorias.jsx'

describe('Categorias', () => {
  beforeEach(() => instalarBackend())

  it('renderiza todas las categorías', async () => {
    render(
      <MemoryRouter>
        <Categorias />
      </MemoryRouter>
    )
    await screen.findByText('Audio')
    backend.categorias.forEach((c) => expect(screen.getByText(c.nombre)).toBeTruthy())
  })
})
