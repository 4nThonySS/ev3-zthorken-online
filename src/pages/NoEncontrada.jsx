import { Link } from 'react-router-dom'

function NoEncontrada() {
  return (
    <main className="container py-5 text-center">
      <p className="display-1 fw-bold text-secondary mb-0">404</p>
      <h1 className="h3">Página no encontrada</h1>
      <p className="text-secondary">La página que buscas no existe o cambió de dirección.</p>
      <div className="d-flex gap-2 justify-content-center">
        <Link className="btn btn-primary" to="/">Ir al inicio</Link>
        <Link className="btn btn-outline-secondary" to="/productos">Ver productos</Link>
      </div>
    </main>
  )
}

export default NoEncontrada
