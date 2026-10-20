const STORAGE_KEY = "completed-missions";

export function loadCompletedMissions(): string[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveCompletedMissions(missionIds: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(missionIds));
  } catch {
    return;
  }
}
