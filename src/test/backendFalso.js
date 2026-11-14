// Backend falso para los tests: reemplaza window.fetch y responde como la API real (/api/v1),
// con los mismos datos iniciales que carga el backend. No revisa permisos: eso se prueba en el backend.
//
// Uso en un spec:
//   beforeEach(() => instalarBackend())
//   ...
//   expect(backend.productos.length).toBe(11)   // los datos quedan en `backend` para revisarlos
import { waitFor } from '@testing-library/react'
import { API_URL } from '../api.jsx'

const CATEGORIAS = [
    { id: 1, nombre: 'Computadores', imagen: '/img/categorias/computadores.jpg' },
    { id: 2, nombre: 'Notebooks', imagen: '/img/categorias/notebooks.jpg' },
    { id: 3, nombre: 'Audio', imagen: '/img/categorias/audio.jpg' },
    { id: 4, nombre: 'Periféricos', imagen: '/img/categorias/perifericos.jpg' },
    { id: 5, nombre: 'Monitores', imagen: '/img/categorias/monitores.jpg' },
    { id: 6, nombre: 'Componentes', imagen: '/img/categorias/componentes.jpg' },
]

const PRODUCTOS = [
    { id: 1, nombre: 'PC Gamer Ryzen 5 RTX 4060', descripcion: 'Ryzen 5 7600, 16 GB RAM, SSD 1 TB, RTX 4060 8 GB.', precio: 899990, precioOferta: null, stock: 8, stockCritico: 3, categoriaId: 1, imagen: '/img/productos/pc-gamer.jpg' },
    { id: 2, nombre: 'PC Oficina Intel Core i5', descripcion: 'Core i5 12400, 8 GB RAM, SSD 512 GB, Windows 11.', precio: 449990, precioOferta: 399990, stock: 12, stockCritico: 3, categoriaId: 1, imagen: '/img/productos/pc-oficina.jpg' },
    { id: 3, nombre: 'Notebook Lenovo IdeaPad 3', descripcion: '15,6" Full HD, Ryzen 5, 8 GB RAM, SSD 512 GB.', precio: 499990, precioOferta: null, stock: 15, stockCritico: 4, categoriaId: 2, imagen: '/img/productos/notebook-lenovo.jpg' },
    { id: 4, nombre: 'Notebook ASUS TUF Gaming F15', descripcion: '15,6" 144 Hz, Core i7, 16 GB RAM, RTX 4050.', precio: 1099990, precioOferta: 949990, stock: 2, stockCritico: 3, categoriaId: 2, imagen: '/img/productos/notebook-asus.jpg' },
    { id: 5, nombre: 'Audífonos HyperX Cloud II', descripcion: 'Audífonos gamer con sonido 7.1 y micrófono desmontable.', precio: 79990, precioOferta: 59990, stock: 20, stockCritico: 5, categoriaId: 3, imagen: '/img/productos/audifonos-hyperx.jpg' },
    { id: 6, nombre: 'Parlante JBL Flip 6', descripcion: 'Parlante Bluetooth portátil resistente al agua.', precio: 109990, precioOferta: null, stock: 10, stockCritico: 3, categoriaId: 3, imagen: '/img/productos/parlante-jbl.jpg' },
    { id: 7, nombre: 'Teclado Mecánico Redragon Kumara', descripcion: 'Teclado mecánico TKL con switches rojos y retroiluminación.', precio: 34990, precioOferta: null, stock: 25, stockCritico: 5, categoriaId: 4, imagen: '/img/productos/teclado-redragon.jpg' },
    { id: 8, nombre: 'Mouse Logitech G502 Hero', descripcion: 'Mouse gamer 25.600 DPI con 11 botones programables.', precio: 49990, precioOferta: 39990, stock: 4, stockCritico: 5, categoriaId: 4, imagen: '/img/productos/mouse-logitech.jpg' },
    { id: 9, nombre: 'Monitor Samsung 24" Full HD', descripcion: 'Panel IPS 24", 75 Hz, HDMI.', precio: 129990, precioOferta: null, stock: 14, stockCritico: 4, categoriaId: 5, imagen: '/img/productos/monitor-samsung.jpg' },
    { id: 10, nombre: 'Monitor LG UltraGear 27" 165 Hz', descripcion: 'Panel IPS 27" QHD, 165 Hz, 1 ms.', precio: 289990, precioOferta: 249990, stock: 6, stockCritico: 3, categoriaId: 5, imagen: '/img/productos/monitor-lg.jpg' },
    { id: 11, nombre: 'Tarjeta de video RTX 4060 8 GB', descripcion: 'GPU NVIDIA GeForce RTX 4060 con DLSS 3.', precio: 349990, precioOferta: null, stock: 3, stockCritico: 3, categoriaId: 6, imagen: '/img/productos/tarjeta-video.jpg' },
    { id: 12, nombre: 'SSD Kingston NV2 1 TB', descripcion: 'Unidad SSD NVMe PCIe 4.0 de 1 TB.', precio: 54990, precioOferta: 44990, stock: 30, stockCritico: 5, categoriaId: 6, imagen: '/img/productos/ssd-kingston.jpg' },
]

const USUARIOS = [
  { id: 1, nombre: 'Admin', apellidos: 'Zthorken', correo: 'admin@zthorken.cl', password: 'admin123', rol: 'ADMIN', calle: null, departamento: null, region: null, comuna: null },
  { id: 2, nombre: 'Valentina', apellidos: 'Soto', correo: 'vendedor@zthorken.cl', password: 'vendedor123', rol: 'VENDEDOR', calle: null, departamento: null, region: null, comuna: null },
  { id: 3, nombre: 'Pedro', apellidos: 'Pérez', correo: 'pedro@correo.cl', password: 'pedro123', rol: 'CLIENTE', calle: 'Los Crisantemos 123', departamento: 'Depto 603', region: 'Región Metropolitana de Santiago', comuna: 'Cerrillos' },
]

const BOLETAS = [
  {
    id: 1,
    usuarioId: 3,
    fecha: '2026-10-01T12:00:00',
    estado: 'PAGADA',
    total: 129970,
    cliente: { nombre: 'Pedro', apellidos: 'Pérez', correo: 'pedro@correo.cl' },
    direccion: { calle: 'Los Crisantemos 123', departamento: 'Depto 603', region: 'Región Metropolitana de Santiago', comuna: 'Cerrillos', indicaciones: '' },
    items: [
      { productoId: 5, nombre: 'Audífonos HyperX Cloud II', precio: 59990, cantidad: 1, subtotal: 59990 },
      { productoId: 7, nombre: 'Teclado Mecánico Redragon Kumara', precio: 34990, cantidad: 2, subtotal: 69980 },
    ],
  },
]

// Estado actual del backend falso (se reinicia con instalarBackend)
export const backend = { categorias: [], productos: [], usuarios: [], boletas: [], peticiones: [] }

class ErrorApi extends Error {
  constructor(status, mensaje, campos = null) {
    super(mensaje)
    this.status = status
    this.campos = campos
  }
}

const noExiste = (recurso, id) => new ErrorApi(404, `${recurso} con id ${id} no existe`)
const siguienteId = (lista) => Math.max(0, ...lista.map((x) => x.id)) + 1
const sinPassword = ({ password: _password, ...u }) => u

function buscar(lista, id, recurso) {
  const item = lista.find((x) => x.id === Number(id))
  if (!item) throw noExiste(recurso, id)
  return item
}

function producto(p) {
  const categoria = backend.categorias.find((c) => c.id === p.categoriaId)
  return { ...p, precioFinal: p.precioOferta ?? p.precio, enStockCritico: p.stock <= p.stockCritico, categoriaNombre: categoria?.nombre }
}

function guardarUsuario(u, datos) {
  const correo = datos.correo.trim().toLowerCase()
  if (backend.usuarios.some((otro) => otro.correo === correo && otro.id !== u.id)) {
    throw new ErrorApi(400, `Ya existe un usuario con el correo ${correo}`)
  }
  Object.assign(u, { ...datos, correo, rol: datos.rol ?? 'CLIENTE', password: datos.password || u.password })
  return sinPassword(u)
}

function crearBoleta({ cliente, direccion, items }) {
  if (!items?.length) throw new ErrorApi(400, 'Datos inválidos', { items: 'La boleta debe tener al menos un producto' })
  const lineas = items.map((i) => {
    const p = buscar(backend.productos, i.productoId, 'Producto')
    if (i.cantidad > p.stock) {
      throw new ErrorApi(400, `Stock insuficiente para ${p.nombre}: disponible ${p.stock}, solicitado ${i.cantidad}`)
    }
    const precio = p.precioOferta ?? p.precio
    return { p, linea: { productoId: p.id, nombre: p.nombre, precio, cantidad: i.cantidad, subtotal: precio * i.cantidad } }
  })
  lineas.forEach(({ p, linea }) => (p.stock -= linea.cantidad))
  const boleta = {
    id: siguienteId(backend.boletas),
    usuarioId: backend.sesionId ?? null,
    fecha: '2026-11-14T10:00:00',
    estado: 'PAGADA',
    total: lineas.reduce((suma, { linea }) => suma + linea.subtotal, 0),
    cliente,
    direccion,
    items: lineas.map(({ linea }) => linea),
  }
  backend.boletas.unshift(boleta)
  return boleta
}

// [método, ruta con :id, función(id, body, query)]
const RUTAS = [
  ['POST', '/auth/login', (_, { correo, password }) => {
    const u = backend.usuarios.find((x) => x.correo === correo.trim().toLowerCase() && x.password === password)
    if (!u) throw new ErrorApi(401, 'Correo o contraseña incorrectos')
    return { token: `token-${u.id}`, usuario: sinPassword(u) }
  }],
  ['POST', '/auth/register', (_, datos) => {
    const u = { id: siguienteId(backend.usuarios) }
    backend.usuarios.push(u)
    try {
      return { token: `token-${u.id}`, usuario: guardarUsuario(u, { ...datos, rol: 'CLIENTE' }) }
    } catch (e) {
      backend.usuarios.pop()
      throw e
    }
  }],
  ['PUT', '/auth/perfil', (_, datos) => {
    const u = buscar(backend.usuarios, backend.sesionId, 'Usuario')
    return guardarUsuario(u, { ...datos, rol: u.rol })
  }],

  ['GET', '/categorias', () => backend.categorias],
  ['GET', '/categorias/:id', (id) => buscar(backend.categorias, id, 'Categoría')],
  ['POST', '/categorias', (_, datos) => {
    if (backend.categorias.some((c) => c.nombre.toLowerCase() === datos.nombre.toLowerCase())) {
      throw new ErrorApi(400, `Ya existe la categoría ${datos.nombre}`)
    }
    const c = { ...datos, id: siguienteId(backend.categorias) }
    backend.categorias.push(c)
    return c
  }],
  ['PUT', '/categorias/:id', (id, datos) => Object.assign(buscar(backend.categorias, id, 'Categoría'), datos)],
  ['DELETE', '/categorias/:id', (id) => {
    const c = buscar(backend.categorias, id, 'Categoría')
    if (backend.productos.some((p) => p.categoriaId === c.id)) {
      throw new ErrorApi(400, `No se puede eliminar la categoría ${c.nombre} porque tiene productos`)
    }
    backend.categorias = backend.categorias.filter((x) => x !== c)
  }],

  ['GET', '/productos', (_, __, q) => backend.productos
    .filter((p) => !q.get('categoriaId') || p.categoriaId === Number(q.get('categoriaId')))
    .filter((p) => q.get('oferta') !== 'true' || p.precioOferta != null)
    .map(producto)],
  ['GET', '/productos/stock-critico', () => backend.productos.filter((p) => p.stock <= p.stockCritico).map(producto)],
  ['GET', '/productos/:id', (id) => producto(buscar(backend.productos, id, 'Producto'))],
  ['POST', '/productos', (_, datos) => {
    const p = { ...datos, id: siguienteId(backend.productos) }
    backend.productos.push(p)
    return producto(p)
  }],
  ['PUT', '/productos/:id', (id, datos) => producto(Object.assign(buscar(backend.productos, id, 'Producto'), datos))],
  ['DELETE', '/productos/:id', (id) => {
    const p = buscar(backend.productos, id, 'Producto')
    backend.productos = backend.productos.filter((x) => x !== p)
  }],

  ['GET', '/usuarios', () => backend.usuarios.map(sinPassword)],
  ['GET', '/usuarios/:id', (id) => sinPassword(buscar(backend.usuarios, id, 'Usuario'))],
  ['POST', '/usuarios', (_, datos) => {
    const u = { id: siguienteId(backend.usuarios) }
    backend.usuarios.push(u)
    return guardarUsuario(u, datos)
  }],
  ['PUT', '/usuarios/:id', (id, datos) => guardarUsuario(buscar(backend.usuarios, id, 'Usuario'), datos)],
  ['DELETE', '/usuarios/:id', (id) => {
    const u = buscar(backend.usuarios, id, 'Usuario')
    backend.usuarios = backend.usuarios.filter((x) => x !== u)
  }],

  ['GET', '/boletas', (_, __, q) => backend.boletas.filter((b) => !q.get('usuarioId') || b.usuarioId === Number(q.get('usuarioId')))],
  ['GET', '/boletas/:id', (id) => buscar(backend.boletas, id, 'Boleta')],
  ['POST', '/boletas', (_, datos) => crearBoleta(datos)],
]

function respuesta(status, cuerpo) {
  return Promise.resolve(new Response(cuerpo === undefined ? null : JSON.stringify(cuerpo), {
    status,
    headers: { 'Content-Type': 'application/json' },
  }))
}

function atender(url, opciones = {}) {
  const metodo = opciones.method ?? 'GET'
  const { pathname, searchParams } = new URL(url)
  const ruta = pathname.slice(new URL(API_URL).pathname.length)
  const body = opciones.body ? JSON.parse(opciones.body) : undefined
  // El token falso es "token-<id del usuario>"
  backend.sesionId = Number(opciones.headers?.Authorization?.split('-')[1]) || null
  backend.peticiones.push(`${metodo} ${ruta}${searchParams.size ? '?' + searchParams : ''}`)

  for (const [m, patron, accion] of RUTAS) {
    const regex = new RegExp('^' + patron.replace(':id', '([^/]+)') + '$')
    const coincide = ruta.match(regex)
    if (m !== metodo || !coincide) continue
    if (coincide[1] !== undefined && !/^\d+$/.test(coincide[1])) return respuesta(400, { status: 400, mensaje: `El parámetro id no es válido` })
    try {
      const resultado = accion(coincide[1], body, searchParams)
      if (resultado === undefined) return respuesta(204)
      return respuesta(metodo === 'POST' ? 201 : 200, structuredClone(resultado))
    } catch (e) {
      if (!(e instanceof ErrorApi)) throw e
      return respuesta(e.status, { status: e.status, mensaje: e.message, campos: e.campos })
    }
  }
  return respuesta(404, { status: 404, mensaje: `Ruta ${metodo} ${ruta} no existe en el backend falso` })
}

// Reinicia los datos, limpia la sesión guardada y reemplaza fetch. Llamar en beforeEach.
export function instalarBackend() {
  backend.categorias = structuredClone(CATEGORIAS)
  backend.productos = structuredClone(PRODUCTOS)
  backend.usuarios = structuredClone(USUARIOS)
  backend.boletas = structuredClone(BOLETAS)
  backend.peticiones = []
  localStorage.removeItem('zthorken-sesion')
  spyOn(window, 'fetch').and.callFake(atender)
}

// Simula que el backend está caído
export function backendCaido() {
  window.fetch.and.callFake(() => Promise.reject(new TypeError('Failed to fetch')))
}

// Deja guardada una sesión, como si el usuario hubiera hecho login
export function iniciarSesion(correo) {
  const u = backend.usuarios.find((x) => x.correo === correo)
  localStorage.setItem('zthorken-sesion', JSON.stringify({ token: `token-${u.id}`, usuario: sinPassword(u) }))
  return sinPassword(u)
}

// Espera hasta que la condición sea verdadera. Con Jasmine, waitFor(() => expect(...)) no sirve:
// expect no lanza error al fallar, así que waitFor terminaría en el primer intento.
export function hasta(condicion) {
  return waitFor(() => {
    if (!condicion()) throw new Error('La condición no se cumplió a tiempo')
  })
}
