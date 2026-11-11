import { Link, NavLink, Navigate, Outlet } from 'react-router-dom'
import { useSesion } from '../context/sesion.js'

const enlaces = [
  { to: '/admin', texto: 'Dashboard', end: true },
  { to: '/admin/ordenes', texto: 'Órdenes' },
  { to: '/admin/productos', texto: 'Productos' },
  { to: '/admin/categorias', texto: 'Categorías' },
  { to: '/admin/usuarios', texto: 'Usuarios' },
  { to: '/admin/reportes', texto: 'Reportes' },
  { to: '/admin/perfil', texto: 'Perfil' },
]

// Layout del panel: sidebar + vista actual. Solo entra el rol admin.
function AdminLayout() {
  const { usuario, esAdmin, logout } = useSesion()

  // Al cerrar sesión este mismo guard lleva a /login
  if (!esAdmin) return <Navigate to={usuario ? '/' : '/login'} replace />

  return (
    <div className="container-fluid">
      <div className="row min-vh-100">
        <aside className="col-md-3 col-lg-2 bg-dark text-white p-3 d-print-none">
          <Link className="d-block fs-5 fw-bold text-white text-decoration-none" to="/admin">Zthorken Admin</Link>
          <p className="small text-white-50">{usuario.nombre} {usuario.apellidos}</p>

          <nav className="nav nav-pills flex-md-column gap-1" aria-label="Menú de administración">
            {enlaces.map((e) => (
              <NavLink className="nav-link text-white" to={e.to} end={e.end} key={e.to}>{e.texto}</NavLink>
            ))}
          </nav>

          <hr />
          <div className="d-flex flex-wrap flex-md-column gap-2">
            <Link className="btn btn-sm btn-outline-light" to="/">Ir a la tienda</Link>
            <button className="btn btn-sm btn-outline-danger" type="button" onClick={logout}>Cerrar sesión</button>
          </div>
        </aside>

        <main className="col-md-9 col-lg-10 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
