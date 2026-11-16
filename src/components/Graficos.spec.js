import { render, screen, fireEvent, within } from '@testing-library/react'
import { BarraSegmentada, GraficoBarras, GraficoColumnas } from './Graficos.jsx'
import { formatearPrecioCorto, ultimosMeses } from '../utils/formato.js'

const datos = [
  { id: 1, nombre: 'Audio', valor: 50, detalle: '3 productos' },
  { id: 2, nombre: 'Monitores', valor: 100, marca: 'Crítico' },
  { id: 3, nombre: 'Sillas', valor: 0 },
]

const ancho = (fila) => fila.querySelector('.grafico-barra').style.width

describe('GraficoBarras', () => {
  it('dibuja una barra por dato, proporcional al mayor valor', () => {
    render(<GraficoBarras titulo="Stock" datos={datos} formato={(v) => `${v} u.`} />)
    const filas = within(screen.getByRole('list', { name: 'Stock' })).getAllByRole('listitem')
    expect(filas.length).toBe(3)
    expect(ancho(filas[0])).toBe('50%')
    expect(ancho(filas[1])).toBe('100%')
    expect(ancho(filas[2])).toBe('0%')
    expect(filas[1].textContent).toContain('100 u.')
    expect(within(filas[1]).getByText('Crítico')).toBeTruthy()
  })

  it('muestra el detalle al pasar el mouse o enfocar con el teclado', () => {
    render(<GraficoBarras titulo="Stock" datos={datos} />)
    const fila = screen.getByText('Audio').closest('li')
    expect(screen.queryByRole('tooltip')).toBeNull()
    fireEvent.mouseEnter(fila)
    expect(screen.getByRole('tooltip').textContent).toContain('3 productos')
    fireEvent.mouseLeave(fila)
    expect(screen.queryByRole('tooltip')).toBeNull()
    fireEvent.focus(fila)
    expect(screen.getByRole('tooltip').textContent).toContain('Audio')
  })

  it('avisa cuando todos los valores son cero', () => {
    render(<GraficoBarras titulo="Ventas" datos={[{ nombre: 'A', valor: 0 }]} vacio="Nada aún." />)
    expect(screen.getByText('Nada aún.')).toBeTruthy()
    expect(screen.queryByRole('list')).toBeNull()
  })
})

describe('GraficoColumnas', () => {
  const meses = [
    { etiqueta: 'oct 26', valor: 150000, detalle: '1 orden' },
    { etiqueta: 'nov 26', valor: 0 },
  ]

  it('escala las columnas a un máximo redondo y rotula el eje', () => {
    render(<GraficoColumnas titulo="Ventas" datos={meses} formatoEje={formatearPrecioCorto} />)
    const columnas = within(screen.getByRole('list', { name: 'Ventas' })).getAllByRole('listitem')
    expect(columnas[0].querySelector('.grafico-columna-barra').style.height).toBe('75%')
    expect(columnas[1].querySelector('.grafico-columna-barra').style.height).toBe('0%')
    expect(screen.getByText('$200 mil')).toBeTruthy()
  })

  it('muestra el valor del mes en el tooltip', () => {
    render(<GraficoColumnas titulo="Ventas" datos={meses} formato={(v) => `$${v}`} />)
    fireEvent.mouseEnter(screen.getByLabelText('oct 26: $150000'))
    expect(screen.getByRole('tooltip').textContent).toBe('oct 26$1500001 orden')
  })
})

describe('BarraSegmentada', () => {
  it('muestra la leyenda con cantidades y porcentajes', () => {
    render(<BarraSegmentada titulo="Estados" partes={[{ nombre: 'Pagadas', valor: 3 }, { nombre: 'Anuladas', valor: 1 }]} />)
    expect(screen.getByRole('img').getAttribute('aria-label')).toBe('Pagadas: 3, Anuladas: 1')
    expect(screen.getByText('75%')).toBeTruthy()
    expect(screen.getByText('25%')).toBeTruthy()
  })

  it('mantiene el color de cada estado aunque otro tenga cero', () => {
    const { container } = render(<BarraSegmentada titulo="Estados" partes={[{ nombre: 'Pagadas', valor: 0 }, { nombre: 'Anuladas', valor: 2 }]} />)
    const segmentos = container.querySelectorAll('.grafico-segmento')
    expect(segmentos.length).toBe(1)
    expect(segmentos[0].classList).toContain('serie-2')
  })

  it('avisa cuando no hay datos', () => {
    render(<BarraSegmentada titulo="Estados" partes={[{ nombre: 'Pagadas', valor: 0 }]} />)
    expect(screen.getByText('Sin datos para mostrar.')).toBeTruthy()
  })
})

describe('formato para gráficos', () => {
  it('abrevia montos grandes', () => {
    expect(formatearPrecioCorto(1500000)).toBe('$1,5 M')
    expect(formatearPrecioCorto(129970)).toBe('$130 mil')
    expect(formatearPrecioCorto(500)).toBe('$500')
  })

  it('genera los últimos meses terminando en el actual', () => {
    const meses = ultimosMeses(3, new Date(2026, 0, 15))
    expect(meses.map((m) => m.clave)).toEqual(['2025-11', '2025-12', '2026-01'])
  })
})
