import { getAll } from '../../data/db.js'
import { formatearPrecio } from '../../utils/formato.js'

function Reportes() {
  const ordenes = getAll('ordenes')
  const productos = getAll('productos')
  const categorias = getAll('categorias')

  // Unidades y monto vendidos de cada producto, según las órdenes
  const ventas = {}
  for (const o of ordenes) {
    for (const i of o.items) {
      ventas[i.productoId] ??= { nombre: i.nombre, unidades: 0, monto: 0 }
      ventas[i.productoId].unidades += i.cantidad
      ventas[i.productoId].monto += i.precio * i.cantidad
    }
  }

  const totalVendido = ordenes.reduce((suma, o) => suma + o.total, 0)
  const unidadesVendidas = Object.values(ventas).reduce((suma, v) => suma + v.unidades, 0)
  const masVendidos = Object.values(ventas).sort((a, b) => b.unidades - a.unidades).slice(0, 5)

  const resumen = [
    { titulo: 'Órdenes', valor: ordenes.length },
    { titulo: 'Total vendido', valor: formatearPrecio(totalVendido) },
    { titulo: 'Ticket promedio', valor: formatearPrecio(ordenes.length ? Math.round(totalVendido / ordenes.length) : 0) },
    { titulo: 'Unidades vendidas', valor: unidadesVendidas },
  ]

  // Las ventas de productos ya eliminados no se cuentan en su categoría
  const porCategoria = categorias.map((c) => {
    const lista = productos.filter((p) => p.categoriaId === c.id)
    return {
      ...c,
      productos: lista.length,
      stock: lista.reduce((suma, p) => suma + p.stock, 0),
      valorStock: lista.reduce((suma, p) => suma + p.precio * p.stock, 0),
      criticos: lista.filter((p) => p.stock <= p.stockCritico).length,
      unidades: lista.reduce((suma, p) => suma + (ventas[p.id]?.unidades ?? 0), 0),
      monto: lista.reduce((suma, p) => suma + (ventas[p.id]?.monto ?? 0), 0),
    }
  })

  return (
    <>
      <h1 className="h3 mb-4">Reportes</h1>

      <div className="row g-3 mb-4">
        {resumen.map((r) => (
          <div className="col-6 col-lg-3" key={r.titulo}>
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h2 className="h6 text-secondary">{r.titulo}</h2>
                <p className="fs-4 mb-0">{r.valor}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <h2 className="h5">Por categoría</h2>
      <div className="table-responsive mb-4">
        <table className="table align-middle" aria-label="Reporte por categoría">
          <thead>
            <tr>
              <th>Categoría</th>
              <th className="text-end">Productos</th>
              <th className="text-end">Stock</th>
              <th className="text-end">Valor del stock</th>
              <th className="text-end">Críticos</th>
              <th className="text-end">Unidades vendidas</th>
              <th className="text-end">Ventas</th>
            </tr>
          </thead>
          <tbody>
            {porCategoria.map((c) => (
              <tr key={c.id}>
                <td>{c.nombre}</td>
                <td className="text-end">{c.productos}</td>
                <td className="text-end">{c.stock}</td>
                <td className="text-end">{formatearPrecio(c.valorStock)}</td>
                <td className="text-end">{c.criticos}</td>
                <td className="text-end">{c.unidades}</td>
                <td className="text-end">{formatearPrecio(c.monto)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="h5">Productos más vendidos</h2>
      {masVendidos.length === 0 ? (
        <p>Todavía no hay ventas.</p>
      ) : (
        <div className="table-responsive">
          <table className="table align-middle" aria-label="Productos más vendidos">
            <thead>
              <tr>
                <th>Producto</th>
                <th className="text-end">Unidades</th>
                <th className="text-end">Ventas</th>
              </tr>
            </thead>
            <tbody>
              {masVendidos.map((v) => (
                <tr key={v.nombre}>
                  <td>{v.nombre}</td>
                  <td className="text-end">{v.unidades}</td>
                  <td className="text-end">{formatearPrecio(v.monto)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}

export default Reportes
