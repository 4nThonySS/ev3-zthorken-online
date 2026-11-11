import { Link } from 'react-router-dom'

const anio = new Date().getFullYear()

const columnas = [
  {
    titulo: 'Tienda',
    enlaces: [
      { to: '/productos', texto: 'Productos' },
      { to: '/categorias', texto: 'Categorías' },
      { to: '/ofertas', texto: 'Ofertas' },
      { to: '/carrito', texto: 'Carrito' },
    ],
  },
  {
    titulo: 'Empresa',
    enlaces: [
      { to: '/nosotros', texto: 'Nosotros' },
      { to: '/blogs', texto: 'Blog' },
      { to: '/contacto', texto: 'Contacto' },
    ],
  },
  {
    titulo: 'Mi cuenta',
    enlaces: [
      { to: '/login', texto: 'Iniciar sesión' },
      { to: '/registro', texto: 'Crear cuenta' },
    ],
  },
]

function Footer() {
  return (
    <footer className="zt-footer mt-auto">
      <div className="container-fluid px-3 px-xl-4 py-5">
        <div className="row gy-4">
          <div className="col-lg-4">
            <Link className="zt-logo" to="/">
              ZTHORKEN<span className="zt-punto" aria-hidden="true"></span>
            </Link>
            <p className="mt-3 mb-0" style={{ maxWidth: 320 }}>
              Computadores, notebooks, audio y todo lo que necesitas en tecnología.
            </p>
          </div>

          {columnas.map((c) => (
            <div className="col-6 col-md-4 col-lg-2" key={c.titulo}>
              <h2 className="zt-footer-titulo">{c.titulo}</h2>
              <ul className="list-unstyled mb-0">
                {c.enlaces.map((e) => (
                  <li className="mb-2" key={e.to}><Link to={e.to}>{e.texto}</Link></li>
                ))}
              </ul>
            </div>
          ))}

          <div className="col-6 col-md-4 col-lg-2">
            <h2 className="zt-footer-titulo">Contacto</h2>
            <a href="mailto:contacto@zthorken.cl">contacto@zthorken.cl</a>
          </div>
        </div>
      </div>

      <div className="zt-footer-base">
        <div className="container-fluid px-3 px-xl-4 py-3 small">
          © {anio} Zthorken Online
        </div>
      </div>
    </footer>
  )
}

export default Footer
