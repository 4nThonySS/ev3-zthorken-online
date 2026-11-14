// Datos que el backend no maneja (blog y mensajes de contacto). Se guardan en localStorage
// y se inicializan con SEED la primera vez. Productos, categorías, usuarios y órdenes vienen de la API (src/api.jsx).

// Se cambia la versión cuando cambian los datos iniciales, para que se vuelvan a cargar
const STORAGE_KEY = 'zthorken-db-v3'

const SEED = {
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
