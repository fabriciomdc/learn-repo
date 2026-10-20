import kaplay from "kaplay";

const PLAYER_SPEED = 200;
const INTERACTION_DISTANCE = 56;
const TILE_SIZE = 16;
const SPRITE_SCALE = 3;
const GAME_WIDTH = 800;
const GAME_HEIGHT = 480;
const PLAIN_GRASS_FRAME = 12;
const DECORATED_GRASS_FRAMES = [55, 56, 57, 66, 67, 68];
const ASSETS_PATH = "/assets/sprout-lands";

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
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    background: [90, 160, 90],
    crisp: true,
    global: false,
  });

  k.loadSprite("grass", `${ASSETS_PATH}/grass.png`, { sliceX: 11, sliceY: 7 });
  k.loadSprite("character", `${ASSETS_PATH}/character.png`, {
    sliceX: 4,
    sliceY: 4,
    anims: {
      "walk-down": { from: 0, to: 3, loop: true, speed: 6 },
      "walk-up": { from: 4, to: 7, loop: true, speed: 6 },
      "walk-left": { from: 8, to: 11, loop: true, speed: 6 },
      "walk-right": { from: 12, to: 15, loop: true, speed: 6 },
    },
  });

  const directions = {
    down: { vector: k.vec2(0, 1), idleFrame: 0 },
    up: { vector: k.vec2(0, -1), idleFrame: 4 },
    left: { vector: k.vec2(-1, 0), idleFrame: 8 },
    right: { vector: k.vec2(1, 0), idleFrame: 12 },
  };
  type Direction = keyof typeof directions;
  const directionKeys = Object.keys(directions) as Direction[];

  k.onLoad(() => {
    const tileDisplaySize = TILE_SIZE * SPRITE_SCALE;
    const columns = Math.ceil(GAME_WIDTH / tileDisplaySize);
    const rows = Math.ceil(GAME_HEIGHT / tileDisplaySize);

    for (let row = 0; row < rows; row++) {
      for (let column = 0; column < columns; column++) {
        const decorationIndex = (column * 3 + row * 5) % 12;
        const frame =
          decorationIndex < DECORATED_GRASS_FRAMES.length
            ? DECORATED_GRASS_FRAMES[decorationIndex]
            : PLAIN_GRASS_FRAME;

        k.add([
          k.sprite("grass", { frame }),
          k.pos(column * tileDisplaySize, row * tileDisplaySize),
          k.scale(SPRITE_SCALE),
          k.z(-1),
        ]);
      }
    }

    const player = k.add([
      k.sprite("character"),
      k.pos(120, 360),
      k.scale(SPRITE_SCALE),
      k.area({ shape: new k.Rect(k.vec2(-6, -4), 12, 14) }),
      k.anchor("center"),
    ]);

    const npc = k.add([
      k.sprite("character", { frame: directions.down.idleFrame }),
      k.color(255, 190, 130),
      k.pos(600, 200),
      k.scale(SPRITE_SCALE),
      k.area({ shape: new k.Rect(k.vec2(-6, -4), 12, 14) }),
      k.anchor("center"),
    ]);

    let facing: Direction = "down";

    for (const key of directionKeys) {
      k.onKeyDown(key, () => {
        if (isPaused()) return;
        facing = key;
        player.move(directions[key].vector.scale(PLAYER_SPEED));
        if (player.curAnim() !== `walk-${key}`) player.play(`walk-${key}`);
      });
    }

    k.onUpdate(() => {
      const isWalking = directionKeys.some((key) => k.isKeyDown(key));
      if (isWalking && !isPaused()) return;
      if (!player.curAnim()) return;
      player.stop();
      player.frame = directions[facing].idleFrame;
    });

    k.onKeyPress("e", () => {
      if (isPaused()) return;
      if (player.pos.dist(npc.pos) <= INTERACTION_DISTANCE) onNpcInteract();
    });
  });

  return () => k.quit();
}
