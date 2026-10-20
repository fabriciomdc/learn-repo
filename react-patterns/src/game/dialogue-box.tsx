import { useEffect, useState } from "react";
import "./dialogue-box.css";

const ADVANCE_KEYS = ["e", "E", "Enter", " "];

type DialogueBoxProps = {
  speaker: string;
  lines: string[];
  onFinish: () => void;
};

export function DialogueBox({ speaker, lines, onFinish }: DialogueBoxProps) {
  const [lineIndex, setLineIndex] = useState(0);
  const isLastLine = lineIndex === lines.length - 1;

  function advance() {
    if (isLastLine) {
      onFinish();
      return;
    }
    setLineIndex(lineIndex + 1);
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.repeat || !ADVANCE_KEYS.includes(event.key)) return;
      advance();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  return (
    <div className="dialogue-box" onClick={advance}>
      <strong className="dialogue-speaker">{speaker}</strong>
      <p className="dialogue-line">{lines[lineIndex]}</p>
      <span className="dialogue-hint">
        [E] {isLastLine ? "fechar" : "continuar"}
      </span>
    </div>
  );
}
