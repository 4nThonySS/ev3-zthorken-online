import { render, screen, fireEvent, act } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Carrusel from './Carrusel.jsx'

// Imagen vacía de 1x1 para que el navegador no busque archivos que no existen
const IMAGEN = 'data:image/gif;base64,R0lGODlhAQABAAAAACw='

const slides = [
  { titulo: 'Uno', texto: 'Primera', imagen: IMAGEN, enlace: '/uno', boton: 'Ir a uno' },
  { titulo: 'Dos', texto: 'Segunda', imagen: IMAGEN },
  { titulo: 'Tres', texto: 'Tercera', imagen: IMAGEN },
]

function renderCarrusel(props) {
  return render(<MemoryRouter><Carrusel slides={slides} {...props} /></MemoryRouter>)
}

// La diapositiva visible es la que tiene la clase "active"
function activa() {
  return document.querySelector('.carousel-item.active h2').textContent
}

describe('Carrusel', () => {
  it('renderiza todas las diapositivas y parte en la primera', () => {
    renderCarrusel()
    expect(document.querySelectorAll('.carousel-item').length).toBe(3)
    expect(activa()).toBe('Uno')
  })

  it('muestra el botón solo si la diapositiva tiene enlace', () => {
    renderCarrusel()
    expect(screen.getAllByRole('link').length).toBe(1)
    expect(screen.getByRole('link', { name: 'Ir a uno' }).getAttribute('href')).toBe('/uno')
  })

  it('avanza y retrocede con los controles, dando la vuelta', () => {
    renderCarrusel()
    fireEvent.click(screen.getByRole('button', { name: 'Siguiente' }))
    expect(activa()).toBe('Dos')
    fireEvent.click(screen.getByRole('button', { name: 'Anterior' }))
    fireEvent.click(screen.getByRole('button', { name: 'Anterior' }))
    expect(activa()).toBe('Tres')
  })

  it('cambia de diapositiva con los indicadores', () => {
    renderCarrusel()
    fireEvent.click(screen.getByRole('button', { name: 'Ir a la diapositiva 3' }))
    expect(activa()).toBe('Tres')
  })

  describe('avance automático', () => {
    beforeEach(() => jasmine.clock().install())
    afterEach(() => jasmine.clock().uninstall())

    it('avanza solo después del intervalo', () => {
      renderCarrusel({ intervalo: 1000 })
      act(() => jasmine.clock().tick(1000))
      expect(activa()).toBe('Dos')
    })

    it('no avanza si el intervalo es 0', () => {
      renderCarrusel({ intervalo: 0 })
      act(() => jasmine.clock().tick(10000))
      expect(activa()).toBe('Uno')
    })
  })
})
