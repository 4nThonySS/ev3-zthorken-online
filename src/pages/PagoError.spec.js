import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import PagoError from './PagoError.jsx'

describe('PagoError', () => {
  it('muestra el mensaje recibido y el botón de reintentar', () => {
    render(
      <MemoryRouter initialEntries={[{ pathname: '/pago-error', state: { mensaje: 'Stock insuficiente' } }]}>
        <PagoError />
      </MemoryRouter>
    )
    expect(screen.getByText('Stock insuficiente')).toBeTruthy()
    expect(screen.getByText('Reintentar pago')).toBeTruthy()
  })

  it('muestra un mensaje por defecto sin estado', () => {
    render(
      <MemoryRouter>
        <PagoError />
      </MemoryRouter>
    )
    expect(screen.getByText('No pudimos procesar tu pago.')).toBeTruthy()
  })
})