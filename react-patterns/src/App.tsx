import { useCallback } from 'react'
import { GameCanvas } from './game/game-canvas'

function App() {
  const handleNpcInteract = useCallback(() => {
    console.log('npc interact')
  }, [])

  return <GameCanvas onNpcInteract={handleNpcInteract} />
}

export default App
