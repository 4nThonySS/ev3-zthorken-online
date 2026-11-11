import { Link, useLocation } from 'react-router-dom'

export default function PagoError() {
  const { state } = useLocation()
  const mensaje = state?.mensaje ?? 'No pudimos procesar tu pago.'

  return (
    <div className="container my-5 text-center" style={{ maxWidth: 560 }}>
      <div className="alert alert-danger">
        <h2 className="alert-heading">Pago con error</h2>
        <p className="mb-0">{mensaje}</p>
      </div>
      <p className="text-muted">Tu carrito sigue guardado.</p>
      <div className="d-flex gap-2 justify-content-center">
        <Link to="/checkout" className="btn btn-primary">Reintentar pago</Link>
        <Link to="/carrito" className="btn btn-outline-secondary">Volver al carrito</Link>
      </div>
    </div>
  )
}