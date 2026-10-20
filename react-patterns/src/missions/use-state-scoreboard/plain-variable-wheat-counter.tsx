import { useEffect } from "react";
import { harvestEvents } from "../../game/harvest-events";
import { WHEAT_GOAL } from "../use-effect-stale-closure/farmer-dialogues";
import "../../game/wheat-counter.css";

export function PlainVariableWheatCounter() {
  let count = 0;

  useEffect(() => {
    return harvestEvents.subscribe(() => {
      count = count + 1;
    });
  }, []);

  return (
    <div className="wheat-counter">
      🌾 {count} / {WHEAT_GOAL}
    </div>
  );
}
