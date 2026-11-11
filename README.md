# Zthorken Online

Tienda online desarrollada con React, Bootstrap y React Router (DSY1104 - Evaluación 2).

## Requisitos

- Node.js 20 o superior
- Google Chrome (para ejecutar las pruebas)

## Comandos

```bash
npm install      # instalar dependencias
npm run dev      # servidor de desarrollo
npm run build    # compilar para producción
npm test         # pruebas unitarias con Jasmine + Karma y reporte de cobertura
```

## Cuentas de prueba

| Rol | Correo | Contraseña |
|---|---|---|
| Administrador | admin@zthorken.cl | admin123 |
| Cliente | pedro@correo.cl | pedro123 |

Con la cuenta de administrador aparece **Admin** en el menú «Mi cuenta», que lleva al panel (`/admin`). Si un cliente o un visitante entra a `/admin`, se le redirige al Home o a Iniciar sesión.

Para volver a los datos iniciales, borra el localStorage del sitio desde las herramientas del navegador.

## Vistas

- **Tienda:** Home, Productos, Detalle de producto, Categorías, Detalle de categoría, Ofertas, Carrito, Checkout, Pago exitoso, Pago con error, Nosotros, Blog, Detalle de blog, Contacto, Iniciar sesión, Registro y página 404.
- **Panel de administración (`/admin`):** Dashboard, Productos (listado, críticos, nuevo, detalle, editar), Categorías, Usuarios (listado, nuevo, detalle, editar), Órdenes y boleta, Reportes y Perfil.

## Estructura

```
src/
  components/    # componentes compartidos (Navbar, Footer, Carrusel, ProductCard...)
  context/       # estado global de sesión y carrito
  data/db.js     # base de datos simulada (CRUD + localStorage)
  pages/         # vistas de la tienda
  pages/admin/   # vistas del panel de administración
  utils/         # validaciones, formato y lógica del checkout
  App.jsx        # rutas
  main.jsx       # punto de entrada
```

## Datos

`src/data/db.js` guarda las colecciones `productos`, `categorias`, `usuarios`, `ordenes` y `blogs` en localStorage.

```js
import { getAll, getById, create, update, remove, resetDB } from './data/db.js'

getAll('productos')
getById('productos', 1)
create('categorias', { nombre: 'Accesorios' })
update('productos', 1, { stock: 10 })
remove('blogs', 2)
resetDB() // vuelve a los datos iniciales
```

## Pruebas

Los tests se escriben en archivos `*.spec.js` junto al componente (pueden usar JSX).

Al terminar, `npm test` muestra el resumen de cobertura en la terminal y genera el reporte completo en `coverage/index.html`.
