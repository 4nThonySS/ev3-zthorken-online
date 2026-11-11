import { useEffect } from 'react'

// Popup (modal de Bootstrap controlado con estado de React) para cuentas de administrador
export default function AvisoAdmin({ abierto, onCerrar }) {
  // Se cierra con la tecla Escape
  useEffect(() => {
    if (!abierto) return
    const alPresionar = (e) => e.key === 'Escape' && onCerrar()
    document.addEventListener('keydown', alPresionar)
    return () => document.removeEventListener('keydown', alPresionar)
  }, [abierto, onCerrar])

  if (!abierto) return null

  return (
    <>
      <div
        className="modal fade show d-block"
        tabIndex="-1"
        role="dialog"
        aria-modal="true"
        aria-labelledby="avisoAdminTitulo"
        onClick={onCerrar}
      >
        <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="avisoAdminTitulo">Cuenta de administrador</h5>
              <button type="button" className="btn-close" aria-label="Cerrar" onClick={onCerrar}></button>
            </div>
            <div className="modal-body">
              <p className="mb-0">
                Usted es administrador y no puede realizar compras. Para comprar, cierre sesión e
                ingrese con una cuenta de cliente.
              </p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" onClick={onCerrar}>Entendido</button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  )
}