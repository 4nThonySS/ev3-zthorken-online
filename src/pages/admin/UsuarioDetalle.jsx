import { Link, useParams } from 'react-router-dom'
import { getAll, getById } from '../../data/db.js'
import { formatearFecha, formatearPrecio } from '../../utils/formato.js'

function UsuarioDetalle() {
  const { id } = useParams()
  const usuario = getById('usuarios', id)

  if (!usuario) {
    return (
      <>
        <p>El usuario no existe.</p>
        <Link to="/admin/usuarios">Volver a usuarios</Link>
      </>
    )
  }

  // Historial de compras, más recientes primero
  const compras = getAll('ordenes')
    .filter((o) => o.usuarioId === usuario.id)
    .sort((a, b) => b.fecha.localeCompare(a.fecha))
  const totalGastado = compras.reduce((suma, o) => suma + o.total, 0)

  const datos = [
    { titulo: 'Correo', valor: usuario.correo },
    { titulo: 'Rol', valor: usuario.rol },
    { titulo: 'Dirección', valor: [usuario.calle, usuario.departamento].filter(Boolean).join(', ') || '—' },
    { titulo: 'Comuna y región', valor: [usuario.comuna, usuario.region].filter(Boolean).join(', ') || '—' },
  ]

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
        <h1 className="h3 mb-0">{usuario.nombre} {usuario.apellidos}</h1>
        <div className="d-flex gap-2">
          <Link className="btn btn-outline-secondary" to="/admin/usuarios">Volver</Link>
          <Link className="btn btn-primary" to={`/admin/usuarios/${usuario.id}/editar`}>Editar</Link>
        </div>
      </div>

      <dl className="row mb-4">
        {datos.map((d) => (
          <div className="col-sm-6 col-lg-3 mb-2" key={d.titulo}>
            <dt className="small text-secondary">{d.titulo}</dt>
            <dd className="mb-0">{d.valor}</dd>
          </div>
        ))}
      </dl>

      <h2 className="h5">Historial de compras</h2>
      {compras.length === 0 ? (
        <p>Este usuario todavía no tiene compras.</p>
      ) : (
        <>
          <p>{compras.length} compra(s) por un total de {formatearPrecio(totalGastado)}.</p>
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead>
                <tr>
                  <th>N° orden</th>
                  <th>Fecha</th>
                  <th>Productos</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {compras.map((o) => (
                  <tr key={o.id}>
                    <td>{o.id}</td>
                    <td>{formatearFecha(o.fecha)}</td>
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
        </>
      )}
    </>
  )
}

export default UsuarioDetalle
