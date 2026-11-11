// Base de datos simulada. Los datos se guardan en localStorage
// y se inicializan con SEED la primera vez.

// Se cambia la versión cuando cambian los datos iniciales, para que se vuelvan a cargar
const STORAGE_KEY = 'zthorken-db-v2'

// Imagen provisoria para productos y categorías nuevos sin foto
export const img = (texto) => `https://placehold.co/400x300?text=${encodeURIComponent(texto)}`

const SEED = {
  categorias: [
    { id: 1, nombre: 'Computadores', imagen: '/img/categorias/computadores.jpg' },
    { id: 2, nombre: 'Notebooks', imagen: '/img/categorias/notebooks.jpg' },
    { id: 3, nombre: 'Audio', imagen: '/img/categorias/audio.jpg' },
    { id: 4, nombre: 'Periféricos', imagen: '/img/categorias/perifericos.jpg' },
    { id: 5, nombre: 'Monitores', imagen: '/img/categorias/monitores.jpg' },
    { id: 6, nombre: 'Componentes', imagen: '/img/categorias/componentes.jpg' },
  ],
  productos: [
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
  ],
  usuarios: [
    { id: 1, nombre: 'Admin', apellidos: 'Zthorken', correo: 'admin@zthorken.cl', password: 'admin123', rol: 'admin', calle: '', departamento: '', region: '', comuna: '' },
    { id: 2, nombre: 'Pedro', apellidos: 'Pérez', correo: 'pedro@correo.cl', password: 'pedro123', rol: 'cliente', calle: 'Los Crisantemos 123', departamento: 'Depto 603', region: 'Región Metropolitana de Santiago', comuna: 'Cerrillos' },
  ],
  ordenes: [
    {
      id: 1,
      usuarioId: 2,
      fecha: '2026-10-01',
      estado: 'pagada',
      items: [
        { productoId: 5, nombre: 'Audífonos HyperX Cloud II', precio: 59990, cantidad: 1 },
        { productoId: 7, nombre: 'Teclado Mecánico Redragon Kumara', precio: 34990, cantidad: 2 },
      ],
      total: 129970,
      cliente: { nombre: 'Pedro', apellidos: 'Pérez', correo: 'pedro@correo.cl' },
      direccion: { calle: 'Los Crisantemos 123', departamento: 'Depto 603', region: 'Región Metropolitana de Santiago', comuna: 'Cerrillos', indicaciones: '' },
    },
  ],
  blogs: [
    {
      id: 1,
      titulo: '¿Notebook o PC de escritorio?',
      resumen: 'Te ayudamos a elegir el equipo ideal según cómo lo vas a usar.',
      contenido:
        'Es una de las preguntas que más nos hacen. La respuesta depende de cómo y dónde vas a usar tu equipo.\n\n' +
        'Si estudias o trabajas en distintos lugares, un notebook es la mejor opción: lo llevas a todas partes y hoy existen modelos con muy buen rendimiento y batería para todo el día.\n\n' +
        'Si buscas el máximo rendimiento por tu dinero, o quieres jugar y editar video, un PC de escritorio rinde más al mismo precio y te permite cambiar piezas con el tiempo, como la tarjeta de video o la memoria RAM.\n\n' +
        'Nuestro consejo: piensa primero en el uso que le darás y después en las especificaciones. Si tienes dudas, escríbenos y te ayudamos a elegir.',
      autor: 'Equipo Zthorken',
      fecha: '2026-09-15',
      imagen: '/img/blogs/notebook-o-pc.jpg',
    },
    {
      id: 2,
      titulo: 'Guía para armar tu setup',
      resumen: 'Monitor, teclado, mouse y audio: qué considerar para trabajar o jugar cómodo.',
      contenido:
        'Un buen setup no se trata solo del computador. Los periféricos que usas todos los días hacen una gran diferencia en tu comodidad y rendimiento.\n\n' +
        'Monitor: para trabajar, un monitor de 24" Full HD es suficiente. Si juegas, busca una tasa de refresco de 144 Hz o más y considera la resolución QHD.\n\n' +
        'Teclado y mouse: los teclados mecánicos son más duraderos y cómodos para escribir mucho. En el mouse, prioriza que se ajuste bien a tu mano.\n\n' +
        'Audio: unos buenos audífonos con micrófono te sirven tanto para reuniones como para jugar en línea. Y no olvides la postura: la parte superior de la pantalla debe quedar a la altura de tus ojos.',
      autor: 'Equipo Zthorken',
      fecha: '2026-10-05',
      imagen: '/img/blogs/setup.jpg',
    },
  ],
  mensajes: [],
}

function load() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY))
    // Si se agregan colecciones nuevas a SEED, se suman a los datos ya guardados
    if (data) return { ...structuredClone(SEED), ...data }
  } catch {
    // datos corruptos: se vuelve a la semilla
  }
  const data = structuredClone(SEED)
  save(data)
  return data
}

function save(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

function getCollection(data, coleccion) {
  if (!data[coleccion]) throw new Error(`La colección "${coleccion}" no existe`)
  return data[coleccion]
}

// Leer
export function getAll(coleccion) {
  return getCollection(load(), coleccion)
}

export function getById(coleccion, id) {
  return getAll(coleccion).find((item) => item.id === Number(id)) ?? null
}

// Crear
export function create(coleccion, item) {
  const data = load()
  const lista = getCollection(data, coleccion)
  const nuevo = { ...item, id: Math.max(0, ...lista.map((i) => i.id)) + 1 }
  lista.push(nuevo)
  save(data)
  return nuevo
}

// Actualizar
export function update(coleccion, id, cambios) {
  const data = load()
  const lista = getCollection(data, coleccion)
  const index = lista.findIndex((item) => item.id === Number(id))
  if (index === -1) return null
  lista[index] = { ...lista[index], ...cambios, id: lista[index].id }
  save(data)
  return lista[index]
}

// Eliminar
export function remove(coleccion, id) {
  const data = load()
  const lista = getCollection(data, coleccion)
  const index = lista.findIndex((item) => item.id === Number(id))
  if (index === -1) return false
  lista.splice(index, 1)
  save(data)
  return true
}

// Vuelve a los datos iniciales
export function resetDB() {
  localStorage.removeItem(STORAGE_KEY)
  return load()
}
