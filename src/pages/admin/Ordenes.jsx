import { Link } from 'react-router-dom'
import { getAll } from '../../data/db.js'
import { formatearFecha, formatearPrecio } from '../../utils/formato.js'

function Ordenes() {
  // Más recientes primero
  const ordenes = [...getAll('ordenes')].sort((a, b) => b.fecha.localeCompare(a.fecha) || b.id - a.id)

  return (
    <>
      <h1 className="h3 mb-4">Órdenes</h1>

      {ordenes.length === 0 ? (
        <p>Todavía no hay órdenes.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead>
              <tr>
                <th>N° orden</th>
                <th>Fecha</th>
                <th>Cliente</th>
                <th>Productos</th>
                <th>Total</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {ordenes.map((o) => (
                <tr key={o.id}>
                  <td>{o.id}</td>
                  <td>{formatearFecha(o.fecha)}</td>
                  <td>
                    {o.cliente.nombre} {o.cliente.apellidos}
                    <div className="small text-secondary">{o.cliente.correo}</div>
                  </td>
                  <td>{o.items.reduce((suma, i) => suma + i.cantidad, 0)}</td>
                  <td>{formatearPrecio(o.total)}</td>
                  <td>{o.estado}</td>
                  <td>
                    <Link className="btn btn-sm btn-outline-secondary" to={`/admin/ordenes/${o.id}`} aria-label={`Ver boleta ${o.id}`}>
                      Ver boleta
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}

export default Ordenes
