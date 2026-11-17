import { useState } from 'react'

const MAX_SERIES = 8

function maximoRedondo(valor) {
  if (valor <= 0) return 1
  const potencia = 10 ** Math.floor(Math.log10(valor))
  const paso = [1, 2, 2.5, 5, 10].find((p) => p * potencia >= valor)
  return paso * potencia
}

function porcentaje(valor, maximo) {
  return maximo > 0 ? (valor / maximo) * 100 : 0
}

function Encabezado({ titulo, descripcion }) {
  return (
    <figcaption>
      <h3 className="h6 mb-1">{titulo}</h3>
      {descripcion && <p className="small text-secondary mb-3">{descripcion}</p>}
    </figcaption>
  )
}

function Tooltip({ nombre, valor, detalle }) {
  return (
    <span className="grafico-tooltip" role="tooltip">
      <strong>{nombre}</strong>
      <span>{valor}</span>
      {detalle && <span className="text-secondary">{detalle}</span>}
    </span>
  )
}

function eventosHover(i, setActivo) {
  return {
    tabIndex: 0,
    onMouseEnter: () => setActivo(i),
    onMouseLeave: () => setActivo(null),
    onFocus: () => setActivo(i),
    onBlur: () => setActivo(null),
  }
}

export function GraficoBarras({ titulo, descripcion, datos, formato = String, vacio = 'Sin datos para mostrar.' }) {
  const [activo, setActivo] = useState(null)
  const maximo = Math.max(0, ...datos.map((d) => d.valor))

  return (
    <figure className="grafico card shadow-sm h-100 mb-0">
      <div className="card-body">
        <Encabezado titulo={titulo} descripcion={descripcion} />
        {maximo === 0 ? (
          <p className="small text-secondary mb-0">{vacio}</p>
        ) : (
          <ul className="grafico-barras list-unstyled mb-0" aria-label={titulo}>
            {datos.map((d, i) => (
              <li key={d.id ?? d.nombre} className={`grafico-fila ${activo === i ? 'activa' : ''}`} {...eventosHover(i, setActivo)}>
                <span className="grafico-etiqueta" title={d.nombre}>
                  {d.nombre}
                  {d.marca && <span className="badge text-bg-danger ms-2">{d.marca}</span>}
                </span>
                <span className="grafico-pista">
                  <span className="grafico-barra" style={{ width: `${porcentaje(d.valor, maximo)}%` }} />
                  <span className="grafico-valor">{formato(d.valor)}</span>
                  {activo === i && <Tooltip nombre={d.nombre} valor={formato(d.valor)} detalle={d.detalle} />}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </figure>
  )
}

const ANCHO = 600
const ALTO = 200

export function GraficoLineas({ titulo, descripcion, datos, formato = String, formatoEje = formato }) {
  const [activo, setActivo] = useState(null)
  const maximo = maximoRedondo(Math.max(0, ...datos.map((d) => d.valor)))
  const lineas = [maximo, maximo / 2, 0]
  const x = (i) => (datos.length > 1 ? (i / (datos.length - 1)) * 100 : 50)
  const y = (v) => 100 - porcentaje(v, maximo)
  const puntos = datos.map((d, i) => [(x(i) / 100) * ANCHO, (y(d.valor) / 100) * ALTO])
  const linea = puntos.map(([px, py], i) => `${i ? 'L' : 'M'}${px},${py}`).join(' ')
  const area = puntos.length ? `${linea} L${puntos.at(-1)[0]},${ALTO} L${puntos[0][0]},${ALTO} Z` : ''

  return (
    <figure className="grafico card shadow-sm h-100 mb-0">
      <div className="card-body">
        <Encabezado titulo={titulo} descripcion={descripcion} />
        <div className="grafico-lineas">
          <div className="grafico-eje" aria-hidden="true">
            {lineas.map((v) => <span key={v}>{formatoEje(v)}</span>)}
          </div>
          <div className="grafico-area">
            {lineas.map((v) => (
              <span key={v} className="grafico-grilla" style={{ bottom: `${porcentaje(v, maximo)}%` }} />
            ))}
            <svg className="grafico-svg" viewBox={`0 0 ${ANCHO} ${ALTO}`} preserveAspectRatio="none" aria-hidden="true">
              <path className="grafico-relleno" d={area} />
              <path className="grafico-trazo" d={linea} vectorEffect="non-scaling-stroke" />
            </svg>
            {activo !== null && (
              <span className="grafico-cursor" style={{ left: `${x(activo)}%` }} />
            )}
            <ul className="grafico-puntos list-unstyled mb-0" aria-label={titulo}>
              {datos.map((d, i) => (
                <li
                  key={d.id ?? d.etiqueta}
                  className={`grafico-punto ${activo === i ? 'activo' : ''}`}
                  style={{ left: `${x(i)}%`, top: `${y(d.valor)}%` }}
                  aria-label={`${d.etiqueta}: ${formato(d.valor)}`}
                  {...eventosHover(i, setActivo)}
                >
                  <span className="grafico-marca" />
                  {activo === i && <Tooltip nombre={d.etiqueta} valor={formato(d.valor)} detalle={d.detalle} />}
                </li>
              ))}
            </ul>
          </div>
          <div />
          <div className="grafico-etiquetas-x" aria-hidden="true">
            {datos.map((d, i) => (
              <span key={d.id ?? d.etiqueta} style={{ left: `${x(i)}%` }}>{d.etiqueta}</span>
            ))}
          </div>
        </div>
      </div>
    </figure>
  )
}

function agruparOtros(datos) {
  if (datos.length <= MAX_SERIES) return datos
  const ordenados = [...datos].sort((a, b) => b.valor - a.valor)
  const resto = ordenados.slice(MAX_SERIES - 1)
  return [
    ...ordenados.slice(0, MAX_SERIES - 1),
    { id: 'otros', nombre: 'Otros', serie: MAX_SERIES, valor: resto.reduce((s, d) => s + d.valor, 0), detalle: `${resto.length} más` },
  ]
}

export function GraficoDona({ titulo, descripcion, datos, formato = String, formatoCentro = formato, vacio = 'Sin datos para mostrar.', etiquetaTotal = 'Total' }) {
  const [activo, setActivo] = useState(null)
  const partes = agruparOtros(datos.map((d, i) => ({ ...d, serie: Math.min(d.serie ?? i + 1, MAX_SERIES) })))
  const total = partes.reduce((suma, p) => suma + p.valor, 0)
  const conValor = partes.map((p, i) => ({ ...p, indice: i })).filter((p) => p.valor > 0)
  const separacion = conValor.length > 1 ? 1 : 0

  const pcts = conValor.map((p) => porcentaje(p.valor, total))
  const arcos = conValor.map((p, i) => ({
    ...p,
    largo: Math.max(pcts[i] - separacion, 0.4),
    inicio: pcts.slice(0, i).reduce((s, v) => s + v, 0),
  }))

  const enfoque = activo === null ? null : partes[activo]

  return (
    <figure className="grafico card shadow-sm h-100 mb-0">
      <div className="card-body">
        <Encabezado titulo={titulo} descripcion={descripcion} />
        {total === 0 ? (
          <p className="small text-secondary mb-0">{vacio}</p>
        ) : (
          <div className="grafico-dona">
            <div className="grafico-dona-figura">
              <svg viewBox="0 0 42 42" role="img" aria-label={partes.map((p) => `${p.nombre}: ${formato(p.valor)}`).join(', ')}>
                <circle className="grafico-dona-fondo" cx="21" cy="21" r="15.9155" />
                {arcos.map((a) => (
                  <circle
                    key={a.id ?? a.nombre}
                    className={`grafico-arco serie-${a.serie} ${activo !== null && activo !== a.indice ? 'atenuado' : ''}`}
                    cx="21"
                    cy="21"
                    r="15.9155"
                    strokeDasharray={`${a.largo} ${100 - a.largo}`}
                    strokeDashoffset={25 - a.inicio - separacion / 2}
                    onMouseEnter={() => setActivo(a.indice)}
                    onMouseLeave={() => setActivo(null)}
                  />
                ))}
              </svg>
              <div className="grafico-dona-centro" aria-hidden="true">
                <span className="grafico-dona-valor">{formatoCentro(enfoque ? enfoque.valor : total)}</span>
                <span className="grafico-dona-texto">{enfoque ? enfoque.nombre : etiquetaTotal}</span>
              </div>
            </div>
            <ul className="grafico-leyenda list-unstyled mb-0" aria-label={titulo}>
              {partes.map((p, i) => (
                <li
                  key={p.id ?? p.nombre}
                  className={activo === i ? 'activa' : ''}
                  title={p.detalle}
                  {...eventosHover(i, setActivo)}
                >
                  <span className={`grafico-muestra serie-${p.serie}`} aria-hidden="true" />
                  <span className="grafico-leyenda-nombre">{p.nombre}</span>
                  <span className="ms-auto fw-semibold grafico-valor">{formato(p.valor)}</span>
                  <span className="text-secondary grafico-pct">{Math.round(porcentaje(p.valor, total))}%</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </figure>
  )
}
