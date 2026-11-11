import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { getAll } from '../data/db.js'
import { useSesion } from '../context/sesion.js'

const enlaces = [
  { to: '/', texto: 'Home' },
  { to: '/productos', texto: 'Productos' },
  { to: '/ofertas', texto: 'Ofertas' },
  { to: '/nosotros', texto: 'Nosotros' },
  { to: '/blogs', texto: 'Blog' },
  { to: '/contacto', texto: 'Contacto' },
]

// Íconos de línea (decorativos, el texto va en el botón o enlace)
const iconoBuscar = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" />
  </svg>
)
const iconoUsuario = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    <circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
  </svg>
)
const iconoCarrito = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <circle cx="9" cy="20" r="1.5" /><circle cx="18" cy="20" r="1.5" /><path d="M3 4h2l2.5 11h11L21 8H6.5" />
  </svg>
)

function Navbar({ totalCarrito = 0 }) {
  const [busqueda, setBusqueda] = useState('')
  const navigate = useNavigate()
  const categorias = getAll('categorias')
  const { usuario, esAdmin, logout } = useSesion()

  function cerrarSesion() {
    logout()
    navigate('/')
  }

  function buscar(e) {
    e.preventDefault()
    const texto = busqueda.trim()
    navigate(texto ? `/productos?buscar=${encodeURIComponent(texto)}` : '/productos')
  }

  const enlace = (e) => (
    <li className="nav-item" key={e.to}>
      <NavLink className="nav-link" to={e.to} end>{e.texto}</NavLink>
    </li>
  )

  return (
    <header className="zt-header sticky-top">
      <nav className="navbar navbar-expand-xl" data-bs-theme="dark">
        <div className="container-fluid px-3 px-xl-4">
          <Link className="navbar-brand zt-logo" to="/">
            ZTHORKEN<span className="zt-punto" aria-hidden="true"></span>
          </Link>

          {/* Fuera del menú colapsable para que se vea siempre; en escritorio queda al final */}
          <Link
            className="zt-carrito ms-auto me-2 me-xl-0 ms-xl-3 order-xl-last"
            to="/carrito"
            aria-label={`Carrito $${totalCarrito.toLocaleString('es-CL')}`}
          >
            {iconoCarrito}${totalCarrito.toLocaleString('es-CL')}
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#menuPrincipal"
            aria-controls="menuPrincipal"
            aria-expanded="false"
            aria-label="Abrir menú"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="menuPrincipal">
            <ul className="navbar-nav me-auto">
              {enlaces.slice(0, 2).map(enlace)}

              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Categorías
                </a>
                <ul className="dropdown-menu">
                  {categorias.map((c) => (
                    <li key={c.id}>
                      <Link className="dropdown-item" to={`/categorias/${c.id}`}>{c.nombre}</Link>
                    </li>
                  ))}
                  <li><hr className="dropdown-divider" /></li>
                  <li><Link className="dropdown-item" to="/categorias">Ver todas</Link></li>
                </ul>
              </li>

              {enlaces.slice(2).map(enlace)}
            </ul>

            <div className="d-flex flex-column flex-xl-row align-items-xl-center gap-2 gap-xl-3 py-3 py-xl-0">
              <form className="zt-buscador" role="search" onSubmit={buscar}>
                <button className="zt-buscador-boton" type="submit" aria-label="Buscar">{iconoBuscar}</button>
                <input
                  type="search"
                  placeholder="Buscar"
                  aria-label="Buscar productos"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
              </form>

              <div className="dropdown">
                <button className="zt-cuenta dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                  {iconoUsuario}
                  <span className="text-nowrap">{usuario ? `Hola, ${usuario.nombre}` : 'Mi cuenta'}</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-xl-end">
                  {usuario ? (
                    <>
                      {esAdmin && <li><Link className="dropdown-item" to="/admin">Admin</Link></li>}
                      <li>
                        <button className="dropdown-item" type="button" onClick={cerrarSesion}>Cerrar sesión</button>
                      </li>
                    </>
                  ) : (
                    <>
                      <li><Link className="dropdown-item" to="/login">Iniciar sesión</Link></li>
                      <li><Link className="dropdown-item" to="/registro">Crear cuenta</Link></li>
                    </>
                  )}
                </ul>
              </div>

            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Navbar
