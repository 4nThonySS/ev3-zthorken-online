import { Link, useLocation, useParams } from 'react-router-dom'
import { useApi, Estado } from '../api.jsx'
import { formatearFecha } from '../utils/formato.js'
import { formatoCLP } from '../components/ProductCard.jsx'

export default function PagoCorrecto() {
  const { id } = useParams()
  // Viene del checkout; si se recarga la página se pide al backend (solo con sesión)
  const recibida = useLocation().state?.orden
  const { datos, error } = useApi(recibida ? null : `/boletas/${id}`)
  const orden = recibida ?? datos

  if (!orden && !error) return <Estado />
  if (!orden) {
    return (
      <div className="container my-5 text-center">
        <h1>Orden no encontrada</h1>
        <Link to="/productos" className="btn btn-primary mt-3">Ver productos</Link>
      </div>
    )
  }

  const { cliente, direccion } = orden

  return (
    <div className="container my-4" style={{ maxWidth: 720 }}>
      <div className="alert alert-success d-print-none">¡Pago realizado con éxito!</div>

      <div className="card">
        <div className="card-body">
          <h2 className="mb-1">Boleta</h2>
          <p className="fs-5">{`Orden N° ${orden.id}`}</p>
          <p className="text-muted">Fecha: {formatearFecha(orden.fecha)}</p>

          <h6>Cliente</h6>
          <p>{cliente.nombre} {cliente.apellidos} ({cliente.correo})</p>

          <h6>Dirección de entrega</h6>
          <p>
            {direccion.calle}
            {direccion.departamento ? `, ${direccion.departamento}` : ''}, {direccion.comuna}, {direccion.region}
            {direccion.indicaciones ? ` (${direccion.indicaciones})` : ''}
          </p>

          <table className="table">
            <thead>
              <tr><th>Producto</th><th>Cant.</th><th>Precio</th><th>Subtotal</th></tr>
            </thead>
            <tbody>
              {orden.items.map((i) => (
                <tr key={i.productoId}>
                  <td>{i.nombre}</td>
                  <td>{i.cantidad}</td>
                  <td>{formatoCLP(i.precio)}</td>
                  <td>{formatoCLP(i.precio * i.cantidad)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <h4 className="text-end">Total: {formatoCLP(orden.total)}</h4>
        </div>
      </div>

      <div className="d-flex gap-2 mt-3 d-print-none">
        <button className="btn btn-primary" onClick={() => window.print()}>Imprimir boleta</button>
        <Link to="/productos" className="btn btn-outline-secondary">Seguir comprando</Link>
      </div>
    </div>
  )
}