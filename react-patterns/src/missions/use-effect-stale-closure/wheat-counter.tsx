import { useEffect, useState } from "react";
import { harvestEvents } from "../../game/harvest-events";
import { WHEAT_GOAL } from "./farmer-dialogues";
import "./wheat-counter.css";

export function WheatCounter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    return harvestEvents.subscribe(() => setCount((current) => current + 1));
  }, []);

  return (
    <div className="wheat-counter">
      🌾 {count} / {WHEAT_GOAL}
    </div>
  );
}
