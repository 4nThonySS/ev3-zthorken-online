import { Link, useParams } from 'react-router-dom'
import { getById } from '../data/db.js'
import { formatearFecha } from '../utils/formato.js'

function BlogDetalle() {
  const { id } = useParams()
  const blog = getById('blogs', id)

  if (!blog) {
    return (
      <main className="container py-5 text-center">
        <h1 className="h3">Publicación no encontrada</h1>
        <p className="text-secondary">La publicación que buscas no existe o fue eliminada.</p>
        <Link className="btn btn-primary" to="/blogs">Volver al blog</Link>
      </main>
    )
  }

  return (
    <main className="container py-5">
      <div className="row justify-content-center">
        <article className="col-lg-8">
          <Link className="text-decoration-none" to="/blogs">← Volver al blog</Link>

          <h1 className="mt-3">{blog.titulo}</h1>
          <p className="text-secondary">
            {formatearFecha(blog.fecha)}{blog.autor && ` · ${blog.autor}`}
          </p>

          <img src={blog.imagen} className="img-fluid rounded w-100 object-fit-cover mb-4" style={{ maxHeight: 400 }} alt="" />

          <p className="lead">{blog.resumen}</p>
          {blog.contenido.split('\n\n').map((parrafo, i) => (
            <p key={i}>{parrafo}</p>
          ))}
        </article>
      </div>
    </main>
  )
}

export default BlogDetalle
