// Pide confirmación antes de llamar a onEliminar
function BotonEliminar({ nombre, onEliminar }) {
  function eliminar() {
    if (window.confirm(`¿Eliminar "${nombre}"?`)) onEliminar()
  }

  return (
    <button type="button" className="btn btn-sm btn-outline-danger" aria-label={`Eliminar ${nombre}`} onClick={eliminar}>
      Eliminar
    </button>
  )
}

export default BotonEliminar
