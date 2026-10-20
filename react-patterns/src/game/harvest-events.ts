type HarvestListener = () => void;

const listeners = new Set<HarvestListener>();

export const harvestEvents = {
  subscribe(listener: HarvestListener) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  emit() {
    listeners.forEach((listener) => listener());
  },
};
