import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getAll, remove } from '../../data/db.js'
import BotonEliminar from '../../components/BotonEliminar.jsx'

function Categorias() {
  const [categorias, setCategorias] = useState(() => getAll('categorias'))
  const [error, setError] = useState('')
  const productos = getAll('productos')
  const cantidad = (categoriaId) => productos.filter((p) => p.categoriaId === categoriaId).length

  // No se elimina una categoría con productos, para no dejarlos sin categoría
  function eliminar(c) {
    if (cantidad(c.id) > 0) {
      setError(`No se puede eliminar "${c.nombre}" porque tiene productos.`)
      return
    }
    remove('categorias', c.id)
    setCategorias(getAll('categorias'))
    setError('')
  }

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
        <h1 className="h3 mb-0">Categorías</h1>
        <Link className="btn btn-primary" to="/admin/categorias/nueva">Nueva categoría</Link>
      </div>

      {error && <div className="alert alert-danger" role="alert">{error}</div>}

      {categorias.length === 0 ? (
        <p>No hay categorías.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Productos</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categorias.map((c) => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <img src={c.imagen} alt="" width="40" height="40" className="rounded object-fit-cover" />
                      {c.nombre}
                    </div>
                  </td>
                  <td>{cantidad(c.id)}</td>
                  <td className="text-nowrap">
                    <Link className="btn btn-sm btn-outline-primary me-1" to={`/admin/categorias/${c.id}/editar`} aria-label={`Editar ${c.nombre}`}>
                      Editar
                    </Link>
                    <BotonEliminar nombre={c.nombre} onEliminar={() => eliminar(c)} />
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

export default Categorias
