import { useEffect, useRef } from "react";
import { createGame, type NpcInteraction } from "./create-game";

type GameCanvasProps = {
  paused: boolean;
  hasHoe: boolean;
  missionStage: number;
  missionCount: number;
  delivered: boolean;
  wheatGoal: number;
  onNpcInteract: (interaction: NpcInteraction) => void;
  onHarvest: () => void;
};

export function GameCanvas({
  paused,
  hasHoe,
  missionStage,
  missionCount,
  delivered,
  wheatGoal,
  onNpcInteract,
  onHarvest,
}: GameCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(paused);
  const hasHoeRef = useRef(hasHoe);
  const missionStageRef = useRef(missionStage);
  const deliveredRef = useRef(delivered);
  const onNpcInteractRef = useRef(onNpcInteract);
  const onHarvestRef = useRef(onHarvest);

  useEffect(() => {
    pausedRef.current = paused;
    hasHoeRef.current = hasHoe;
    missionStageRef.current = missionStage;
    deliveredRef.current = delivered;
    onNpcInteractRef.current = onNpcInteract;
    onHarvestRef.current = onHarvest;
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const canvas = document.createElement("canvas");
    container.appendChild(canvas);
    const destroyGame = createGame({
      canvas,
      isPaused: () => pausedRef.current,
      hasHoe: () => hasHoeRef.current,
      getMissionStage: () => missionStageRef.current,
      missionCount,
      hasDelivered: () => deliveredRef.current,
      wheatGoal,
      onNpcInteract: (interaction) => onNpcInteractRef.current(interaction),
      onHarvest: () => onHarvestRef.current(),
    });
    return () => {
      destroyGame();
      canvas.remove();
    };
  }, [wheatGoal, missionCount]);

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
}
