import { useState } from "react";
import {
  loadCompletedMissions,
  saveCompletedMissions,
} from "./mission-progress-storage";

export function useMissionProgress() {
  const [completedMissionIds, setCompletedMissionIds] = useState(
    loadCompletedMissions,
  );

  function completeMission(missionId: string) {
    if (completedMissionIds.includes(missionId)) return;
    const next = [...completedMissionIds, missionId];
    setCompletedMissionIds(next);
    saveCompletedMissions(next);
  }

  return { completedMissionIds, completeMission };
}
