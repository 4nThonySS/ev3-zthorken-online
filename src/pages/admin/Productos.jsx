import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api, useApi, Estado } from '../../api.jsx'
import { useEsAdmin } from '../../context/sesion.js'
import { formatearPrecio } from '../../utils/formato.js'
import BotonEliminar from '../../components/BotonEliminar.jsx'

// Con soloCriticos muestra solo los productos con stock <= stockCritico.
// El vendedor solo los ve: no aparecen los botones de crear, editar ni eliminar.
function Productos({ soloCriticos = false }) {
  const esAdmin = useEsAdmin()
  const [error, setError] = useState('')
  const { datos: productos, error: errorCarga, recargar } = useApi(soloCriticos ? '/productos/stock-critico' : '/productos')
  if (!productos) return <Estado error={errorCarga} />
  const lista = productos

  async function eliminar(id) {
    try {
      await api(`/productos/${id}`, { method: 'DELETE' })
      setError('')
      recargar()
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
        <h1 className="h3 mb-0">{soloCriticos ? 'Productos críticos' : 'Productos'}</h1>
        <div className="d-flex gap-2">
          {soloCriticos
            ? <Link className="btn btn-outline-secondary" to="/admin/productos">Ver todos</Link>
            : <Link className="btn btn-outline-danger" to="/admin/productos/criticos">Ver críticos</Link>}
          {esAdmin && <Link className="btn btn-primary" to="/admin/productos/nuevo">Nuevo producto</Link>}
        </div>
      </div>

      {error && <div className="alert alert-danger" role="alert">{error}</div>}

      {lista.length === 0 ? (
        <p>{soloCriticos ? 'No hay productos con stock crítico.' : 'No hay productos.'}</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Oferta</th>
                <th>Stock</th>
                <th>{esAdmin ? 'Acciones' : ''}</th>
              </tr>
            </thead>
            <tbody>
              {lista.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <img src={p.imagen} alt="" width="40" height="40" className="rounded object-fit-cover" />
                      {p.nombre}
                    </div>
                  </td>
                  <td>{p.categoriaNombre}</td>
                  <td>{formatearPrecio(p.precio)}</td>
                  <td>{p.precioOferta ? formatearPrecio(p.precioOferta) : '—'}</td>
                  <td>
                    {p.stock}
                    {p.stock <= p.stockCritico && <span className="badge text-bg-danger ms-2">Crítico</span>}
                  </td>
                  <td className="text-nowrap">
                    <Link className="btn btn-sm btn-outline-secondary me-1" to={`/admin/productos/${p.id}`} aria-label={`Ver ${p.nombre}`}>
                      Ver
                    </Link>
                    {esAdmin && (
                      <>
                        <Link className="btn btn-sm btn-outline-primary me-1" to={`/admin/productos/${p.id}/editar`} aria-label={`Editar ${p.nombre}`}>
                          Editar
                        </Link>
                        <BotonEliminar nombre={p.nombre} onEliminar={() => eliminar(p.id)} />
                      </>
                    )}
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

export default Productos
