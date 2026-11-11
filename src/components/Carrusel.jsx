import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

// slides: [{ titulo, texto, imagen, enlace, boton }]
function Carrusel({ slides, intervalo = 5000 }) {
  const [actual, setActual] = useState(0)
  const total = slides.length

  // Avanza solo; el temporizador se reinicia cada vez que cambia la diapositiva
  useEffect(() => {
    if (!intervalo || total < 2) return
    const id = setInterval(() => setActual((i) => (i + 1) % total), intervalo)
    return () => clearInterval(id)
  }, [actual, total, intervalo])

  function anterior() {
    setActual((i) => (i - 1 + total) % total)
  }

  function siguiente() {
    setActual((i) => (i + 1) % total)
  }

  return (
    <div className="carousel slide" aria-roledescription="carrusel">
      <div className="carousel-indicators">
        {slides.map((s, i) => (
          <button
            key={s.titulo}
            type="button"
            className={i === actual ? 'active' : ''}
            aria-current={i === actual}
            aria-label={`Ir a la diapositiva ${i + 1}`}
            onClick={() => setActual(i)}
          />
        ))}
      </div>

      <div className="carousel-inner">
        {slides.map((s, i) => (
          <div className={`carousel-item ${i === actual ? 'active' : ''}`} key={s.titulo}>
            <img src={s.imagen} className="d-block w-100 object-fit-cover" style={{ height: 380, filter: 'brightness(0.5)' }} alt="" />
            <div className="carousel-caption">
              <h2>{s.titulo}</h2>
              <p>{s.texto}</p>
              {s.enlace && <Link className="btn btn-light" to={s.enlace}>{s.boton}</Link>}
            </div>
          </div>
        ))}
      </div>

      <button className="carousel-control-prev" type="button" onClick={anterior}>
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Anterior</span>
      </button>
      <button className="carousel-control-next" type="button" onClick={siguiente}>
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Siguiente</span>
      </button>
    </div>
  )
}

export default Carrusel
