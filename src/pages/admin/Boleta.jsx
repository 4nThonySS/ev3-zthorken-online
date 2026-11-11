import { Link, useParams } from 'react-router-dom'
import { getById } from '../../data/db.js'
import { formatearFecha, formatearPrecio } from '../../utils/formato.js'

function Boleta() {
  const { id } = useParams()
  const orden = getById('ordenes', id)

  if (!orden) {
    return (
      <>
        <p>La orden no existe.</p>
        <Link to="/admin/ordenes">Volver a órdenes</Link>
      </>
    )
  }

  const { cliente, direccion } = orden

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
        <h1 className="h3 mb-0">Boleta N° {orden.id}</h1>
        <div className="d-flex gap-2 d-print-none">
          <Link className="btn btn-outline-secondary" to="/admin/ordenes">Volver</Link>
          <button className="btn btn-primary" type="button" onClick={() => window.print()}>Imprimir</button>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <h2 className="h6 text-secondary">Orden</h2>
          <p className="mb-0">Fecha: {formatearFecha(orden.fecha)}</p>
          <p className="mb-0">Estado: {orden.estado}</p>
        </div>
        <div className="col-md-4">
          <h2 className="h6 text-secondary">Cliente</h2>
          <p className="mb-0">{cliente.nombre} {cliente.apellidos}</p>
          <p className="mb-0">{cliente.correo}</p>
          {orden.usuarioId && (
            <Link className="small d-print-none" to={`/admin/usuarios/${orden.usuarioId}`}>Ver usuario</Link>
          )}
        </div>
        <div className="col-md-4">
          <h2 className="h6 text-secondary">Dirección de entrega</h2>
          <p className="mb-0">{[direccion.calle, direccion.departamento].filter(Boolean).join(', ')}</p>
          <p className="mb-0">{direccion.comuna}, {direccion.region}</p>
          {direccion.indicaciones && <p className="mb-0">Indicaciones: {direccion.indicaciones}</p>}
        </div>
      </div>

      <div className="table-responsive">
        <table className="table align-middle">
          <thead>
            <tr>
              <th>Producto</th>
              <th className="text-end">Precio</th>
              <th className="text-end">Cantidad</th>
              <th className="text-end">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {orden.items.map((i) => (
              <tr key={i.productoId}>
                <td>{i.nombre}</td>
                <td className="text-end">{formatearPrecio(i.precio)}</td>
                <td className="text-end">{i.cantidad}</td>
                <td className="text-end">{formatearPrecio(i.precio * i.cantidad)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th colSpan="3" className="text-end">Total</th>
              <th className="text-end">{formatearPrecio(orden.total)}</th>
            </tr>
          </tfoot>
        </table>
      </div>
    </>
  )
}

export default Boleta
