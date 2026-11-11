import { Link } from 'react-router-dom'
import { getAll } from '../data/db.js'
import { formatearFecha } from '../utils/formato.js'

function Blogs() {
  // Más recientes primero
  const blogs = [...getAll('blogs')].sort((a, b) => b.fecha.localeCompare(a.fecha))

  return (
    <main className="container py-5">
      <h1 className="mb-2">Blog</h1>
      <p className="text-secondary mb-4">Noticias, guías y consejos para sacarle partido a tu tecnología.</p>

      {blogs.length === 0 ? (
        <p>Todavía no hay publicaciones.</p>
      ) : (
        <div className="row g-4">
          {blogs.map((b) => (
            <div className="col-md-6" key={b.id}>
              <article className="card h-100 shadow-sm">
                <img src={b.imagen} className="card-img-top object-fit-cover" style={{ height: 220 }} alt="" />
                <div className="card-body d-flex flex-column">
                  <p className="text-secondary small mb-1">{formatearFecha(b.fecha)}</p>
                  <h2 className="h5">{b.titulo}</h2>
                  <p className="flex-grow-1">{b.resumen}</p>
                  <Link className="btn btn-outline-primary align-self-start" to={`/blogs/${b.id}`}>
                    Leer más<span className="visually-hidden">: {b.titulo}</span>
                  </Link>
                </div>
              </article>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}

export default Blogs
