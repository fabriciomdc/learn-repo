import { useEffect, useRef } from "react";
import { createGame } from "./create-game";

type GameCanvasProps = {
  paused: boolean;
  onNpcInteract: () => void;
};

export function GameCanvas({ paused, onNpcInteract }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pausedRef = useRef(paused);
  const onNpcInteractRef = useRef(onNpcInteract);

  useEffect(() => {
    pausedRef.current = paused;
    onNpcInteractRef.current = onNpcInteract;
  });

  useEffect(() => {
    if (!canvasRef.current) return;
    return createGame({
      canvas: canvasRef.current,
      isPaused: () => pausedRef.current,
      onNpcInteract: () => onNpcInteractRef.current(),
    });
  }, []);

  return <canvas ref={canvasRef} />;
}
