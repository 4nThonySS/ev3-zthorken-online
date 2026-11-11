import { render, screen, fireEvent } from '@testing-library/react'
import BotonEliminar from './BotonEliminar.jsx'

describe('BotonEliminar', () => {
  it('llama a onEliminar al confirmar', () => {
    spyOn(window, 'confirm').and.returnValue(true)
    const onEliminar = jasmine.createSpy('onEliminar')
    render(<BotonEliminar nombre="Audio" onEliminar={onEliminar} />)

    fireEvent.click(screen.getByRole('button', { name: 'Eliminar Audio' }))
    expect(window.confirm).toHaveBeenCalledWith('¿Eliminar "Audio"?')
    expect(onEliminar).toHaveBeenCalledTimes(1)
  })

  it('no llama a onEliminar si se cancela', () => {
    spyOn(window, 'confirm').and.returnValue(false)
    const onEliminar = jasmine.createSpy('onEliminar')
    render(<BotonEliminar nombre="Audio" onEliminar={onEliminar} />)

    fireEvent.click(screen.getByRole('button', { name: 'Eliminar Audio' }))
    expect(onEliminar).not.toHaveBeenCalled()
  })
})
