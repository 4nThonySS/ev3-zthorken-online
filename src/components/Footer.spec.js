import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Footer from './Footer.jsx'

describe('Footer', () => {
  it('muestra los enlaces y el año actual', () => {
    render(<MemoryRouter><Footer /></MemoryRouter>)
    expect(screen.getByRole('link', { name: 'Contacto' }).getAttribute('href')).toBe('/contacto')
    expect(screen.getByText(new RegExp(`© ${new Date().getFullYear()}`))).toBeTruthy()
  })
})
