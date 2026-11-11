import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../App.jsx'
import { CartProvider } from '../context/CartContext.jsx'
import { SesionProvider } from '../context/SesionProvider.jsx'

describe('NoEncontrada', () => {
  it('se muestra en una ruta que no existe, con enlace al inicio', () => {
    render(
      <MemoryRouter initialEntries={['/ruta-que-no-existe']}>
        <SesionProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </SesionProvider>
      </MemoryRouter>
    )
    expect(screen.getByRole('heading', { name: 'Página no encontrada' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Ir al inicio' }).getAttribute('href')).toBe('/')
  })
})
