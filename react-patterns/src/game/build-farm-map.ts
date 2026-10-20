import type { KAPLAYCtx } from "kaplay";
import {
  ASSETS_PATH,
  GAME_HEIGHT,
  GAME_WIDTH,
  SPRITE_SCALE,
  TILE_SIZE,
} from "./world-constants";

const PLAIN_GRASS_FRAME = 12;
const DECORATED_GRASS_FRAMES = [55, 56, 57, 66, 67, 68];
const PATH_FRAMES = {
  verticalMiddle: 14,
  horizontalMiddle: 34,
  horizontalEnd: 35,
};
const PATH_SPOTS = [
  { frame: 44, column: 2, row: 5 },
  { frame: 45, column: 3, row: 8 },
  { frame: 46, column: 0, row: 6 },
  { frame: 45, column: 4, row: 4 },
];
const FIELD_COLUMNS = { first: 5, last: 11 };
const FIELD_ROWS = { first: 6, last: 8 };
const FENCE_ROW = 5;
const PATH_COLUMN = 1;
const PATH_FIRST_ROW = 4;
const PATH_LAST_ROW = 7;
const WHEAT_ROW = 7;
const WHEAT_COLUMNS = [6, 7, 8, 9, 10];
const WALL_THICKNESS = 40;
const FENCE_FRAMES = { left: 9, middle: 10, right: 11 };

export const WHEAT_POSITIONS = WHEAT_COLUMNS.map((column) => [
  column * TILE_SIZE + TILE_SIZE / 2,
  WHEAT_ROW * TILE_SIZE + TILE_SIZE / 2,
]);

type Hitbox = [x: number, y: number, width: number, height: number];

type Prop = {
  sprite: string;
  x: number;
  y: number;
  hitbox?: Hitbox;
};

const HOUSE_SIZE = { width: 36, height: 57 };
const FARMER_FEET_OFFSET = 28;

const HOUSE: Prop = {
  sprite: "house",
  x: 17,
  y: 20,
  hitbox: [0, 10, HOUSE_SIZE.width, HOUSE_SIZE.height - 10],
};

export const HOUSE_DOOR_STOP = [
  HOUSE.x + (HOUSE_SIZE.width * SPRITE_SCALE) / 2,
  HOUSE.y + HOUSE_SIZE.height * SPRITE_SCALE - FARMER_FEET_OFFSET,
];

const PROPS: Prop[] = [
  { sprite: "tree", x: 700, y: 24, hitbox: [9, 22, 6, 9] },
  { sprite: "apple-tree", x: 612, y: 8, hitbox: [9, 22, 6, 9] },
  { sprite: "apple-tree", x: 690, y: 190, hitbox: [9, 22, 6, 9] },
  { sprite: "tree", x: 712, y: 340, hitbox: [9, 22, 6, 9] },
  { sprite: "bush", x: 144, y: 168, hitbox: [1, 6, 14, 9] },
  { sprite: "bush", x: 24, y: 410, hitbox: [1, 6, 14, 9] },
  { sprite: "bush", x: 300, y: 40, hitbox: [1, 6, 14, 9] },
  { sprite: "rock", x: 610, y: 410, hitbox: [0, 2, 16, 10] },
  { sprite: "log", x: 430, y: 110, hitbox: [0, 0, 16, 10] },
  { sprite: "sunflower", x: 330, y: 110 },
  { sprite: "mushroom", x: 668, y: 292 },
  { sprite: "flower", x: 300, y: 190 },
  { sprite: "flower", x: 390, y: 160 },
  { sprite: "flower", x: 480, y: 220 },
  { sprite: "flower", x: 250, y: 440 },
  { sprite: "flower", x: 500, y: 430 },
];

export function loadFarmMapSprites(k: KAPLAYCtx) {
  k.loadSprite("grass", `${ASSETS_PATH}/grass.png`, { sliceX: 11, sliceY: 7 });
  k.loadSprite("dirt", `${ASSETS_PATH}/dirt.png`, { sliceX: 11, sliceY: 7 });
  k.loadSprite("path-corner", `${ASSETS_PATH}/path-corner.png`);
  k.loadSprite("fences", `${ASSETS_PATH}/fences.png`, {
    sliceX: 4,
    sliceY: 4,
  });
  for (const name of [
    "house",
    "tree",
    "apple-tree",
    "bush",
    "rock",
    "log",
    "sunflower",
    "mushroom",
    "flower",
  ]) {
    k.loadSprite(name, `${ASSETS_PATH}/${name}.png`);
  }
}

export function buildFarmMap(k: KAPLAYCtx) {
  addGround(k);
  addField(k);
  addPath(k);
  addFence(k);
  PROPS.forEach((prop) => addProp(k, prop));
  addProp(k, HOUSE);
  addBoundaryWalls(k);
}

function addGround(k: KAPLAYCtx) {
  const columns = Math.ceil(GAME_WIDTH / TILE_SIZE);
  const rows = Math.ceil(GAME_HEIGHT / TILE_SIZE);

  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      const decorationIndex = (column * 3 + row * 5) % 12;
      const frame =
        decorationIndex < DECORATED_GRASS_FRAMES.length
          ? DECORATED_GRASS_FRAMES[decorationIndex]
          : PLAIN_GRASS_FRAME;
      addTile(k, "grass", frame, column, row, -2);
    }
  }
}

function addField(k: KAPLAYCtx) {
  const { first: firstColumn, last: lastColumn } = FIELD_COLUMNS;
  const { first: firstRow, last: lastRow } = FIELD_ROWS;

  for (let row = firstRow; row <= lastRow; row++) {
    for (let column = firstColumn; column <= lastColumn; column++) {
      const frameRow = row === firstRow ? 0 : row === lastRow ? 2 : 1;
      const frameColumn =
        column === firstColumn ? 0 : column === lastColumn ? 2 : 1;
      addTile(k, "dirt", frameRow * 11 + frameColumn, column, row, -1);
    }
  }
}

function addPath(k: KAPLAYCtx) {
  for (let row = PATH_FIRST_ROW; row < PATH_LAST_ROW; row++) {
    addTile(k, "dirt", PATH_FRAMES.verticalMiddle, PATH_COLUMN, row, -1);
  }
  addTile(k, "path-corner", 0, PATH_COLUMN, PATH_LAST_ROW, -1);
  const lastPathColumn = FIELD_COLUMNS.first - 1;
  for (let column = PATH_COLUMN + 1; column <= lastPathColumn; column++) {
    const frame =
      column === lastPathColumn
        ? PATH_FRAMES.horizontalEnd
        : PATH_FRAMES.horizontalMiddle;
    addTile(k, "dirt", frame, column, PATH_LAST_ROW, -1);
  }
  PATH_SPOTS.forEach(({ frame, column, row }) =>
    addTile(k, "dirt", frame, column, row, -1),
  );
}

function addFence(k: KAPLAYCtx) {
  for (
    let column = FIELD_COLUMNS.first;
    column <= FIELD_COLUMNS.last;
    column++
  ) {
    const frame =
      column === FIELD_COLUMNS.first
        ? FENCE_FRAMES.left
        : column === FIELD_COLUMNS.last
          ? FENCE_FRAMES.right
          : FENCE_FRAMES.middle;
    addTile(k, "fences", frame, column, FENCE_ROW, 0);
  }
}

function addTile(
  k: KAPLAYCtx,
  sprite: string,
  frame: number,
  column: number,
  row: number,
  z: number,
) {
  k.add([
    k.sprite(sprite, { frame }),
    k.pos(column * TILE_SIZE, row * TILE_SIZE),
    k.scale(SPRITE_SCALE),
    k.z(z),
  ]);
}

function addProp(k: KAPLAYCtx, { sprite, x, y, hitbox }: Prop) {
  const components = [k.sprite(sprite), k.pos(x, y), k.scale(SPRITE_SCALE)];
  if (!hitbox) {
    k.add(components);
    return;
  }
  const [hitboxX, hitboxY, width, height] = hitbox;
  k.add([
    ...components,
    k.area({ shape: new k.Rect(k.vec2(hitboxX, hitboxY), width, height) }),
    k.body({ isStatic: true }),
  ]);
}

function addBoundaryWalls(k: KAPLAYCtx) {
  const walls = [
    [-WALL_THICKNESS, 0, WALL_THICKNESS, GAME_HEIGHT],
    [GAME_WIDTH, 0, WALL_THICKNESS, GAME_HEIGHT],
    [0, -WALL_THICKNESS, GAME_WIDTH, WALL_THICKNESS],
    [0, GAME_HEIGHT, GAME_WIDTH, WALL_THICKNESS],
  ];
  for (const [x, y, width, height] of walls) {
    k.add([
      k.pos(x, y),
      k.area({ shape: new k.Rect(k.vec2(0, 0), width, height) }),
      k.body({ isStatic: true }),
    ]);
  }
}
