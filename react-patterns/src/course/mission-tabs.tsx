import { useState } from "react";
import type { Mission } from "../missions/mission";

type Tab = "about" | "code" | "summary";

const TABS: { id: Tab; label: string }[] = [
  { id: "about", label: "Sobre a missão" },
  { id: "code", label: "Código" },
  { id: "summary", label: "Resumo" },
];

type MissionTabsProps = {
  mission: Mission;
  completed: boolean;
};

export function MissionTabs({ mission, completed }: MissionTabsProps) {
  const [selectedTab, setSelectedTab] = useState<Tab>("about");

  return (
    <section className="mission-tabs">
      <div className="mission-tabs-list" role="tablist">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={tab.id === selectedTab}
            className={tab.id === selectedTab ? "selected" : ""}
            onClick={() => setSelectedTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mission-tabs-content" role="tabpanel">
        {selectedTab === "about" && (
          <>
            <h3>{mission.title}</h3>
            <p>{mission.description}</p>
            <ol>
              {mission.lessonLines.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ol>
          </>
        )}
        {selectedTab === "code" && <pre>{mission.code}</pre>}
        {selectedTab === "summary" &&
          (completed ? (
            <p>{mission.explanation}</p>
          ) : (
            <p className="mission-tabs-locked">
              Conclua o desafio para liberar o resumo.
            </p>
          ))}
      </div>
    </section>
  );
}
