import { useEffect, useRef } from "react";
import { createGame } from "./create-game";

type GameCanvasProps = {
  paused: boolean;
  onNpcInteract: () => void;
};

export function GameCanvas({ paused, onNpcInteract }: GameCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(paused);
  const onNpcInteractRef = useRef(onNpcInteract);

  useEffect(() => {
    pausedRef.current = paused;
    onNpcInteractRef.current = onNpcInteract;
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const canvas = document.createElement("canvas");
    container.appendChild(canvas);
    const destroyGame = createGame({
      canvas,
      isPaused: () => pausedRef.current,
      onNpcInteract: () => onNpcInteractRef.current(),
    });
    return () => {
      destroyGame();
      canvas.remove();
    };
  }, []);

  return <div ref={containerRef} />;
}
