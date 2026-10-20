import type { Mission } from "../missions/mission";

export type LessonStatus = "done" | "active" | "pending";

export type SidebarLesson = {
  label: string;
  status: LessonStatus;
};

export type SidebarModule = {
  id: string;
  number: number;
  title: string;
  isCurrent: boolean;
  progress: number;
  lessons: SidebarLesson[];
};

type BuildSidebarModulesParams = {
  missions: Mission[];
  completedMissionIds: string[];
  seenLessonIds: string[];
};

export function buildSidebarModules({
  missions,
  completedMissionIds,
  seenLessonIds,
}: BuildSidebarModulesParams): SidebarModule[] {
  const firstPendingIndex = missions.findIndex(
    (mission) => !completedMissionIds.includes(mission.id),
  );

  return missions.map((mission, index) => {
    const isCompleted = completedMissionIds.includes(mission.id);
    const isCurrent = index === firstPendingIndex;
    const lessonSeen = isCompleted || seenLessonIds.includes(mission.id);

    const lessonStatus: LessonStatus = lessonSeen
      ? "done"
      : isCurrent
        ? "active"
        : "pending";
    const challengeStatus: LessonStatus = isCompleted
      ? "done"
      : isCurrent && lessonSeen
        ? "active"
        : "pending";

    const lessons = [
      { label: "Lição do fazendeiro", status: lessonStatus },
      { label: "Desafio", status: challengeStatus },
    ];
    const doneCount = lessons.filter(({ status }) => status === "done").length;

    return {
      id: mission.id,
      number: index + 1,
      title: mission.topic,
      isCurrent,
      progress: doneCount / lessons.length,
      lessons,
    };
  });
}
