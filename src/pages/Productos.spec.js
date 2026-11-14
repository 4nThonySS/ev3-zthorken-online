import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { CartProvider } from '../context/CartContext.jsx'
import { backend, backendCaido, instalarBackend } from '../test/backendFalso.js'
import Productos from './Productos.jsx'

const montar = (url = '/productos') =>
  render(
    <MemoryRouter initialEntries={[url]}>
      <CartProvider>
        <Productos />
      </CartProvider>
    </MemoryRouter>
  )

describe('Productos', () => {
  beforeEach(() => instalarBackend())

  it('renderiza todos los productos del backend', async () => {
    montar()
    expect((await screen.findAllByText('Agregar al carrito')).length).toBe(backend.productos.length)
  })

  it('filtra por texto de búsqueda', async () => {
    montar()
    fireEvent.change(await screen.findByPlaceholderText('Buscar producto'), { target: { value: 'zzzzz' } })
    expect(screen.getByText('No se encontraron productos.')).toBeTruthy()
  })

  it('filtra por categoría', async () => {
    montar()
    await screen.findByText('Audio')
    fireEvent.change(screen.getByRole('combobox'), { target: { value: '3' } })
    expect(screen.getAllByText('Agregar al carrito').length).toBe(2)
  })

  it('aplica el texto de ?buscar= al filtro', async () => {
    montar('/productos?buscar=zzzzz')
    expect(await screen.findByText('No se encontraron productos.')).toBeTruthy()
  })

  it('muestra un error si el backend no responde', async () => {
    backendCaido()
    montar()
    expect(await screen.findByText('No se pudo conectar con el servidor')).toBeTruthy()
  })
})
