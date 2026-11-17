import { Link } from 'react-router-dom'
import { useApi, Estado } from '../../api.jsx'
import { formatearPrecio, formatearPrecioCorto, ultimosMeses } from '../../utils/formato.js'
import { GraficoBarras, GraficoLineas } from '../../components/Graficos.jsx'

const accesos = [
  { to: '/admin/productos/nuevo', texto: 'Nuevo producto' },
  { to: '/admin/productos/criticos', texto: 'Productos críticos' },
  { to: '/admin/ordenes', texto: 'Ver órdenes' },
  { to: '/admin/usuarios/nuevo', texto: 'Nuevo usuario' },
  { to: '/admin/reportes', texto: 'Reportes' },
]

function Dashboard() {
  const boletas = useApi('/boletas')
  const productos = useApi('/productos').datos
  const usuarios = useApi('/usuarios').datos
  if (!boletas.datos || !productos || !usuarios) return <Estado error={boletas.error} />

  const ordenes = boletas.datos.filter((o) => o.estado === 'PAGADA')

  const ventasPorMes = ultimosMeses(6).map(({ clave, etiqueta }) => {
    const delMes = ordenes.filter((o) => o.fecha?.startsWith(clave))
    return {
      id: clave,
      etiqueta,
      valor: delMes.reduce((suma, o) => suma + o.total, 0),
      detalle: `${delMes.length} ${delMes.length === 1 ? 'orden' : 'órdenes'}`,
    }
  })

  const menorStock = [...productos]
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 6)
    .map((p) => ({
      id: p.id,
      nombre: p.nombre,
      valor: p.stock,
      marca: p.stock <= p.stockCritico ? 'Crítico' : null,
      detalle: `Stock crítico: ${p.stockCritico}`,
    }))

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
      detalle: `Clientes: ${usuarios.filter((u) => u.rol === 'CLIENTE').length}`,
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

      <div className="row g-3 mb-4">
        <div className="col-lg-7">
          <GraficoLineas
            titulo="Ventas por mes"
            descripcion="Monto de las órdenes pagadas en los últimos 6 meses"
            datos={ventasPorMes}
            formato={formatearPrecio}
            formatoEje={formatearPrecioCorto}
          />
        </div>
        <div className="col-lg-5">
          <GraficoBarras
            titulo="Productos con menos stock"
            descripcion="Unidades disponibles; los marcados están en stock crítico"
            datos={menorStock}
            formato={(v) => `${v} u.`}
          />
        </div>
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
