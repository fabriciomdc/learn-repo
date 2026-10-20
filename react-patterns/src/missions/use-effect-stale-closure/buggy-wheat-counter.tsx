import { useEffect, useState } from "react";
import { harvestEvents } from "../../game/harvest-events";
import { WHEAT_GOAL } from "./farmer-dialogues";
import "../../game/wheat-counter.css";

export function BuggyWheatCounter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    return harvestEvents.subscribe(() => setCount(count + 1));
  }, []);

  return (
    <div className="wheat-counter">
      🌾 {count} / {WHEAT_GOAL}
    </div>
  );
}
