import { useState } from 'react'

function maximoRedondo(valor) {
  if (valor <= 0) return 1
  const potencia = 10 ** Math.floor(Math.log10(valor))
  const paso = [1, 2, 2.5, 5, 10].find((p) => p * potencia >= valor)
  return paso * potencia
}

function porcentaje(valor, maximo) {
  return maximo > 0 ? (valor / maximo) * 100 : 0
}

export function GraficoBarras({ titulo, descripcion, datos, formato = String, vacio = 'Sin datos para mostrar.' }) {
  const [activo, setActivo] = useState(null)
  const maximo = Math.max(0, ...datos.map((d) => d.valor))

  return (
    <figure className="grafico card shadow-sm h-100 mb-0">
      <div className="card-body">
        <figcaption>
          <h3 className="h6 mb-1">{titulo}</h3>
          {descripcion && <p className="small text-secondary mb-3">{descripcion}</p>}
        </figcaption>
        {maximo === 0 ? (
          <p className="small text-secondary mb-0">{vacio}</p>
        ) : (
          <ul className="grafico-barras list-unstyled mb-0" aria-label={titulo}>
            {datos.map((d, i) => (
              <li
                key={d.id ?? d.nombre}
                className={`grafico-fila ${activo === i ? 'activa' : ''}`}
                tabIndex={0}
                onMouseEnter={() => setActivo(i)}
                onMouseLeave={() => setActivo(null)}
                onFocus={() => setActivo(i)}
                onBlur={() => setActivo(null)}
              >
                <span className="grafico-etiqueta" title={d.nombre}>
                  {d.nombre}
                  {d.marca && <span className="badge text-bg-danger ms-2">{d.marca}</span>}
                </span>
                <span className="grafico-pista">
                  <span className="grafico-barra" style={{ width: `${porcentaje(d.valor, maximo)}%` }} />
                  <span className="grafico-valor">{formato(d.valor)}</span>
                  {activo === i && (
                    <span className="grafico-tooltip" role="tooltip">
                      <strong>{d.nombre}</strong>
                      <span>{formato(d.valor)}</span>
                      {d.detalle && <span className="text-secondary">{d.detalle}</span>}
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </figure>
  )
}

export function GraficoColumnas({ titulo, descripcion, datos, formato = String, formatoEje = formato }) {
  const [activo, setActivo] = useState(null)
  const maximo = maximoRedondo(Math.max(0, ...datos.map((d) => d.valor)))
  const lineas = [maximo, maximo / 2, 0]

  return (
    <figure className="grafico card shadow-sm h-100 mb-0">
      <div className="card-body">
        <figcaption>
          <h3 className="h6 mb-1">{titulo}</h3>
          {descripcion && <p className="small text-secondary mb-3">{descripcion}</p>}
        </figcaption>
        <div className="grafico-columnas">
          <div className="grafico-eje" aria-hidden="true">
            {lineas.map((v) => <span key={v}>{formatoEje(v)}</span>)}
          </div>
          <div className="grafico-area">
            {lineas.map((v) => (
              <span key={v} className="grafico-grilla" style={{ bottom: `${porcentaje(v, maximo)}%` }} />
            ))}
            <ul className="grafico-plot list-unstyled mb-0" aria-label={titulo}>
              {datos.map((d, i) => (
                <li
                  key={d.id ?? d.etiqueta}
                  className={`grafico-columna ${activo === i ? 'activa' : ''}`}
                  tabIndex={0}
                  aria-label={`${d.etiqueta}: ${formato(d.valor)}`}
                  onMouseEnter={() => setActivo(i)}
                  onMouseLeave={() => setActivo(null)}
                  onFocus={() => setActivo(i)}
                  onBlur={() => setActivo(null)}
                >
                  <span className="grafico-columna-barra" style={{ height: `${porcentaje(d.valor, maximo)}%` }} />
                  {activo === i && (
                    <span className="grafico-tooltip" role="tooltip">
                      <strong>{d.etiqueta}</strong>
                      <span>{formato(d.valor)}</span>
                      {d.detalle && <span className="text-secondary">{d.detalle}</span>}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div />
          <div className="grafico-etiquetas-x" aria-hidden="true">
            {datos.map((d) => <span key={d.id ?? d.etiqueta}>{d.etiqueta}</span>)}
          </div>
        </div>
      </div>
    </figure>
  )
}

export function BarraSegmentada({ titulo, descripcion, partes, formato = String }) {
  const total = partes.reduce((suma, p) => suma + p.valor, 0)

  return (
    <figure className="grafico card shadow-sm h-100 mb-0">
      <div className="card-body">
        <figcaption>
          <h3 className="h6 mb-1">{titulo}</h3>
          {descripcion && <p className="small text-secondary mb-3">{descripcion}</p>}
        </figcaption>
        {total === 0 ? (
          <p className="small text-secondary mb-0">Sin datos para mostrar.</p>
        ) : (
          <>
            <div className="grafico-segmentos" role="img"
              aria-label={partes.map((p) => `${p.nombre}: ${formato(p.valor)}`).join(', ')}>
              {partes.map((p, i) => p.valor > 0 && (
                <span key={p.nombre} className={`grafico-segmento serie-${i + 1}`}
                  style={{ flexGrow: p.valor }} title={`${p.nombre}: ${formato(p.valor)}`} />
              ))}
            </div>
            <ul className="grafico-leyenda list-unstyled mb-0 mt-3">
              {partes.map((p, i) => (
                <li key={p.nombre}>
                  <span className={`grafico-muestra serie-${i + 1}`} aria-hidden="true" />
                  <span>{p.nombre}</span>
                  <span className="ms-auto fw-semibold">{formato(p.valor)}</span>
                  <span className="text-secondary grafico-pct">{Math.round(porcentaje(p.valor, total))}%</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </figure>
  )
}
