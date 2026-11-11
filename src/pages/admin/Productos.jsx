import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getAll, remove } from '../../data/db.js'
import { formatearPrecio } from '../../utils/formato.js'
import BotonEliminar from '../../components/BotonEliminar.jsx'

// Con soloCriticos muestra solo los productos con stock <= stockCritico
function Productos({ soloCriticos = false }) {
  const [productos, setProductos] = useState(() => getAll('productos'))
  const categorias = getAll('categorias')
  const lista = soloCriticos ? productos.filter((p) => p.stock <= p.stockCritico) : productos

  function eliminar(id) {
    remove('productos', id)
    setProductos(getAll('productos'))
  }

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
        <h1 className="h3 mb-0">{soloCriticos ? 'Productos críticos' : 'Productos'}</h1>
        <div className="d-flex gap-2">
          {soloCriticos
            ? <Link className="btn btn-outline-secondary" to="/admin/productos">Ver todos</Link>
            : <Link className="btn btn-outline-danger" to="/admin/productos/criticos">Ver críticos</Link>}
          <Link className="btn btn-primary" to="/admin/productos/nuevo">Nuevo producto</Link>
        </div>
      </div>

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
                <th>Acciones</th>
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
                  <td>{categorias.find((c) => c.id === p.categoriaId)?.nombre ?? '—'}</td>
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
                    <Link className="btn btn-sm btn-outline-primary me-1" to={`/admin/productos/${p.id}/editar`} aria-label={`Editar ${p.nombre}`}>
                      Editar
                    </Link>
                    <BotonEliminar nombre={p.nombre} onEliminar={() => eliminar(p.id)} />
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
