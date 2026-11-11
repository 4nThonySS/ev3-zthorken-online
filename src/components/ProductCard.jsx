import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { useEsAdmin } from '../context/sesion.js'
import AvisoAdmin from './AvisoAdmin.jsx'

export const formatoCLP = (n) => '$' + Number(n).toLocaleString('es-CL')

export default function ProductCard({ producto }) {
  const { agregar, items } = useCart()
  const esAdmin = useEsAdmin()
  const [avisoAbierto, setAvisoAbierto] = useState(false)
  const enCarrito = items.find((i) => i.productoId === producto.id)?.cantidad ?? 0
  const enOferta = producto.precioOferta !== null && producto.precioOferta !== undefined
  const sinStock = producto.stock <= 0
  const limiteAlcanzado = !sinStock && enCarrito >= producto.stock

  return (
    <div className="card h-100 shadow-sm">
      {enOferta && (
        <span className="badge bg-danger position-absolute m-2">Oferta</span>
      )}
      <img
        src={producto.imagen}
        className="card-img-top p-3"
        alt={producto.nombre}
        style={{ objectFit: 'contain', height: 200 }}
      />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{producto.nombre}</h5>
        <p className="mb-3">
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
        <div className="mt-auto d-flex gap-2">
          <Link to={`/productos/${producto.id}`} className="btn btn-outline-secondary btn-sm">
            Ver detalle
          </Link>
          <button
            className="btn btn-primary btn-sm"
            disabled={sinStock || limiteAlcanzado}
            onClick={() => (esAdmin ? setAvisoAbierto(true) : agregar(producto))}
          >
            {sinStock ? 'Sin stock' : limiteAlcanzado ? 'Máximo en carrito' : 'Agregar al carrito'}
          </button>
        </div>
      </div>
      <AvisoAdmin abierto={avisoAbierto} onCerrar={() => setAvisoAbierto(false)} />
    </div>
  )
}