import { createContext, useContext, useEffect, useState } from 'react'

const CartContext = createContext(null)
const CLAVE = 'zthorken_carrito'

function leerCarrito() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE)) || []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(leerCarrito)

  useEffect(() => {
    localStorage.setItem(CLAVE, JSON.stringify(items))
  }, [items])

  const agregar = (producto, cantidad = 1) => {
    setItems((prev) => {
      const existe = prev.find((i) => i.productoId === producto.id)
      if (existe) {
        return prev.map((i) =>
          i.productoId === producto.id
            ? { ...i, cantidad: i.cantidad + cantidad }
            : i
        )
      }
      return [
        ...prev,
        {
          productoId: producto.id,
          nombre: producto.nombre,
          precio: producto.precioOferta ?? producto.precio,
          imagen: producto.imagen,
          cantidad,
        },
      ]
    })
  }

  const quitar = (productoId) =>
    setItems((prev) => prev.filter((i) => i.productoId !== productoId))

  const cambiarCantidad = (productoId, cantidad) => {
    if (cantidad <= 0) return quitar(productoId)
    setItems((prev) =>
      prev.map((i) => (i.productoId === productoId ? { ...i, cantidad } : i))
    )
  }

  const limpiar = () => setItems([])

  const total = items.reduce((suma, i) => suma + i.precio * i.cantidad, 0)
  const cantidadTotal = items.reduce((suma, i) => suma + i.cantidad, 0)

  return (
    <CartContext.Provider
      value={{ items, agregar, quitar, cambiarCantidad, limpiar, total, cantidadTotal }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart debe usarse dentro de <CartProvider>')
  return ctx
}