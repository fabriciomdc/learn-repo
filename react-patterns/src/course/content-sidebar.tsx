import type { LessonStatus, SidebarModule } from "./build-sidebar-modules";

const STATUS_ICON: Record<LessonStatus, string> = {
  done: "✓",
  active: "●",
  pending: "○",
};

type ContentSidebarProps = {
  modules: SidebarModule[];
};

export function ContentSidebar({ modules }: ContentSidebarProps) {
  return (
    <aside className="content-sidebar">
      <h2 className="content-sidebar-title">Conteúdo</h2>
      {modules.map((module) => (
        <section
          key={module.id}
          className={
            module.isCurrent ? "content-module current" : "content-module"
          }
        >
          <header className="content-module-header">
            <span
              className="content-module-ring"
              style={{ ["--progress" as string]: module.progress * 100 }}
            >
              {module.number}
            </span>
            <div>
              <strong>{module.title}</strong>
              <span className="content-module-meta">
                {module.lessons.length} etapas
              </span>
            </div>
          </header>
          <ul className="content-lessons">
            {module.lessons.map((lesson) => (
              <li
                key={lesson.label}
                className={`content-lesson ${lesson.status}`}
              >
                <span className="content-lesson-icon">
                  {STATUS_ICON[lesson.status]}
                </span>
                {lesson.label}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </aside>
  );
}
