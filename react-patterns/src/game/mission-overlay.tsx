import { useState } from "react";
import type { Mission } from "../missions/mission";
import "./mission-overlay.css";

type MissionOverlayProps = {
  mission: Mission;
  alreadyCompleted: boolean;
  onCorrect: () => void;
  onClose: () => void;
};

export function MissionOverlay({
  mission,
  alreadyCompleted,
  onCorrect,
  onClose,
}: MissionOverlayProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);

  const isCorrect = selectedId === mission.correctOptionId;

  function handleConfirm() {
    setAnswered(true);
    if (isCorrect) onCorrect();
  }

  function handleRetry() {
    setSelectedId(null);
    setAnswered(false);
  }

  return (
    <div className="mission-overlay">
      <div className="mission-panel">
        <h1>Missão: {mission.title}</h1>
        <p className="mission-description">{mission.description}</p>
        {alreadyCompleted && <p className="mission-badge">Missão concluída</p>}
        <pre>{mission.code}</pre>
        <p>{mission.question}</p>
        <ul>
          {mission.options.map((option) => (
            <li key={option.id}>
              <button
                type="button"
                className={option.id === selectedId ? "selected" : ""}
                disabled={answered}
                onClick={() => setSelectedId(option.id)}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
        {answered && (
          <p className={isCorrect ? "feedback correct" : "feedback wrong"}>
            {isCorrect ? "Correto! " : "Quase. "}
            {mission.explanation}
          </p>
        )}
        <div className="mission-actions">
          {!answered && (
            <button
              type="button"
              disabled={!selectedId}
              onClick={handleConfirm}
            >
              Confirmar
            </button>
          )}
          {answered && !isCorrect && (
            <button type="button" onClick={handleRetry}>
              Tentar de novo
            </button>
          )}
          <button type="button" onClick={onClose}>
            Sair
          </button>
        </div>
      </div>
    </div>
  );
}
