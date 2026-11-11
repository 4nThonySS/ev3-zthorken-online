import { Outlet } from 'react-router-dom'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'
import { useCart } from '../context/CartContext.jsx'

function Layout() {
  const { total } = useCart()

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar totalCarrito={total} />
      <Outlet />
      <Footer />
    </div>
  )
}

export default Layout