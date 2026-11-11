import { useState } from 'react'
import { useSesion } from '../context/sesion.js'
import { create } from '../data/db.js'
import { esCorreoValido } from '../utils/validaciones.js'

const MAX_MENSAJE = 500

function validar({ nombre, correo, mensaje }) {
  const errores = {}
  if (!nombre.trim()) errores.nombre = 'Ingresa tu nombre'
  if (!correo.trim()) errores.correo = 'Ingresa tu correo'
  else if (!esCorreoValido(correo)) errores.correo = 'El correo no es válido'
  if (mensaje.trim().length < 10) errores.mensaje = 'El mensaje debe tener al menos 10 caracteres'
  return errores
}

function Contacto() {
  const { usuario } = useSesion()
  // Si hay sesión iniciada, el nombre y el correo se llenan solos
  const formInicial = {
    nombre: usuario ? `${usuario.nombre} ${usuario.apellidos}` : '',
    correo: usuario?.correo ?? '',
    mensaje: '',
  }
  const [form, setForm] = useState(formInicial)
  const [errores, setErrores] = useState({})
  const [enviado, setEnviado] = useState(false)

  function cambiar(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
    setEnviado(false)
  }

  function enviar(e) {
    e.preventDefault()
    const nuevosErrores = validar(form)
    setErrores(nuevosErrores)
    if (Object.keys(nuevosErrores).length > 0) return

    create('mensajes', {
      nombre: form.nombre.trim(),
      correo: form.correo.trim().toLowerCase(),
      mensaje: form.mensaje.trim(),
      fecha: new Date().toISOString(),
    })
    setForm(formInicial)
    setEnviado(true)
  }

  return (
    <main className="container py-5">
      <h1 className="mb-4">Contacto</h1>

      <div className="row g-4">
        <div className="col-lg-7">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              {enviado && (
                <div className="alert alert-success" role="status">
                  ¡Gracias por escribirnos! Te responderemos a la brevedad.
                </div>
              )}

              <form onSubmit={enviar} noValidate>
                <div className="mb-3">
                  <label htmlFor="nombre" className="form-label">Nombre</label>
                  <input
                    id="nombre"
                    name="nombre"
                    className={`form-control ${errores.nombre ? 'is-invalid' : ''}`}
                    value={form.nombre}
                    onChange={cambiar}
                  />
                  {errores.nombre && <div className="invalid-feedback">{errores.nombre}</div>}
                </div>

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

                <div className="mb-3">
                  <label htmlFor="mensaje" className="form-label">Mensaje</label>
                  <textarea
                    id="mensaje"
                    name="mensaje"
                    rows="5"
                    maxLength={MAX_MENSAJE}
                    className={`form-control ${errores.mensaje ? 'is-invalid' : ''}`}
                    value={form.mensaje}
                    onChange={cambiar}
                  />
                  {errores.mensaje && <div className="invalid-feedback">{errores.mensaje}</div>}
                  <div className="form-text text-end">{form.mensaje.length}/{MAX_MENSAJE}</div>
                </div>

                <button type="submit" className="btn btn-primary">Enviar mensaje</button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="card bg-light border-0 h-100">
            <div className="card-body p-4">
              <h2 className="h5 mb-3">Información de contacto</h2>
              <dl className="mb-0">
                <dt>Correo</dt>
                <dd>contacto@zthorken.cl</dd>
                <dt>Teléfono</dt>
                <dd>+56 2 2345 6789</dd>
                <dt>Dirección</dt>
                <dd>Av. Providencia 1234, Santiago</dd>
                <dt>Horario de atención</dt>
                <dd className="mb-0">Lunes a viernes, 9:00 a 18:00</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Contacto
