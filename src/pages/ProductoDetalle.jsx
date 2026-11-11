import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getById } from '../data/db.js'
import { useCart } from '../context/CartContext.jsx'
import { useEsAdmin } from '../context/sesion.js'
import AvisoAdmin from '../components/AvisoAdmin.jsx'
import { formatoCLP } from '../components/ProductCard.jsx'

export default function ProductoDetalle() {
  const { id } = useParams()
  const { agregar } = useCart()
  const esAdmin = useEsAdmin()
  const [cantidad, setCantidad] = useState(1)
  const [agregado, setAgregado] = useState(false)
  const [avisoAbierto, setAvisoAbierto] = useState(false)

  const producto = getById('productos', id)

  if (!producto) {
    return (
      <div className="container my-5 text-center">
        <h1>Producto no encontrado</h1>
        <Link to="/productos" className="btn btn-primary mt-3">Volver a productos</Link>
      </div>
    )
  }

  const enOferta = producto.precioOferta !== null
  const sinStock = producto.stock <= 0

  const handleAgregar = () => {
    if (esAdmin) {
      setAvisoAbierto(true)
      return
    }
    agregar(producto, cantidad)
    setAgregado(true)
  }

  return (
    <div className="container my-4">
      <Link to="/productos" className="btn btn-link ps-0 mb-3">← Volver a productos</Link>
      <div className="row g-4">
        <div className="col-md-6">
          <img src={producto.imagen} alt={producto.nombre} className="img-fluid rounded" />
        </div>
        <div className="col-md-6">
          <h1>{producto.nombre}</h1>
          <p className="text-muted">{producto.descripcion}</p>
          <p className="fs-4">
            {enOferta ? (
              <>
                <span className="text-muted text-decoration-line-through me-2">
                  {formatoCLP(producto.precio)}
                </span>
                <strong className="text-danger">{formatoCLP(producto.precioOferta)}</strong>
              </>
            ) : (
              <strong>{formatoCLP(producto.precio)}</strong>
            )}
          </p>
          <p>Stock disponible: {producto.stock}</p>

          <div className="d-flex gap-2 align-items-center">
            <input
              type="number"
              className="form-control w-auto"
              aria-label="Cantidad"
              min="1"
              max={producto.stock}
              value={cantidad}
              disabled={sinStock}
              onChange={(e) =>
                setCantidad(Math.min(producto.stock, Math.max(1, Number(e.target.value) || 1)))
              }
            />
            <button className="btn btn-primary" disabled={sinStock} onClick={handleAgregar}>
              {sinStock ? 'Sin stock' : 'Agregar al carrito'}
            </button>
          </div>

          {agregado && (
            <p className="text-success mt-3">
              Producto agregado. <Link to="/carrito">Ver carrito</Link>
            </p>
          )}
        </div>
      </div>
      <AvisoAdmin abierto={avisoAbierto} onCerrar={() => setAvisoAbierto(false)} />
    </div>
  )
}