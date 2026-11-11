import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { getAll } from '../data/db.js'
import Categorias from './Categorias.jsx'

describe('Categorias', () => {
  it('renderiza todas las categorías', () => {
    render(
      <MemoryRouter>
        <Categorias />
      </MemoryRouter>
    )
    getAll('categorias').forEach((c) => {
      expect(screen.getByText(c.nombre)).toBeTruthy()
    })
  })
})