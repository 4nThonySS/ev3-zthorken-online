import { Link, useParams } from 'react-router-dom'
import { getAll, getById } from '../data/db.js'
import ProductCard from '../components/ProductCard.jsx'

export default function CategoriaDetalle() {
  const { id } = useParams()
  const categoria = getById('categorias', id)

  if (!categoria) {
    return (
      <div className="container my-5 text-center">
        <h1>Categoría no encontrada</h1>
        <Link to="/categorias" className="btn btn-primary mt-3">Ver categorías</Link>
      </div>
    )
  }

  const productos = getAll('productos').filter((p) => p.categoriaId === categoria.id)

  return (
    <div className="container my-4">
      <Link to="/categorias" className="btn btn-link ps-0 mb-3">← Volver a categorías</Link>
      <div className="position-relative mb-4">
        <img src={categoria.imagen} alt="" className="w-100 rounded object-fit-cover" style={{ height: 200, filter: 'brightness(0.5)' }} />
        <h1 className="position-absolute bottom-0 start-0 m-0 p-4 text-white">{categoria.nombre}</h1>
      </div>
      {productos.length === 0 ? (
        <p className="text-muted">No hay productos en esta categoría.</p>
      ) : (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4">
          {productos.map((p) => (
            <div className="col" key={p.id}>
              <ProductCard producto={p} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}