import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { api, useApi, Estado } from '../../api.jsx'
import { useEsAdmin } from '../../context/sesion.js'
import { formatearPrecio } from '../../utils/formato.js'
import BotonEliminar from '../../components/BotonEliminar.jsx'

function ProductoDetalle() {
  const { id } = useParams()
  const navigate = useNavigate()
  const esAdmin = useEsAdmin()
  const [errorEliminar, setErrorEliminar] = useState('')
  const { datos: producto, error } = useApi(`/productos/${id}`)
  const { datos: boletas } = useApi('/boletas')

  if (error?.status === 404 || error?.status === 400) {
    return (
      <>
        <p>El producto no existe.</p>
        <Link to="/admin/productos">Volver a productos</Link>
      </>
    )
  }

  if (!producto || !boletas) return <Estado error={error} />

  // Ventas del producto según las boletas pagadas
  const vendidos = boletas
    .filter((o) => o.estado === 'PAGADA')
    .flatMap((o) => o.items)
    .filter((i) => i.productoId === producto.id)
  const unidades = vendidos.reduce((suma, i) => suma + i.cantidad, 0)
  const monto = vendidos.reduce((suma, i) => suma + i.precio * i.cantidad, 0)

  async function eliminar() {
    try {
      await api(`/productos/${producto.id}`, { method: 'DELETE' })
      navigate('/admin/productos')
    } catch (e) {
      setErrorEliminar(e.message)
    }
  }

  const datos = [
    { titulo: 'ID', valor: producto.id },
    { titulo: 'Categoría', valor: producto.categoriaNombre },
    { titulo: 'Precio', valor: formatearPrecio(producto.precio) },
    { titulo: 'Precio oferta', valor: producto.precioOferta ? formatearPrecio(producto.precioOferta) : '—' },
    { titulo: 'Stock', valor: producto.stock },
    { titulo: 'Stock crítico', valor: producto.stockCritico },
    { titulo: 'Unidades vendidas', valor: unidades },
    { titulo: 'Total vendido', valor: formatearPrecio(monto) },
  ]

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
        <h1 className="h3 mb-0">{producto.nombre}</h1>
        <div className="d-flex gap-2">
          <Link className="btn btn-outline-secondary" to="/admin/productos">Volver</Link>
          {esAdmin && (
            <>
              <Link className="btn btn-primary" to={`/admin/productos/${producto.id}/editar`}>Editar</Link>
              <BotonEliminar nombre={producto.nombre} onEliminar={eliminar} />
            </>
          )}
        </div>
      </div>

      {errorEliminar && <div className="alert alert-danger" role="alert">{errorEliminar}</div>}

      {producto.stock <= producto.stockCritico && (
        <div className="alert alert-danger" role="alert">Este producto está en stock crítico.</div>
      )}

      <div className="row g-4">
        <div className="col-md-5">
          <img src={producto.imagen} className="img-fluid rounded border" alt={producto.nombre} />
        </div>
        <div className="col-md-7">
          <p>{producto.descripcion || 'Sin descripción.'}</p>
          <dl className="row mb-0">
            {datos.map((d) => (
              <div className="col-sm-6 mb-2" key={d.titulo}>
                <dt className="small text-secondary">{d.titulo}</dt>
                <dd className="mb-0">{d.valor}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </>
  )
}

export default ProductoDetalle
