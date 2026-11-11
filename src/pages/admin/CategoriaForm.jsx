import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getAll, getById, create, update, img } from '../../data/db.js'

function validar(form, id) {
  const errores = {}
  const nombre = form.nombre.trim()
  const repetida = getAll('categorias').some((c) => c.nombre.toLowerCase() === nombre.toLowerCase() && c.id !== Number(id))
  if (!nombre) errores.nombre = 'Ingresa el nombre'
  else if (nombre.length > 50) errores.nombre = 'El nombre no puede tener más de 50 caracteres'
  else if (repetida) errores.nombre = 'Ya existe una categoría con ese nombre'
  return errores
}

// Sirve para crear (/admin/categorias/nueva) y para editar (/admin/categorias/:id/editar)
function CategoriaForm() {
  const { id } = useParams()
  const existente = id ? getById('categorias', id) : null
  const [form, setForm] = useState({ nombre: existente?.nombre ?? '', imagen: existente?.imagen ?? '' })
  const [errores, setErrores] = useState({})
  const navigate = useNavigate()

  if (id && !existente) {
    return (
      <>
        <p>La categoría no existe.</p>
        <Link to="/admin/categorias">Volver a categorías</Link>
      </>
    )
  }

  function cambiar(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function enviar(e) {
    e.preventDefault()
    const nuevosErrores = validar(form, id)
    setErrores(nuevosErrores)
    if (Object.keys(nuevosErrores).length > 0) return

    const datos = { nombre: form.nombre.trim(), imagen: form.imagen.trim() || img(form.nombre.trim()) }
    if (id) update('categorias', id, datos)
    else create('categorias', datos)
    navigate('/admin/categorias')
  }

  return (
    <>
      <h1 className="h3 mb-4">{id ? 'Editar categoría' : 'Nueva categoría'}</h1>

      <form onSubmit={enviar} noValidate style={{ maxWidth: 480 }}>
        <div className="mb-3">
          <label htmlFor="nombre" className="form-label">Nombre</label>
          <input
            id="nombre"
            name="nombre"
            type="text"
            className={`form-control ${errores.nombre ? 'is-invalid' : ''}`}
            value={form.nombre}
            onChange={cambiar}
          />
          {errores.nombre && <div className="invalid-feedback">{errores.nombre}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="imagen" className="form-label">URL de la imagen (opcional)</label>
          <input id="imagen" name="imagen" type="url" className="form-control" value={form.imagen} onChange={cambiar} />
          {form.imagen.trim() && (
            <img src={form.imagen.trim()} alt="Vista previa" className="d-block mt-2 rounded border object-fit-cover" style={{ height: 120 }} />
          )}
        </div>

        <div className="d-flex gap-2 mt-4">
          <button type="submit" className="btn btn-primary">Guardar</button>
          <Link className="btn btn-outline-secondary" to="/admin/categorias">Cancelar</Link>
        </div>
      </form>
    </>
  )
}

export default CategoriaForm
