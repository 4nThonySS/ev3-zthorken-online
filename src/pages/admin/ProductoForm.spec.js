import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import ProductoForm from './ProductoForm.jsx'
import { backend, instalarBackend } from '../../test/backendFalso.js'

// Monta el formulario y espera a que carguen las categorías (y el producto si se edita)
async function renderForm(ruta = '/admin/productos/nuevo') {
  render(
    <MemoryRouter initialEntries={[ruta]}>
      <Routes>
        <Route path="/admin/productos/nuevo" element={<ProductoForm />} />
        <Route path="/admin/productos/:id/editar" element={<ProductoForm />} />
        <Route path="/admin/productos" element={<p>Listado de productos</p>} />
      </Routes>
    </MemoryRouter>,
  )
  if (!ruta.includes('999')) await screen.findByRole('button', { name: 'Guardar' })
}

function escribir(label, valor) {
  fireEvent.change(screen.getByLabelText(label), { target: { value: valor } })
}

function guardar() {
  fireEvent.click(screen.getByRole('button', { name: 'Guardar' }))
}

function llenarValido() {
  escribir('Nombre', 'Mouse Pad XL')
  escribir('Precio', '19990')
  escribir('Stock', '10')
  escribir('Stock crítico', '2')
  escribir('Categoría', '4')
}

describe('ProductoForm', () => {
  beforeEach(() => instalarBackend())

  it('actualiza el estado del formulario al escribir', async () => {
    await renderForm()
    escribir('Nombre', 'Mouse Pad XL')
    escribir('Categoría', '4')
    expect(screen.getByLabelText('Nombre').value).toBe('Mouse Pad XL')
    expect(screen.getByLabelText('Categoría').value).toBe('4')
  })

  it('muestra errores si se envía vacío y no llama al backend', async () => {
    await renderForm()
    guardar()
    expect(screen.getByText('Ingresa el nombre')).toBeTruthy()
    expect(screen.getByText('El precio debe ser un número entero mayor a 0')).toBeTruthy()
    expect(screen.getByText('El stock debe ser un número entero de 0 o más')).toBeTruthy()
    expect(screen.getByText('Selecciona una categoría')).toBeTruthy()
    expect(backend.peticiones).not.toContain('POST /productos')
  })

  it('no acepta un precio de 0', async () => {
    await renderForm()
    llenarValido()
    escribir('Precio', '0')
    guardar()
    expect(screen.getByText('El precio debe ser un número entero mayor a 0')).toBeTruthy()
  })

  it('no acepta una oferta mayor o igual al precio', async () => {
    await renderForm()
    llenarValido()
    escribir('Precio oferta (opcional)', '19990')
    guardar()
    expect(screen.getByText('La oferta debe ser mayor a 0 y menor al precio')).toBeTruthy()
  })

  it('crea un producto en el backend y vuelve al listado', async () => {
    await renderForm()
    llenarValido()
    escribir('Precio oferta (opcional)', '14990')
    guardar()
    expect(await screen.findByText('Listado de productos')).toBeTruthy()
    const nuevo = backend.productos.find((p) => p.id === 13)
    expect(nuevo.nombre).toBe('Mouse Pad XL')
    expect(nuevo.precio).toBe(19990)
    expect(nuevo.precioOferta).toBe(14990)
    expect(nuevo.categoriaId).toBe(4)
    expect(nuevo.imagen).toContain('placehold.co')
  })

  it('sin oferta guarda precioOferta en null', async () => {
    await renderForm()
    llenarValido()
    guardar()
    await screen.findByText('Listado de productos')
    expect(backend.productos.find((p) => p.id === 13).precioOferta).toBeNull()
  })

  it('al editar carga los datos del producto desde el backend', async () => {
    await renderForm('/admin/productos/5/editar')
    expect(screen.getByRole('heading', { name: 'Editar producto' })).toBeTruthy()
    expect(screen.getByLabelText('Nombre').value).toBe('Audífonos HyperX Cloud II')
    expect(screen.getByLabelText('Precio').value).toBe('79990')
    expect(screen.getByLabelText('Categoría').value).toBe('3')
  })

  it('edita un producto sin crear uno nuevo', async () => {
    await renderForm('/admin/productos/5/editar')
    escribir('Stock', '50')
    guardar()
    await screen.findByText('Listado de productos')
    expect(backend.productos.find((p) => p.id === 5).stock).toBe(50)
    expect(backend.productos.length).toBe(12)
  })

  it('muestra el error del backend si rechaza los datos', async () => {
    window.fetch.and.callFake((url, opciones) =>
      opciones?.method === 'POST'
        ? Promise.resolve(new Response(JSON.stringify({ mensaje: 'Datos inválidos', campos: { nombre: 'El nombre no puede superar 150 caracteres' } }), { status: 400 }))
        : Promise.resolve(new Response(JSON.stringify(backend.categorias), { status: 200 })))
    await renderForm()
    llenarValido()
    guardar()
    expect((await screen.findByRole('alert')).textContent).toBe('Datos inválidos')
    expect(screen.getByText('El nombre no puede superar 150 caracteres')).toBeTruthy()
  })

  it('avisa si el producto no existe', async () => {
    await renderForm('/admin/productos/999/editar')
    expect(await screen.findByText('El producto no existe.')).toBeTruthy()
  })

  it('muestra la vista previa de la imagen', async () => {
    await renderForm()
    expect(screen.queryByAltText('Vista previa')).toBeNull()
    escribir('URL de la imagen (opcional)', 'https://ejemplo.cl/foto.jpg')
    expect(screen.getByAltText('Vista previa').getAttribute('src')).toBe('https://ejemplo.cl/foto.jpg')
  })
})
