import { useState } from "react";
import { GameCanvas } from "./game/game-canvas";
import { MissionOverlay } from "./game/mission-overlay";
import { useMissionProgress } from "./game/use-mission-progress";
import { staleClosureMission } from "./missions/use-effect-stale-closure/mission";

function App() {
  const [missionOpen, setMissionOpen] = useState(false);
  const { completedMissionIds, completeMission } = useMissionProgress();

  return (
    <>
      <GameCanvas
        paused={missionOpen}
        onNpcInteract={() => setMissionOpen(true)}
      />
      {missionOpen && (
        <MissionOverlay
          mission={staleClosureMission}
          alreadyCompleted={completedMissionIds.includes(
            staleClosureMission.id,
          )}
          onCorrect={() => completeMission(staleClosureMission.id)}
          onClose={() => setMissionOpen(false)}
        />
      )}
    </>
  );
}

export default App;
