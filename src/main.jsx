import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './estilos.css'
import { SesionProvider } from './context/SesionProvider.jsx'
import { CartProvider } from './context/CartContext.jsx'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <SesionProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </SesionProvider>
    </BrowserRouter>
  </StrictMode>,
)