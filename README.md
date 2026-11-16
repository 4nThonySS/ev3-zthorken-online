# Zthorken Online

Tienda online desarrollada con React, Bootstrap y React Router (DSY1104). Desde la Evaluación 3 los datos vienen del backend Spring Boot: [ev3-zthorken-backend](https://github.com/4nThonySS/ev3-zthorken-backend).

## Requisitos

- Node.js 20 o superior
- Google Chrome (para ejecutar las pruebas)
- El backend corriendo en `http://localhost:8080` (ver su README: `./mvnw spring-boot:run`)

La URL del backend se puede cambiar con la variable `VITE_API_URL` en un archivo `.env` (por defecto `http://localhost:8080/api/v1`).

## Comandos

```bash
npm install      # instalar dependencias
npm run dev      # servidor de desarrollo
npm run build    # compilar para producción
npm test         # pruebas unitarias con Jasmine + Karma y reporte de cobertura
```

## Cuentas de prueba

Las cuentas están en la base de datos del backend:

| Rol | Correo | Contraseña | Qué puede hacer |
|---|---|---|---|
| Administrador | admin@zthorken.cl | admin123 | Todo el panel (`/admin`) |
| Vendedor | vendedor@zthorken.cl | vendedor123 | En el panel solo ve productos y órdenes con su detalle |
| Cliente | pedro@correo.cl | pedro123 | Solo la tienda y sus compras |

Con la cuenta de administrador o vendedor aparece **Panel** en el menú «Mi cuenta». Si un cliente o un visitante entra a `/admin`, se le redirige al Home o a Iniciar sesión; si el vendedor entra a una página solo de admin, se le lleva a Órdenes.

Para volver a los datos iniciales, reinicia el backend (perfil `dev`, base H2 en memoria).

## Vistas

- **Tienda:** Home, Productos, Detalle de producto, Categorías, Detalle de categoría, Ofertas, Carrito, Checkout, Pago exitoso, Pago con error, Nosotros, Blog, Detalle de blog, Contacto, Iniciar sesión, Registro y página 404.
- **Panel de administración (`/admin`):** Dashboard, Productos (listado, críticos, nuevo, detalle, editar), Categorías, Usuarios (listado, nuevo, detalle, editar), Órdenes y boleta, Reportes y Perfil.

**Gráficos del panel** (componentes propios en `src/components/Graficos.jsx`, sin librerías externas; muestran el detalle al pasar el mouse o con Tab):

- **Dashboard:** ventas por mes de los últimos 6 meses y productos con menos stock, con los críticos marcados.
- **Reportes:** ventas por categoría, top 5 productos más vendidos, valor del inventario por categoría y órdenes pagadas frente a anuladas. Las tablas de abajo muestran los mismos datos en detalle.

## Estructura

```
src/
  components/    # componentes compartidos (Navbar, Footer, Carrusel, ProductCard...)
  context/       # estado global de sesión y carrito
  api.jsx        # cliente del backend: fetch con el token JWT y el hook useApi
  data/db.js     # blog y mensajes de contacto (localStorage; el backend no los maneja)
  test/          # backend falso para las pruebas
  pages/         # vistas de la tienda
  pages/admin/   # vistas del panel de administración
  utils/         # validaciones, formato y lógica del checkout
  App.jsx        # rutas
  main.jsx       # punto de entrada
```

## Datos

Productos, categorías, usuarios y órdenes se leen y guardan en el backend con `src/api.jsx`:

```js
import { api, useApi } from './api.jsx'

// En un componente: datos es null mientras carga
const { datos: productos, error, recargar } = useApi('/productos')

// Acciones: lanza un Error con el mensaje del backend si responde 4xx/5xx
await api('/productos', { method: 'POST', body: { nombre: 'Mouse', ... } })
```

El blog y los mensajes de contacto siguen en `src/data/db.js` (localStorage), porque el backend no tiene esas tablas.

## Sesión y permisos

- **Login:** `POST /auth/login` devuelve el token JWT, su fecha de expiración (`expiraEn`) y el usuario. Se guardan en localStorage, así que la sesión sigue activa al recargar la página.
- **Renovación:** 5 minutos antes de que venza, `SesionProvider` pide un token nuevo a `POST /auth/refresh`.
- **Expiración:** si el token vence o el backend responde 401, la sesión se borra y el panel lleva a Iniciar sesión con el aviso «Tu sesión expiró». Una sesión vencida guardada en el navegador se descarta al cargar la página.
- **Varias pestañas:** cerrar o iniciar sesión en una pestaña se refleja en las demás.
- **Permisos por rol:** `AdminLayout` solo deja entrar a admin y vendedor; `SoloAdmin` protege Dashboard, Categorías, Usuarios, Reportes y los formularios de productos. Los botones de crear, editar y eliminar solo aparecen para el admin. El backend vuelve a revisar cada permiso (401/403), así que ocultar algo en pantalla no es la única protección.

## Pruebas

Los tests se escriben en archivos `*.spec.js` junto al componente (pueden usar JSX). No necesitan el backend: `instalarBackend()` de `src/test/backendFalso.js` reemplaza `fetch` y responde como la API real con los mismos datos iniciales.

Si no tienes Chrome, puedes usar Edge: `CHROME_BIN="<ruta a msedge.exe>" npm test`.

Al terminar, `npm test` muestra el resumen de cobertura en la terminal y genera el reporte completo en `coverage/index.html`.
