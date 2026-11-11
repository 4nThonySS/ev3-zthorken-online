import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { useSesion } from '../context/sesion.js'
import { REGIONES } from '../data/regiones.js'
import { validarCheckout, procesarPago } from '../utils/checkout.js'
import { formatoCLP } from '../components/ProductCard.jsx'
import AvisoAdmin from '../components/AvisoAdmin.jsx'

export default function Checkout() {
  const { items, total, limpiar } = useCart()
  const { usuario, actualizarPerfil } = useSesion()
  const navigate = useNavigate()

  // Si hay sesión, el formulario parte con los datos del usuario
  const [datos, setDatos] = useState(() => ({
    nombre: usuario?.nombre ?? '',
    apellidos: usuario?.apellidos ?? '',
    correo: usuario?.correo ?? '',
    calle: usuario?.calle ?? '',
    departamento: usuario?.departamento ?? '',
    region: usuario?.region ?? '',
    comuna: usuario?.comuna ?? '',
    indicaciones: '',
  }))
  const [errores, setErrores] = useState({})
  const [avisoAbierto, setAvisoAbierto] = useState(false)
  const esAdmin = usuario?.rol === 'admin'

  // Un usuario con sesión puede guardar estos datos en su cuenta.
  // Se ofrece solo si lo que escribió es distinto de lo que ya tiene guardado.
  const CAMPOS_PERFIL = ['nombre', 'apellidos', 'calle', 'departamento', 'region', 'comuna']
  const hayCambios = !!usuario && CAMPOS_PERFIL.some((c) => datos[c] !== (usuario[c] ?? ''))
  const sinDireccionGuardada = !!usuario && !usuario.calle
  const [guardarDatos, setGuardarDatos] = useState(null)
  // Si la cuenta no tiene dirección, la casilla parte marcada
  const quiereGuardar = guardarDatos ?? sinDireccionGuardada

  const cambiar = (e) => setDatos({ ...datos, [e.target.name]: e.target.value })
  const cambiarRegion = (e) => setDatos({ ...datos, region: e.target.value, comuna: '' })

  const pagar = (e) => {
    e.preventDefault()
    if (esAdmin) {
      setAvisoAbierto(true)
      return
    }
    const nuevos = validarCheckout(datos)
    setErrores(nuevos)
    if (Object.keys(nuevos).length > 0) return

    const { nombre, apellidos, correo, calle, departamento, region, comuna, indicaciones } = datos
    const resultado = procesarPago({
      items,
      total,
      usuarioId: usuario?.id,
      cliente: { nombre, apellidos, correo },
      direccion: { calle, departamento, region, comuna, indicaciones },
    })

    if (!resultado.ok) {
      navigate('/pago-error', { state: { mensaje: resultado.error } })
      return
    }
    if (hayCambios && quiereGuardar && actualizarPerfil) {
      actualizarPerfil({ nombre, apellidos, calle, departamento, region, comuna })
    }
    limpiar()
    navigate(`/pago-exitoso/${resultado.orden.id}`)
  }

  if (items.length === 0) {
    return (
      <div className="container my-4">
        <h1 className="mb-4">Checkout</h1>
        <p className="text-muted">No tienes productos en el carrito.</p>
        <Link to="/productos" className="btn btn-primary">Ver productos</Link>
      </div>
    )
  }

  const campo = (name, label, type = 'text') => (
    <div className="col-md-6">
      <label htmlFor={name} className="form-label">{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        className={`form-control ${errores[name] ? 'is-invalid' : ''}`}
        value={datos[name]}
        onChange={cambiar}
      />
      {errores[name] && <div className="invalid-feedback">{errores[name]}</div>}
    </div>
  )

  return (
    <div className="container my-4">
      <Link to="/carrito" className="btn btn-link ps-0 mb-3">← Volver al carrito</Link>
      <h1 className="mb-4">Checkout</h1>
      <div className="row g-4">
        <div className="col-lg-8">
          <form onSubmit={pagar} noValidate>
            <h5>Datos del cliente</h5>
            <div className="row g-3 mb-4">
              {campo('nombre', 'Nombre')}
              {campo('apellidos', 'Apellidos')}
              {campo('correo', 'Correo', 'email')}
            </div>

            <h5>Dirección de entrega</h5>
            <div className="row g-3 mb-4">
              {campo('calle', 'Calle y número')}
              {campo('departamento', 'Departamento (opcional)')}

              <div className="col-md-6">
                <label htmlFor="region" className="form-label">Región</label>
                <select
                  id="region"
                  name="region"
                  className={`form-select ${errores.region ? 'is-invalid' : ''}`}
                  value={datos.region}
                  onChange={cambiarRegion}
                >
                  <option value="">Selecciona una región</option>
                  {Object.keys(REGIONES).map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
                {errores.region && <div className="invalid-feedback">{errores.region}</div>}
              </div>

              <div className="col-md-6">
                <label htmlFor="comuna" className="form-label">Comuna</label>
                <select
                  id="comuna"
                  name="comuna"
                  className={`form-select ${errores.comuna ? 'is-invalid' : ''}`}
                  value={datos.comuna}
                  onChange={cambiar}
                  disabled={!datos.region}
                >
                  <option value="">Selecciona una comuna</option>
                  {(REGIONES[datos.region] ?? []).map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                {errores.comuna && <div className="invalid-feedback">{errores.comuna}</div>}
              </div>

              <div className="col-12">
                <label htmlFor="indicaciones" className="form-label">Indicaciones (opcional)</label>
                <textarea
                  id="indicaciones"
                  name="indicaciones"
                  className="form-control"
                  rows="2"
                  value={datos.indicaciones}
                  onChange={cambiar}
                />
              </div>
            </div>

            {hayCambios && (
              <div className="form-check mb-3">
                <input
                  id="guardarDatos"
                  type="checkbox"
                  className="form-check-input"
                  checked={quiereGuardar}
                  onChange={(e) => setGuardarDatos(e.target.checked)}
                />
                <label htmlFor="guardarDatos" className="form-check-label">
                  Guardar estos datos en mi cuenta para próximas compras
                </label>
              </div>
            )}

            {!usuario && (
              <p className="text-muted small">
                <Link to="/login">Inicia sesión</Link> o <Link to="/registro">crea una cuenta</Link> para
                guardar tus datos y no volver a escribirlos.
              </p>
            )}

            <button type="submit" className="btn btn-success btn-lg">
              Pagar {formatoCLP(total)}
            </button>
          </form>
        </div>

        <div className="col-lg-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Resumen</h5>
              <ul className="list-unstyled mb-3">
                {items.map((i) => (
                  <li key={i.productoId} className="d-flex justify-content-between">
                    <span>{i.nombre} x{i.cantidad}</span>
                    <span>{formatoCLP(i.precio * i.cantidad)}</span>
                  </li>
                ))}
              </ul>
              <h5 className="d-flex justify-content-between mb-0">
                <span>Total</span>
                <span>{formatoCLP(total)}</span>
              </h5>
            </div>
          </div>
        </div>
      </div>
      <AvisoAdmin abierto={avisoAbierto} onCerrar={() => setAvisoAbierto(false)} />
    </div>
  )
}