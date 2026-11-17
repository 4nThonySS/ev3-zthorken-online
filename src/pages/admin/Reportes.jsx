import { useApi, Estado } from '../../api.jsx'
import { formatearPrecio, formatearPrecioCorto } from '../../utils/formato.js'
import { GraficoBarras, GraficoDona } from '../../components/Graficos.jsx'

const porMayor = (a, b) => b.valor - a.valor

function Reportes() {
  const boletas = useApi('/boletas')
  const productos = useApi('/productos').datos
  const categorias = useApi('/categorias').datos
  if (!boletas.datos || !productos || !categorias) return <Estado error={boletas.error} />

  const ordenes = boletas.datos.filter((o) => o.estado === 'PAGADA')

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

  const porCategoria = categorias.map((c, i) => {
    const lista = productos.filter((p) => p.categoriaId === c.id)
    return {
      ...c,
      serie: i + 1,
      productos: lista.length,
      stock: lista.reduce((suma, p) => suma + p.stock, 0),
      valorStock: lista.reduce((suma, p) => suma + p.precio * p.stock, 0),
      criticos: lista.filter((p) => p.stock <= p.stockCritico).length,
      unidades: lista.reduce((suma, p) => suma + (ventas[p.id]?.unidades ?? 0), 0),
      monto: lista.reduce((suma, p) => suma + (ventas[p.id]?.monto ?? 0), 0),
    }
  })

  const graficoVentas = porCategoria
    .map((c) => ({ id: c.id, serie: c.serie, nombre: c.nombre, valor: c.monto, detalle: `${c.unidades} unidades vendidas` }))
    .sort(porMayor)
  const graficoMasVendidos = masVendidos
    .map((v) => ({ nombre: v.nombre, valor: v.unidades, detalle: formatearPrecio(v.monto) }))
  const graficoStock = porCategoria
    .map((c) => ({ id: c.id, serie: c.serie, nombre: c.nombre, valor: c.valorStock, detalle: `${c.stock} unidades en ${c.productos} productos` }))
    .sort(porMayor)
  const estados = [
    { nombre: 'Pagadas', valor: ordenes.length },
    { nombre: 'Anuladas', valor: boletas.datos.filter((o) => o.estado === 'ANULADA').length },
  ]

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

      <h2 className="h5">Gráficos</h2>
      <div className="row g-3 mb-4">
        <div className="col-lg-6">
          <GraficoDona
            titulo="Ventas por categoría"
            descripcion="Monto vendido en órdenes pagadas"
            datos={graficoVentas}
            formato={formatearPrecio}
            formatoCentro={formatearPrecioCorto}
            vacio="Sin ventas registradas."
            etiquetaTotal="Vendido"
          />
        </div>
        <div className="col-lg-6">
          <GraficoBarras
            titulo="Top 5 productos más vendidos"
            descripcion="Unidades vendidas en órdenes pagadas"
            datos={graficoMasVendidos}
            formato={(v) => `${v} u.`}
            vacio="Sin ventas registradas."
          />
        </div>
        <div className="col-lg-6">
          <GraficoDona
            titulo="Valor del inventario por categoría"
            descripcion="Precio normal por unidades en stock"
            datos={graficoStock}
            formato={formatearPrecio}
            formatoCentro={formatearPrecioCorto}
            etiquetaTotal="En stock"
          />
        </div>
        <div className="col-lg-6">
          <GraficoDona
            titulo="Órdenes por estado"
            descripcion="Pagadas frente a anuladas"
            datos={estados}
            etiquetaTotal="Órdenes"
          />
        </div>
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
