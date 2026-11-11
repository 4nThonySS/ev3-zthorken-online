import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useSesion } from '../context/sesion.js'
import { esCorreoValido } from '../utils/validaciones.js'

function validar({ correo, password }) {
  const errores = {}
  if (!correo.trim()) errores.correo = 'Ingresa tu correo'
  else if (!esCorreoValido(correo)) errores.correo = 'El correo no es válido'
  if (!password) errores.password = 'Ingresa tu contraseña'
  return errores
}

function Login() {
  const [form, setForm] = useState({ correo: '', password: '' })
  const [errores, setErrores] = useState({})
  const [errorLogin, setErrorLogin] = useState('')
  const { usuario, login } = useSesion()
  const navigate = useNavigate()

  if (usuario) return <Navigate to="/" replace />

  function cambiar(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function enviar(e) {
    e.preventDefault()
    const nuevosErrores = validar(form)
    setErrores(nuevosErrores)
    setErrorLogin('')
    if (Object.keys(nuevosErrores).length > 0) return

    const respuesta = login(form.correo, form.password)
    if (respuesta.ok) navigate('/')
    else setErrorLogin(respuesta.error)
  }

  return (
    <main className="container py-5">
      <div className="row justify-content-center">
        <div className="col-sm-10 col-md-7 col-lg-5">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h1 className="h3 mb-4 text-center">Iniciar sesión</h1>

              {errorLogin && <div className="alert alert-danger" role="alert">{errorLogin}</div>}

              <form onSubmit={enviar} noValidate>
                <div className="mb-3">
                  <label htmlFor="correo" className="form-label">Correo</label>
                  <input
                    id="correo"
                    name="correo"
                    type="email"
                    className={`form-control ${errores.correo ? 'is-invalid' : ''}`}
                    value={form.correo}
                    onChange={cambiar}
                  />
                  {errores.correo && <div className="invalid-feedback">{errores.correo}</div>}
                </div>

                <div className="mb-4">
                  <label htmlFor="password" className="form-label">Contraseña</label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    className={`form-control ${errores.password ? 'is-invalid' : ''}`}
                    value={form.password}
                    onChange={cambiar}
                  />
                  {errores.password && <div className="invalid-feedback">{errores.password}</div>}
                </div>

                <button type="submit" className="btn btn-primary w-100">Ingresar</button>
              </form>

              <p className="text-center mt-3 mb-0">
                ¿No tienes cuenta? <Link to="/registro">Regístrate</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Login
