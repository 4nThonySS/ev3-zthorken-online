import { Link } from 'react-router-dom'
import Carrusel from '../components/Carrusel.jsx'
import { getAll } from '../data/db.js'

const slides = [
  { titulo: 'Nuevos lanzamientos', texto: 'Descubre lo último en computadores y notebooks.', imagen: '/img/carrusel/lanzamientos.jpg', enlace: '/productos', boton: 'Ver productos' },
  { titulo: 'Ofertas de la semana', texto: 'Audio, periféricos y más con grandes descuentos.', imagen: '/img/carrusel/ofertas.jpg', enlace: '/ofertas', boton: 'Ver ofertas' },
  { titulo: 'Arma tu setup', texto: 'Monitores, teclados y componentes para tu equipo.', imagen: '/img/carrusel/setup.jpg', enlace: '/categorias', boton: 'Ver categorías' },
]

function Home() {
  const categorias = getAll('categorias')

  return (
    <main>
      <h1 className="visually-hidden">Zthorken Online</h1>

      <Carrusel slides={slides} />

      <section className="container py-5">
        <h2 className="text-center mb-4">Categorías</h2>
        <div className="row g-4">
          {categorias.map((c) => (
            <div className="col-6 col-md-4" key={c.id}>
              <Link to={`/categorias/${c.id}`} className="card h-100 text-decoration-none shadow-sm">
                <img src={c.imagen} className="card-img-top object-fit-cover" style={{ height: 160 }} alt="" />
                <div className="card-body text-center">
                  <h3 className="h6 mb-0">{c.nombre}</h3>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}

export default Home
