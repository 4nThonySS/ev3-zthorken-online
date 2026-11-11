import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getAll, remove } from '../../data/db.js'
import { useSesion } from '../../context/sesion.js'
import BotonEliminar from '../../components/BotonEliminar.jsx'

function Usuarios() {
  const [usuarios, setUsuarios] = useState(() => getAll('usuarios'))
  const { usuario: actual } = useSesion()

  function eliminar(id) {
    remove('usuarios', id)
    setUsuarios(getAll('usuarios'))
  }

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
        <h1 className="h3 mb-0">Usuarios</h1>
        <Link className="btn btn-primary" to="/admin/usuarios/nuevo">Nuevo usuario</Link>
      </div>

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
                    <span className={`badge ${u.rol === 'admin' ? 'text-bg-dark' : 'text-bg-secondary'}`}>{u.rol}</span>
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
