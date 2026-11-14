import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './Navbar.jsx'
import { SesionProvider } from '../context/SesionProvider.jsx'
import { backend, iniciarSesion, instalarBackend } from '../test/backendFalso.js'

function UbicacionActual() {
  const { pathname, search } = useLocation()
  return <p data-testid="ubicacion">{pathname + search}</p>
}

function renderNavbar(props) {
  return render(
    <MemoryRouter>
      <SesionProvider>
        <Navbar {...props} />
        <Routes>
          <Route path="*" element={<UbicacionActual />} />
        </Routes>
      </SesionProvider>
    </MemoryRouter>,
  )
}

describe('Navbar', () => {
  beforeEach(() => instalarBackend())

  it('muestra los enlaces del menú', () => {
    renderNavbar()
    for (const texto of ['Home', 'Productos', 'Ofertas', 'Nosotros', 'Blog', 'Contacto']) {
      expect(screen.getByRole('link', { name: texto })).toBeTruthy()
    }
  })

  it('muestra las categorías del backend en el menú', async () => {
    renderNavbar()
    await screen.findByRole('link', { name: 'Audio' })
    for (const c of backend.categorias) {
      expect(screen.getByRole('link', { name: c.nombre })).toBeTruthy()
    }
  })

  it('muestra el total del carrito recibido por props', () => {
    renderNavbar({ totalCarrito: 28775 })
    expect(screen.getByRole('link', { name: /Carrito \$28\.775/ })).toBeTruthy()
  })

  it('muestra $0 en el carrito si no recibe total', () => {
    renderNavbar()
    expect(screen.getByRole('link', { name: /Carrito \$0/ })).toBeTruthy()
  })

  it('al buscar navega a productos con el texto', () => {
    renderNavbar()
    const input = screen.getByRole('searchbox', { name: 'Buscar productos' })
    fireEvent.change(input, { target: { value: 'notebook asus' } })
    expect(input.value).toBe('notebook asus')
    fireEvent.click(screen.getByRole('button', { name: 'Buscar' }))
    expect(screen.getByTestId('ubicacion').textContent).toBe('/productos?buscar=notebook%20asus')
  })

  it('sin sesión muestra Iniciar sesión y Crear cuenta', () => {
    renderNavbar()
    expect(screen.getByRole('link', { name: 'Iniciar sesión' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Crear cuenta' })).toBeTruthy()
    expect(screen.queryByRole('button', { name: 'Cerrar sesión' })).toBeNull()
  })

  it('con sesión de admin muestra el nombre, Panel y Cerrar sesión', () => {
    iniciarSesion('admin@zthorken.cl')
    renderNavbar()
    expect(screen.getByText('Hola, Admin')).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Panel' })).toBeTruthy()
    expect(screen.queryByRole('link', { name: 'Iniciar sesión' })).toBeNull()
  })

  it('el vendedor también ve el enlace al panel', () => {
    iniciarSesion('vendedor@zthorken.cl')
    renderNavbar()
    expect(screen.getByRole('link', { name: 'Panel' })).toBeTruthy()
  })

  it('un cliente no ve el enlace al panel', () => {
    iniciarSesion('pedro@correo.cl')
    renderNavbar()
    expect(screen.getByText('Hola, Pedro')).toBeTruthy()
    expect(screen.queryByRole('link', { name: 'Panel' })).toBeNull()
  })

  it('al cerrar sesión vuelve a mostrar Iniciar sesión', () => {
    iniciarSesion('pedro@correo.cl')
    renderNavbar()
    fireEvent.click(screen.getByRole('button', { name: 'Cerrar sesión' }))
    expect(screen.getByRole('link', { name: 'Iniciar sesión' })).toBeTruthy()
    expect(screen.getByTestId('ubicacion').textContent).toBe('/')
  })
})
