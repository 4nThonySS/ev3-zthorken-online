import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getAll, getById, create, update } from '../../data/db.js'
import { useSesion } from '../../context/sesion.js'
import { esCorreoValido } from '../../utils/validaciones.js'

const VACIO = { nombre: '', apellidos: '', correo: '', password: '', rol: 'cliente', calle: '', departamento: '', region: '', comuna: '' }

const campos = [
  { name: 'nombre', label: 'Nombre', type: 'text', col: 'col-md-6' },
  { name: 'apellidos', label: 'Apellidos', type: 'text', col: 'col-md-6' },
  { name: 'correo', label: 'Correo', type: 'email', col: 'col-md-6' },
  { name: 'password', label: 'Contraseña', type: 'password', col: 'col-md-6' },
  { name: 'calle', label: 'Calle (opcional)', type: 'text', col: 'col-md-8' },
  { name: 'departamento', label: 'Departamento (opcional)', type: 'text', col: 'col-md-4' },
  { name: 'region', label: 'Región (opcional)', type: 'text', col: 'col-md-6' },
  { name: 'comuna', label: 'Comuna (opcional)', type: 'text', col: 'col-md-6' },
]

// Al editar, la contraseña vacía significa "no cambiarla"
function validar(form, id) {
  const errores = {}
  const correo = form.correo.trim().toLowerCase()
  if (!form.nombre.trim()) errores.nombre = 'Ingresa el nombre'
  if (!form.apellidos.trim()) errores.apellidos = 'Ingresa los apellidos'
  if (!correo) errores.correo = 'Ingresa el correo'
  else if (!esCorreoValido(correo)) errores.correo = 'El correo no es válido'
  else if (getAll('usuarios').some((u) => u.correo.toLowerCase() === correo && u.id !== Number(id))) {
    errores.correo = 'Ya existe una cuenta con ese correo'
  }
  if ((!id || form.password) && form.password.length < 6) errores.password = 'La contraseña debe tener al menos 6 caracteres'
  return errores
}

// Sirve para crear (/admin/usuarios/nuevo) y para editar (/admin/usuarios/:id/editar)
function UsuarioForm() {
  const { id } = useParams()
  const existente = id ? getById('usuarios', id) : null
  const [form, setForm] = useState(() => (existente ? { ...VACIO, ...existente, password: '' } : VACIO))
  const [errores, setErrores] = useState({})
  const navigate = useNavigate()
  const { usuario: actual } = useSesion()
  // El admin no puede quitarse su propio rol
  const esUnoMismo = existente?.id === actual?.id

  if (id && !existente) {
    return (
      <>
        <p>El usuario no existe.</p>
        <Link to="/admin/usuarios">Volver a usuarios</Link>
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

    const datos = Object.fromEntries(Object.keys(VACIO).map((k) => [k, form[k].trim()]))
    datos.correo = datos.correo.toLowerCase()
    datos.password = form.password
    if (!datos.password) delete datos.password

    if (id) update('usuarios', id, datos)
    else create('usuarios', datos)
    navigate('/admin/usuarios')
  }

  return (
    <>
      <h1 className="h3 mb-4">{id ? 'Editar usuario' : 'Nuevo usuario'}</h1>

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
                placeholder={c.name === 'password' && id ? 'Déjala vacía para no cambiarla' : undefined}
              />
              {errores[c.name] && <div className="invalid-feedback">{errores[c.name]}</div>}
            </div>
          ))}

          <div className="col-md-6">
            <label htmlFor="rol" className="form-label">Rol</label>
            <select id="rol" name="rol" className="form-select" value={form.rol} onChange={cambiar} disabled={esUnoMismo}>
              <option value="cliente">Cliente</option>
              <option value="admin">Administrador</option>
            </select>
            {esUnoMismo && <div className="form-text">No puedes cambiar tu propio rol.</div>}
          </div>
        </div>

        <div className="d-flex gap-2 mt-4">
          <button type="submit" className="btn btn-primary">Guardar</button>
          <Link className="btn btn-outline-secondary" to="/admin/usuarios">Cancelar</Link>
        </div>
      </form>
    </>
  )
}

export default UsuarioForm
