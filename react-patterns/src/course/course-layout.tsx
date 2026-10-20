import type { ReactNode } from "react";
import "./course.css";

type CourseLayoutProps = {
  trail: string;
  missionTitle: string;
  completedCount: number;
  totalCount: number;
  sidebar: ReactNode;
  tabs: ReactNode;
  children: ReactNode;
};

export function CourseLayout({
  trail,
  missionTitle,
  completedCount,
  totalCount,
  sidebar,
  tabs,
  children,
}: CourseLayoutProps) {
  return (
    <div className="course-layout">
      <header className="course-header">
        <span className="course-trail">{trail}</span>
        <span className="course-separator">/</span>
        <span className="course-mission-title">{missionTitle}</span>
        <span className="course-progress">
          {completedCount} de {totalCount} concluídas
        </span>
      </header>
      <main className="course-main">
        <div className="course-game-frame">{children}</div>
        {tabs}
      </main>
      {sidebar}
    </div>
  );
}
