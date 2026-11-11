import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useSesion } from '../context/sesion.js'
import { esCorreoValido } from '../utils/validaciones.js'

const campos = [
  { name: 'nombre', label: 'Nombre', type: 'text', col: 'col-md-6' },
  { name: 'apellidos', label: 'Apellidos', type: 'text', col: 'col-md-6' },
  { name: 'correo', label: 'Correo', type: 'email', col: 'col-12' },
  { name: 'password', label: 'Contraseña', type: 'password', col: 'col-md-6' },
  { name: 'confirmar', label: 'Confirmar contraseña', type: 'password', col: 'col-md-6' },
]

function validar(form) {
  const errores = {}
  if (!form.nombre.trim()) errores.nombre = 'Ingresa tu nombre'
  if (!form.apellidos.trim()) errores.apellidos = 'Ingresa tus apellidos'
  if (!form.correo.trim()) errores.correo = 'Ingresa tu correo'
  else if (!esCorreoValido(form.correo)) errores.correo = 'El correo no es válido'
  if (form.password.length < 6) errores.password = 'La contraseña debe tener al menos 6 caracteres'
  if (form.confirmar !== form.password) errores.confirmar = 'Las contraseñas no coinciden'
  return errores
}

function Registro() {
  const [form, setForm] = useState({ nombre: '', apellidos: '', correo: '', password: '', confirmar: '' })
  const [errores, setErrores] = useState({})
  const [errorRegistro, setErrorRegistro] = useState('')
  const { usuario, registrar } = useSesion()
  const navigate = useNavigate()

  if (usuario) return <Navigate to="/" replace />

  function cambiar(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function enviar(e) {
    e.preventDefault()
    const nuevosErrores = validar(form)
    setErrores(nuevosErrores)
    setErrorRegistro('')
    if (Object.keys(nuevosErrores).length > 0) return

    const { confirmar: _confirmar, ...datos } = form
    const respuesta = registrar({ ...datos, nombre: datos.nombre.trim(), apellidos: datos.apellidos.trim() })
    if (respuesta.ok) navigate('/')
    else setErrorRegistro(respuesta.error)
  }

  return (
    <main className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-10 col-lg-7">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h1 className="h3 mb-4 text-center">Crear cuenta</h1>

              {errorRegistro && <div className="alert alert-danger" role="alert">{errorRegistro}</div>}

              <form onSubmit={enviar} noValidate>
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

                <button type="submit" className="btn btn-primary w-100 mt-4">Crear cuenta</button>
              </form>

              <p className="text-center mt-3 mb-0">
                ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Registro
