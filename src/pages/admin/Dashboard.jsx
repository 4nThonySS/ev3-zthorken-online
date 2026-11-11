import { Link } from 'react-router-dom'
import { getAll } from '../../data/db.js'
import { formatearPrecio } from '../../utils/formato.js'

const accesos = [
  { to: '/admin/productos/nuevo', texto: 'Nuevo producto' },
  { to: '/admin/productos/criticos', texto: 'Productos críticos' },
  { to: '/admin/ordenes', texto: 'Ver órdenes' },
  { to: '/admin/usuarios/nuevo', texto: 'Nuevo usuario' },
  { to: '/admin/reportes', texto: 'Reportes' },
]

function Dashboard() {
  const ordenes = getAll('ordenes')
  const productos = getAll('productos')
  const usuarios = getAll('usuarios')

  const tarjetas = [
    {
      titulo: 'Compras',
      valor: ordenes.length,
      detalle: `Total vendido: ${formatearPrecio(ordenes.reduce((suma, o) => suma + o.total, 0))}`,
      to: '/admin/ordenes',
    },
    {
      titulo: 'Productos',
      valor: productos.length,
      detalle: `En stock crítico: ${productos.filter((p) => p.stock <= p.stockCritico).length}`,
      to: '/admin/productos',
    },
    {
      titulo: 'Usuarios',
      valor: usuarios.length,
      detalle: `Clientes: ${usuarios.filter((u) => u.rol === 'cliente').length}`,
      to: '/admin/usuarios',
    },
  ]

  return (
    <>
      <h1 className="h3 mb-4">Dashboard</h1>

      <div className="row g-3 mb-4">
        {tarjetas.map((t) => (
          <div className="col-md-4" key={t.titulo}>
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h2 className="h6 text-secondary">{t.titulo}</h2>
                <p className="display-6 mb-1">{t.valor}</p>
                <p className="small mb-2">{t.detalle}</p>
                <Link className="stretched-link small" to={t.to}>Ver {t.titulo.toLowerCase()}</Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <h2 className="h5">Accesos directos</h2>
      <div className="d-flex flex-wrap gap-2">
        {accesos.map((a) => (
          <Link className="btn btn-outline-primary" to={a.to} key={a.to}>{a.texto}</Link>
        ))}
      </div>
    </>
  )
}

export default Dashboard
