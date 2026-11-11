import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { getById } from '../data/db.js'
import { formatoCLP } from '../components/ProductCard.jsx'

export default function Carrito() {
  const { items, cambiarCantidad, quitar, limpiar, total } = useCart()

  if (items.length === 0) {
    return (
      <div className="container my-5 text-center">
        <h1 className="mb-3">Carrito</h1>
        <p className="text-muted">Tu carrito está vacío.</p>
        <Link to="/productos" className="btn btn-primary">Ver productos</Link>
      </div>
    )
  }

  return (
    <div className="container my-4">
      <Link to="/productos" className="btn btn-link ps-0 mb-3">← Seguir comprando</Link>
      <h1 className="mb-4">Carrito</h1>

      <div className="table-responsive">
        <table className="table align-middle">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Precio</th>
              <th>Cantidad</th>
              <th>Subtotal</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((i) => {
              const producto = getById('productos', i.productoId)
              const stock = producto?.stock ?? Infinity
              return (
                <tr key={i.productoId}>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <img src={producto?.imagen ?? i.imagen} alt="" width="56" height="56" className="rounded object-fit-cover" />
                      {i.nombre}
                    </div>
                  </td>
                  <td>{formatoCLP(i.precio)}</td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        aria-label={`Disminuir ${i.nombre}`}
                        onClick={() => cambiarCantidad(i.productoId, i.cantidad - 1)}
                      >
                        −
                      </button>
                      <span>{i.cantidad}</span>
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        aria-label={`Aumentar ${i.nombre}`}
                        disabled={i.cantidad >= stock}
                        onClick={() => cambiarCantidad(i.productoId, i.cantidad + 1)}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td>{formatoCLP(i.precio * i.cantidad)}</td>
                  <td>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => quitar(i.productoId)}
                    >
                      Quitar
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
        <button className="btn btn-outline-secondary" onClick={limpiar}>
          Vaciar carrito
        </button>
        <div className="text-end">
          <h4 className="mb-2">Total: {formatoCLP(total)}</h4>
          <Link to="/checkout" className="btn btn-success">Ir a pagar</Link>
        </div>
      </div>
    </div>
  )
}