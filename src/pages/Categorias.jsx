import { Link } from 'react-router-dom'
import { getAll } from '../data/db.js'

export default function Categorias() {
  const categorias = getAll('categorias')

  return (
    <div className="container my-4">
      <Link to="/productos" className="btn btn-link ps-0 mb-3">← Ver todos los productos</Link>
      <h1 className="mb-4">Categorías</h1>
      <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4">
        {categorias.map((c) => (
          <div className="col" key={c.id}>
            <Link to={`/categorias/${c.id}`} className="text-decoration-none text-reset">
              <div className="card h-100 shadow-sm">
                <img src={c.imagen} className="card-img-top" alt={c.nombre} />
                <div className="card-body text-center">
                  <h5 className="card-title mb-0">{c.nombre}</h5>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}