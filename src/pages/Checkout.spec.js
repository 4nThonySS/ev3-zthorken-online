import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from '../context/CartContext.jsx'
import { SesionContext } from '../context/sesion.js'
import { backend, instalarBackend, iniciarSesion, hasta } from '../test/backendFalso.js'
import Checkout from './Checkout.jsx'

const ITEM = { productoId: 5, nombre: 'Audífonos HyperX Cloud II', precio: 59990, imagen: '/img/productos/audifonos-hyperx.jpg', cantidad: 1 }
const PEDRO = {
  id: 3, nombre: 'Pedro', apellidos: 'Pérez', correo: 'pedro@correo.cl', rol: 'CLIENTE',
  calle: 'Los Crisantemos 123', departamento: 'Depto 603',
  region: 'Región Metropolitana de Santiago', comuna: 'Cerrillos',
}

const montar = (usuario = null, actualizarPerfil = undefined) =>
  render(
    <MemoryRouter initialEntries={['/checkout']}>
      <SesionContext.Provider value={{ usuario, actualizarPerfil }}>
        <CartProvider>
          <Routes>
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/pago-exitoso/:id" element={<p>Pago exitoso</p>} />
            <Route path="/pago-error" element={<p>Pago con error</p>} />
          </Routes>
        </CartProvider>
      </SesionContext.Provider>
    </MemoryRouter>
  )

describe('Checkout', () => {
  beforeEach(() => {
    localStorage.clear()
    instalarBackend()
    localStorage.setItem('zthorken_carrito', JSON.stringify([ITEM]))
  })

it('muestra errores si se paga con el formulario vacío', () => {
  montar()
  fireEvent.click(screen.getByText(/^Pagar/))
  expect(screen.getByText('Ingresa tu nombre')).toBeTruthy()
  expect(screen.getAllByText('Selecciona una región').length).toBe(2)
})

  it('autocompleta los datos si hay sesión', () => {
    montar(PEDRO)
    expect(screen.getByDisplayValue('Pedro')).toBeTruthy()
    expect(screen.getByDisplayValue('Los Crisantemos 123')).toBeTruthy()
    expect(screen.getByDisplayValue('Cerrillos')).toBeTruthy()
  })

  it('muestra mensaje si el carrito está vacío', () => {
    localStorage.setItem('zthorken_carrito', '[]')
    montar()
    expect(screen.getByText('No tienes productos en el carrito.')).toBeTruthy()
  })

  it('con datos válidos crea la boleta en el backend y vacía el carrito', async () => {
    iniciarSesion('pedro@correo.cl')
    const stockAntes = backend.productos[4].stock
    montar(PEDRO)
    fireEvent.click(screen.getByText(/^Pagar/))
    expect(await screen.findByText('Pago exitoso')).toBeTruthy()
    expect(backend.boletas.length).toBe(2)
    expect(backend.boletas[0].usuarioId).toBe(3)
    expect(backend.boletas[0].items).toEqual([jasmine.objectContaining({ productoId: 5, cantidad: 1 })])
    expect(backend.productos[4].stock).toBe(stockAntes - 1)
    expect(JSON.parse(localStorage.getItem('zthorken_carrito'))).toEqual([])
  })

  it('un invitado también puede comprar', async () => {
    montar()
    fireEvent.change(screen.getByLabelText('Nombre'), { target: { name: 'nombre', value: 'Ana' } })
    fireEvent.change(screen.getByLabelText('Apellidos'), { target: { name: 'apellidos', value: 'Rojas' } })
    fireEvent.change(screen.getByLabelText('Correo'), { target: { name: 'correo', value: 'ana@correo.cl' } })
    fireEvent.change(screen.getByLabelText('Calle y número'), { target: { name: 'calle', value: 'Calle 1' } })
    fireEvent.change(screen.getByLabelText('Región'), { target: { name: 'region', value: 'Región Metropolitana de Santiago' } })
    fireEvent.change(screen.getByLabelText('Comuna'), { target: { name: 'comuna', value: 'Cerrillos' } })
    fireEvent.click(screen.getByText(/^Pagar/))
    expect(await screen.findByText('Pago exitoso')).toBeTruthy()
    expect(backend.boletas[0].usuarioId).toBeNull()
  })

  it('si el backend rechaza por stock va a la página de error y mantiene el carrito', async () => {
    localStorage.setItem('zthorken_carrito', JSON.stringify([{ ...ITEM, cantidad: 9999 }]))
    montar(PEDRO)
    fireEvent.click(screen.getByText(/^Pagar/))
    expect(await screen.findByText('Pago con error')).toBeTruthy()
    expect(JSON.parse(localStorage.getItem('zthorken_carrito')).length).toBe(1)
  })

  it('no ofrece guardar los datos si el usuario no cambió nada', () => {
    montar(PEDRO)
    expect(screen.queryByLabelText(/Guardar estos datos/)).toBeNull()
  })

  it('invita a iniciar sesión o registrarse si no hay sesión', () => {
    montar()
    expect(screen.getByText('Inicia sesión')).toBeTruthy()
    expect(screen.queryByLabelText(/Guardar estos datos/)).toBeNull()
  })

  it('si la cuenta no tiene dirección, ofrece guardar con la casilla marcada y guarda al pagar', async () => {
    const NUEVO = { ...PEDRO, id: 3, calle: '', departamento: '', region: '', comuna: '' }
    const actualizarPerfil = jasmine.createSpy('actualizarPerfil')
    montar(NUEVO, actualizarPerfil)
    fireEvent.change(screen.getByLabelText('Calle y número'), { target: { name: 'calle', value: 'Av. Siempre Viva 742' } })
    fireEvent.change(screen.getByLabelText('Región'), { target: { name: 'region', value: 'Región Metropolitana de Santiago' } })
    fireEvent.change(screen.getByLabelText('Comuna'), { target: { name: 'comuna', value: 'Cerrillos' } })
    expect(screen.getByLabelText(/Guardar estos datos/).checked).toBeTrue()
    fireEvent.click(screen.getByText(/^Pagar/))
    await hasta(() => actualizarPerfil.calls.any())
    expect(actualizarPerfil).toHaveBeenCalledWith(jasmine.objectContaining({ calle: 'Av. Siempre Viva 742', comuna: 'Cerrillos' }))
  })

  it('no guarda los datos si se desmarca la casilla', async () => {
    const NUEVO = { ...PEDRO, id: 3, calle: '', departamento: '', region: '', comuna: '' }
    const actualizarPerfil = jasmine.createSpy('actualizarPerfil')
    montar(NUEVO, actualizarPerfil)
    fireEvent.change(screen.getByLabelText('Calle y número'), { target: { name: 'calle', value: 'Av. Siempre Viva 742' } })
    fireEvent.change(screen.getByLabelText('Región'), { target: { name: 'region', value: 'Región Metropolitana de Santiago' } })
    fireEvent.change(screen.getByLabelText('Comuna'), { target: { name: 'comuna', value: 'Cerrillos' } })
    fireEvent.click(screen.getByLabelText(/Guardar estos datos/))
    fireEvent.click(screen.getByText(/^Pagar/))
    expect(await screen.findByText('Pago exitoso')).toBeTruthy()
    expect(actualizarPerfil).not.toHaveBeenCalled()
  })
})