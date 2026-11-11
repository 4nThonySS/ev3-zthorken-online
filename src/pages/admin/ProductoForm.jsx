import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getAll, getById, create, update, img } from '../../data/db.js'

const VACIO = { nombre: '', descripcion: '', precio: '', precioOferta: '', stock: '', stockCritico: '', categoriaId: '', imagen: '' }

const campos = [
  { name: 'nombre', label: 'Nombre', type: 'text', col: 'col-12' },
  { name: 'precio', label: 'Precio', type: 'number', col: 'col-md-6' },
  { name: 'precioOferta', label: 'Precio oferta (opcional)', type: 'number', col: 'col-md-6' },
  { name: 'stock', label: 'Stock', type: 'number', col: 'col-md-6' },
  { name: 'stockCritico', label: 'Stock crítico', type: 'number', col: 'col-md-6' },
  { name: 'imagen', label: 'URL de la imagen (opcional)', type: 'url', col: 'col-12' },
]

const esEntero = (valor) => /^\d+$/.test(valor)

function validar(form) {
  const errores = {}
  if (!form.nombre.trim()) errores.nombre = 'Ingresa el nombre'
  else if (form.nombre.trim().length > 100) errores.nombre = 'El nombre no puede tener más de 100 caracteres'
  if (!esEntero(form.precio) || Number(form.precio) === 0) errores.precio = 'El precio debe ser un número entero mayor a 0'
  if (form.precioOferta && (!esEntero(form.precioOferta) || Number(form.precioOferta) === 0 || Number(form.precioOferta) >= Number(form.precio))) {
    errores.precioOferta = 'La oferta debe ser mayor a 0 y menor al precio'
  }
  if (!esEntero(form.stock)) errores.stock = 'El stock debe ser un número entero de 0 o más'
  if (!esEntero(form.stockCritico)) errores.stockCritico = 'El stock crítico debe ser un número entero de 0 o más'
  if (!form.categoriaId) errores.categoriaId = 'Selecciona una categoría'
  return errores
}

// Sirve para crear (/admin/productos/nuevo) y para editar (/admin/productos/:id/editar)
function ProductoForm() {
  const { id } = useParams()
  const existente = id ? getById('productos', id) : null
  // Los inputs trabajan con texto, por eso se pasan los números a string
  const [form, setForm] = useState(() =>
    existente ? Object.fromEntries(Object.keys(VACIO).map((k) => [k, String(existente[k] ?? '')])) : VACIO,
  )
  const [errores, setErrores] = useState({})
  const navigate = useNavigate()
  const categorias = getAll('categorias')

  if (id && !existente) {
    return (
      <>
        <p>El producto no existe.</p>
        <Link to="/admin/productos">Volver a productos</Link>
      </>
    )
  }

  function cambiar(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function enviar(e) {
    e.preventDefault()
    const nuevosErrores = validar(form)
    setErrores(nuevosErrores)
    if (Object.keys(nuevosErrores).length > 0) return

    const datos = {
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim(),
      precio: Number(form.precio),
      precioOferta: form.precioOferta ? Number(form.precioOferta) : null,
      stock: Number(form.stock),
      stockCritico: Number(form.stockCritico),
      categoriaId: Number(form.categoriaId),
      imagen: form.imagen.trim() || img(form.nombre.trim()),
    }
    if (id) update('productos', id, datos)
    else create('productos', datos)
    navigate('/admin/productos')
  }

  return (
    <>
      <h1 className="h3 mb-4">{id ? 'Editar producto' : 'Nuevo producto'}</h1>

      <form onSubmit={enviar} noValidate style={{ maxWidth: 720 }}>
        <div className="row g-3">
          {campos.map((c) => (
            <div className={c.col} key={c.name}>
              <label htmlFor={c.name} className="form-label">{c.label}</label>
              <input
                id={c.name}
                name={c.name}
                type={c.type}
                className={`form-control ${errores[c.name] ? 'is-invalid' : ''}`}
                value={form[c.name]}
                onChange={cambiar}
              />
              {errores[c.name] && <div className="invalid-feedback">{errores[c.name]}</div>}
              {c.name === 'imagen' && form.imagen.trim() && (
                <img src={form.imagen.trim()} alt="Vista previa" className="d-block mt-2 rounded border object-fit-cover" style={{ height: 120 }} />
              )}
            </div>
          ))}

          <div className="col-12">
            <label htmlFor="categoriaId" className="form-label">Categoría</label>
            <select
              id="categoriaId"
              name="categoriaId"
              className={`form-select ${errores.categoriaId ? 'is-invalid' : ''}`}
              value={form.categoriaId}
              onChange={cambiar}
            >
              <option value="">Elige una categoría</option>
              {categorias.map((c) => (
                <option value={c.id} key={c.id}>{c.nombre}</option>
              ))}
            </select>
            {errores.categoriaId && <div className="invalid-feedback">{errores.categoriaId}</div>}
          </div>

          <div className="col-12">
            <label htmlFor="descripcion" className="form-label">Descripción</label>
            <textarea id="descripcion" name="descripcion" className="form-control" rows="3" value={form.descripcion} onChange={cambiar} />
          </div>
        </div>

        <div className="d-flex gap-2 mt-4">
          <button type="submit" className="btn btn-primary">Guardar</button>
          <Link className="btn btn-outline-secondary" to="/admin/productos">Cancelar</Link>
        </div>
      </form>
    </>
  )
}

export default ProductoForm
