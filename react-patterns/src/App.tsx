import { useState } from "react";
import { DialogueBox } from "./game/dialogue-box";
import { GameCanvas } from "./game/game-canvas";
import type { NpcInteraction } from "./game/create-game";
import { harvestEvents } from "./game/harvest-events";
import { MissionOverlay } from "./game/mission-overlay";
import { useMissionProgress } from "./game/use-mission-progress";
import { WheatCounter } from "./missions/use-effect-stale-closure/wheat-counter";
import { BuggyWheatCounter } from "./missions/use-effect-stale-closure/buggy-wheat-counter";
import {
  farmerDelivery,
  farmerIntro,
  WHEAT_GOAL,
} from "./missions/use-effect-stale-closure/farmer-dialogues";
import { staleClosureMission } from "./missions/use-effect-stale-closure/mission";

function App() {
  const [missionOpen, setMissionOpen] = useState(false);
  const [introOpen, setIntroOpen] = useState(true);
  const [deliveryOpen, setDeliveryOpen] = useState(false);
  const [delivered, setDelivered] = useState(false);
  const { completedMissionIds, completeMission } = useMissionProgress();
  const problemSolved = completedMissionIds.includes(staleClosureMission.id);

  function handleNpcInteract(interaction: NpcInteraction) {
    if (interaction === "delivery") setDeliveryOpen(true);
    else setMissionOpen(true);
  }

  function handleDeliveryFinish() {
    setDeliveryOpen(false);
    setDelivered(true);
  }

  return (
    <>
      <GameCanvas
        paused={missionOpen || introOpen || deliveryOpen}
        hasHoe={!introOpen}
        problemSolved={problemSolved}
        delivered={delivered}
        wheatGoal={WHEAT_GOAL}
        onNpcInteract={handleNpcInteract}
        onHarvest={harvestEvents.emit}
      />
      {!delivered && (problemSolved ? <WheatCounter /> : <BuggyWheatCounter />)}
      {introOpen && (
        <DialogueBox
          speaker={farmerIntro.speaker}
          lines={farmerIntro.lines}
          onFinish={() => setIntroOpen(false)}
        />
      )}
      {deliveryOpen && (
        <DialogueBox
          speaker={farmerDelivery.speaker}
          lines={farmerDelivery.lines}
          onFinish={handleDeliveryFinish}
        />
      )}
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
