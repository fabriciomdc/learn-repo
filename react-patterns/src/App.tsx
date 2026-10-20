import { useState } from "react";
import { buildSidebarModules } from "./course/build-sidebar-modules";
import { ContentSidebar } from "./course/content-sidebar";
import { CourseLayout } from "./course/course-layout";
import { MissionTabs } from "./course/mission-tabs";
import type { NpcInteraction } from "./game/create-game";
import { DialogueBox } from "./game/dialogue-box";
import { GameCanvas } from "./game/game-canvas";
import { harvestEvents } from "./game/harvest-events";
import { MissionOverlay } from "./game/mission-overlay";
import { useMissionProgress } from "./game/use-mission-progress";
import { BuggyWheatCounter } from "./missions/use-effect-stale-closure/buggy-wheat-counter";
import {
  farmerDelivery,
  farmerIntro,
  WHEAT_GOAL,
} from "./missions/use-effect-stale-closure/farmer-dialogues";
import { WheatCounter } from "./missions/use-effect-stale-closure/wheat-counter";
import { missions } from "./missions/missions";
import { PlainVariableWheatCounter } from "./missions/use-state-scoreboard/plain-variable-wheat-counter";

const FARMER_NAME = "Fazendeiro";
const TRAIL_NAME = "Trilha React";

function App() {
  const [lessonOpen, setLessonOpen] = useState(false);
  const [missionOpen, setMissionOpen] = useState(false);
  const [introOpen, setIntroOpen] = useState(true);
  const [deliveryOpen, setDeliveryOpen] = useState(false);
  const [delivered, setDelivered] = useState(false);
  const [seenLessonIds, setSeenLessonIds] = useState<string[]>([]);
  const { completedMissionIds, completeMission } = useMissionProgress();

  const firstPendingIndex = missions.findIndex(
    (mission) => !completedMissionIds.includes(mission.id),
  );
  const missionStage =
    firstPendingIndex === -1 ? missions.length : firstPendingIndex;
  const activeMission = missions[Math.min(missionStage, missions.length - 1)];
  const hasPendingMission = missionStage < missions.length;

  function handleNpcInteract(interaction: NpcInteraction) {
    if (interaction === "delivery") setDeliveryOpen(true);
    else if (hasPendingMission) setLessonOpen(true);
    else setMissionOpen(true);
  }

  function handleLessonFinish() {
    setSeenLessonIds([...seenLessonIds, activeMission.id]);
    setLessonOpen(false);
    setMissionOpen(true);
  }

  function handleDeliveryFinish() {
    setDeliveryOpen(false);
    setDelivered(true);
  }

  const sidebarModules = buildSidebarModules({
    missions,
    completedMissionIds,
    seenLessonIds,
  });

  return (
    <>
      <CourseLayout
        trail={TRAIL_NAME}
        missionTitle={activeMission.title}
        completedCount={Math.min(missionStage, missions.length)}
        totalCount={missions.length}
        sidebar={<ContentSidebar modules={sidebarModules} />}
        tabs={
          <MissionTabs
            key={activeMission.id}
            mission={activeMission}
            completed={completedMissionIds.includes(activeMission.id)}
          />
        }
      >
        <GameCanvas
          paused={missionOpen || introOpen || lessonOpen || deliveryOpen}
          hasHoe={!introOpen}
          missionStage={missionStage}
          missionCount={missions.length}
          delivered={delivered}
          wheatGoal={WHEAT_GOAL}
          onNpcInteract={handleNpcInteract}
          onHarvest={harvestEvents.emit}
        />
        {!delivered && missionStage === 0 && <PlainVariableWheatCounter />}
        {!delivered && missionStage === 1 && <BuggyWheatCounter />}
        {!delivered && missionStage >= 2 && <WheatCounter />}
        {introOpen && (
          <DialogueBox
            speaker={farmerIntro.speaker}
            lines={farmerIntro.lines}
            onFinish={() => setIntroOpen(false)}
          />
        )}
        {lessonOpen && (
          <DialogueBox
            key={activeMission.id}
            speaker={FARMER_NAME}
            lines={activeMission.lessonLines}
            onFinish={handleLessonFinish}
          />
        )}
        {deliveryOpen && (
          <DialogueBox
            speaker={farmerDelivery.speaker}
            lines={farmerDelivery.lines}
            onFinish={handleDeliveryFinish}
          />
        )}
      </CourseLayout>
      {missionOpen && (
        <MissionOverlay
          key={activeMission.id}
          mission={activeMission}
          alreadyCompleted={completedMissionIds.includes(activeMission.id)}
          onCorrect={() => completeMission(activeMission.id)}
          onClose={() => setMissionOpen(false)}
        />
      )}
    </>
  );
}

export default App;
