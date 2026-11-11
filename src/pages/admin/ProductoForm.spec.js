import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import ProductoForm from './ProductoForm.jsx'
import { getAll, getById, resetDB } from '../../data/db.js'

function renderForm(ruta = '/admin/productos/nuevo') {
  return render(
    <MemoryRouter initialEntries={[ruta]}>
      <Routes>
        <Route path="/admin/productos/nuevo" element={<ProductoForm />} />
        <Route path="/admin/productos/:id/editar" element={<ProductoForm />} />
        <Route path="/admin/productos" element={<p>Listado de productos</p>} />
      </Routes>
    </MemoryRouter>,
  )
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
  beforeEach(() => resetDB())

  it('actualiza el estado del formulario al escribir', () => {
    renderForm()
    escribir('Nombre', 'Mouse Pad XL')
    escribir('Categoría', '4')
    expect(screen.getByLabelText('Nombre').value).toBe('Mouse Pad XL')
    expect(screen.getByLabelText('Categoría').value).toBe('4')
  })

  it('muestra errores si se envía vacío y no guarda', () => {
    renderForm()
    guardar()
    expect(screen.getByText('Ingresa el nombre')).toBeTruthy()
    expect(screen.getByText('El precio debe ser un número entero mayor a 0')).toBeTruthy()
    expect(screen.getByText('El stock debe ser un número entero de 0 o más')).toBeTruthy()
    expect(screen.getByText('Selecciona una categoría')).toBeTruthy()
    expect(getAll('productos').length).toBe(12)
  })

  it('no acepta un precio de 0', () => {
    renderForm()
    llenarValido()
    escribir('Precio', '0')
    guardar()
    expect(screen.getByText('El precio debe ser un número entero mayor a 0')).toBeTruthy()
  })

  it('no acepta una oferta mayor o igual al precio', () => {
    renderForm()
    llenarValido()
    escribir('Precio oferta (opcional)', '19990')
    guardar()
    expect(screen.getByText('La oferta debe ser mayor a 0 y menor al precio')).toBeTruthy()
  })

  it('crea un producto y vuelve al listado', () => {
    renderForm()
    llenarValido()
    escribir('Precio oferta (opcional)', '14990')
    guardar()
    expect(screen.getByText('Listado de productos')).toBeTruthy()
    const nuevo = getById('productos', 13)
    expect(nuevo.nombre).toBe('Mouse Pad XL')
    expect(nuevo.precio).toBe(19990)
    expect(nuevo.precioOferta).toBe(14990)
    expect(nuevo.categoriaId).toBe(4)
    expect(nuevo.imagen).toContain('placehold.co')
  })

  it('sin oferta guarda precioOferta en null', () => {
    renderForm()
    llenarValido()
    guardar()
    expect(getById('productos', 13).precioOferta).toBeNull()
  })

  it('al editar carga los datos del producto', () => {
    renderForm('/admin/productos/5/editar')
    expect(screen.getByRole('heading', { name: 'Editar producto' })).toBeTruthy()
    expect(screen.getByLabelText('Nombre').value).toBe('Audífonos HyperX Cloud II')
    expect(screen.getByLabelText('Precio').value).toBe('79990')
    expect(screen.getByLabelText('Categoría').value).toBe('3')
  })

  it('edita un producto sin crear uno nuevo', () => {
    renderForm('/admin/productos/5/editar')
    escribir('Stock', '50')
    guardar()
    expect(getById('productos', 5).stock).toBe(50)
    expect(getAll('productos').length).toBe(12)
  })

  it('avisa si el producto no existe', () => {
    renderForm('/admin/productos/999/editar')
    expect(screen.getByText('El producto no existe.')).toBeTruthy()
  })

  it('muestra la vista previa de la imagen', () => {
    renderForm()
    expect(screen.queryByAltText('Vista previa')).toBeNull()
    escribir('URL de la imagen (opcional)', 'https://ejemplo.cl/foto.jpg')
    expect(screen.getByAltText('Vista previa').getAttribute('src')).toBe('https://ejemplo.cl/foto.jpg')
  })
})
