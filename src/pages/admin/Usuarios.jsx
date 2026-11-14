import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api, useApi, Estado } from '../../api.jsx'
import { useSesion } from '../../context/sesion.js'
import BotonEliminar from '../../components/BotonEliminar.jsx'

function Usuarios() {
  const [error, setError] = useState('')
  const { datos: usuarios, error: errorCarga, recargar } = useApi('/usuarios')
  const { usuario: actual } = useSesion()
  if (!usuarios) return <Estado error={errorCarga} />

  async function eliminar(id) {
    try {
      await api(`/usuarios/${id}`, { method: 'DELETE' })
      setError('')
      recargar()
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
        <h1 className="h3 mb-0">Usuarios</h1>
        <Link className="btn btn-primary" to="/admin/usuarios/nuevo">Nuevo usuario</Link>
      </div>

      {error && <div className="alert alert-danger" role="alert">{error}</div>}

      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => {
              const nombre = `${u.nombre} ${u.apellidos}`
              return (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{nombre}</td>
                  <td>{u.correo}</td>
                  <td>
                    <span className={`badge ${u.rol === 'ADMIN' ? 'text-bg-dark' : u.rol === 'VENDEDOR' ? 'text-bg-info' : 'text-bg-secondary'}`}>{u.rol}</span>
                  </td>
                  <td className="text-nowrap">
                    <Link className="btn btn-sm btn-outline-secondary me-1" to={`/admin/usuarios/${u.id}`} aria-label={`Ver ${nombre}`}>
                      Ver
                    </Link>
                    <Link className="btn btn-sm btn-outline-primary me-1" to={`/admin/usuarios/${u.id}/editar`} aria-label={`Editar ${nombre}`}>
                      Editar
                    </Link>
                    {/* El admin no puede eliminarse a sí mismo */}
                    {u.id !== actual?.id && <BotonEliminar nombre={nombre} onEliminar={() => eliminar(u.id)} />}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default Usuarios
