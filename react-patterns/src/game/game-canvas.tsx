import { useEffect, useRef } from 'react'
import { createGame } from './create-game'

type GameCanvasProps = {
  onNpcInteract: () => void
}

export function GameCanvas({ onNpcInteract }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return
    return createGame({ canvas: canvasRef.current, onNpcInteract })
  }, [onNpcInteract])

  return <canvas ref={canvasRef} />
}
