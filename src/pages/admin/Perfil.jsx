import { useState } from 'react'
import { useSesion } from '../../context/sesion.js'
import { esCorreoValido } from '../../utils/validaciones.js'

const campos = [
  { name: 'nombre', label: 'Nombre', type: 'text', col: 'col-md-6' },
  { name: 'apellidos', label: 'Apellidos', type: 'text', col: 'col-md-6' },
  { name: 'correo', label: 'Correo', type: 'email', col: 'col-12' },
  { name: 'password', label: 'Nueva contraseña (opcional)', type: 'password', col: 'col-md-6' },
  { name: 'confirmar', label: 'Confirmar contraseña', type: 'password', col: 'col-md-6' },
]

function validar(form) {
  const errores = {}
  if (!form.nombre.trim()) errores.nombre = 'Ingresa tu nombre'
  if (!form.apellidos.trim()) errores.apellidos = 'Ingresa tus apellidos'
  if (!form.correo.trim()) errores.correo = 'Ingresa tu correo'
  else if (!esCorreoValido(form.correo)) errores.correo = 'El correo no es válido'
  if (form.password && form.password.length < 6) errores.password = 'La contraseña debe tener al menos 6 caracteres'
  if (form.confirmar !== form.password) errores.confirmar = 'Las contraseñas no coinciden'
  return errores
}

function Perfil() {
  const { usuario, actualizarPerfil } = useSesion()
  const [form, setForm] = useState({ nombre: usuario.nombre, apellidos: usuario.apellidos, correo: usuario.correo, password: '', confirmar: '' })
  const [errores, setErrores] = useState({})
  const [mensaje, setMensaje] = useState(null)

  function cambiar(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function enviar(e) {
    e.preventDefault()
    const nuevosErrores = validar(form)
    setErrores(nuevosErrores)
    setMensaje(null)
    if (Object.keys(nuevosErrores).length > 0) return

    // La contraseña solo se cambia si se escribió una nueva
    const cambios = { nombre: form.nombre.trim(), apellidos: form.apellidos.trim(), correo: form.correo }
    if (form.password) cambios.password = form.password

    const respuesta = actualizarPerfil(cambios)
    if (respuesta.ok) {
      setMensaje({ tipo: 'success', texto: 'Perfil actualizado' })
      setForm({ ...form, password: '', confirmar: '' })
    } else {
      setMensaje({ tipo: 'danger', texto: respuesta.error })
    }
  }

  return (
    <>
      <h1 className="h3 mb-4">Mi perfil</h1>

      {mensaje && <div className={`alert alert-${mensaje.tipo}`} role="alert">{mensaje.texto}</div>}

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
            </div>
          ))}
        </div>

        <button type="submit" className="btn btn-primary mt-4">Guardar cambios</button>
      </form>
    </>
  )
}

export default Perfil
