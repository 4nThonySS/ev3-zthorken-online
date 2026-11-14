import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { api, useApi, Estado } from '../../api.jsx'
import { img } from '../../utils/formato.js'

// El nombre repetido lo revisa el backend
function validar(form) {
  const errores = {}
  const nombre = form.nombre.trim()
  if (!nombre) errores.nombre = 'Ingresa el nombre'
  else if (nombre.length > 50) errores.nombre = 'El nombre no puede tener más de 50 caracteres'
  return errores
}

// Sirve para crear (/admin/categorias/nueva) y para editar (/admin/categorias/:id/editar)
function CategoriaForm() {
  const { id } = useParams()
  const { datos, error } = useApi(id ? `/categorias/${id}` : null)

  if (error?.status === 404 || error?.status === 400) {
    return (
      <>
        <p>La categoría no existe.</p>
        <Link to="/admin/categorias">Volver a categorías</Link>
      </>
    )
  }
  if (id && !datos) return <Estado error={error} />
  return <Formulario key={id ?? 'nueva'} id={id} existente={datos} />
}

function Formulario({ id, existente }) {
  const [form, setForm] = useState({ nombre: existente?.nombre ?? '', imagen: existente?.imagen ?? '' })
  const [errores, setErrores] = useState({})
  const navigate = useNavigate()

  function cambiar(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function enviar(e) {
    e.preventDefault()
    const nuevosErrores = validar(form)
    setErrores(nuevosErrores)
    if (Object.keys(nuevosErrores).length > 0) return

    const datos = { nombre: form.nombre.trim(), imagen: form.imagen.trim() || img(form.nombre.trim()) }
    try {
      if (id) await api(`/categorias/${id}`, { method: 'PUT', body: datos })
      else await api('/categorias', { method: 'POST', body: datos })
      navigate('/admin/categorias')
    } catch (e) {
      setErrores({ nombre: e.campos.nombre ?? e.message })
    }
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
