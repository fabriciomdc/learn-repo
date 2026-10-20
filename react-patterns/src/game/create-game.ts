import kaplay from "kaplay";

const PLAYER_SPEED = 200;
const INTERACTION_DISTANCE = 56;

type CreateGameParams = {
  canvas: HTMLCanvasElement;
  isPaused: () => boolean;
  onNpcInteract: () => void;
};

export function createGame({
  canvas,
  isPaused,
  onNpcInteract,
}: CreateGameParams) {
  const k = kaplay({
    canvas,
    width: 800,
    height: 480,
    background: [90, 160, 90],
    global: false,
  });

  const player = k.add([
    k.rect(32, 32),
    k.color(59, 111, 214),
    k.pos(120, 360),
    k.area(),
    k.anchor("center"),
  ]);

  const npc = k.add([
    k.rect(32, 32),
    k.color(224, 160, 48),
    k.pos(600, 200),
    k.area(),
    k.anchor("center"),
  ]);

  const directions = {
    left: k.vec2(-1, 0),
    right: k.vec2(1, 0),
    up: k.vec2(0, -1),
    down: k.vec2(0, 1),
  };

  for (const [key, direction] of Object.entries(directions)) {
    k.onKeyDown(key as keyof typeof directions, () => {
      if (isPaused()) return;
      player.move(direction.scale(PLAYER_SPEED));
    });
  }

  k.onKeyPress("e", () => {
    if (isPaused()) return;
    if (player.pos.dist(npc.pos) <= INTERACTION_DISTANCE) onNpcInteract();
  });

  return () => k.quit();
}
