import kaplay from "kaplay";
import {
  buildFarmMap,
  HOUSE_DOOR_STOP,
  loadFarmMapSprites,
  WHEAT_POSITIONS,
} from "./build-farm-map";
import {
  ASSETS_PATH,
  GAME_HEIGHT,
  GAME_WIDTH,
  SPRITE_SCALE,
} from "./world-constants";

const PLAYER_SPEED = 200;
const INTERACTION_DISTANCE = 56;
const CHARACTER_SCALE = 2;
const HARVEST_DISTANCE = 60;
const RIPE_WHEAT_FRAME = 4;
const HARVESTED_WHEAT_FRAME = 1;
const CHARACTERS_PATH = "/assets/tiny-questers";
const HARVESTS_TO_NOTICE_PROBLEM_BY_STAGE = [1, 2];
const INTERACTION_COOLDOWN_SECONDS = 0.25;
const GROWTH_FRAMES = [1, 2, 3, 4];
const GROWTH_STEP_SECONDS = 0.7;
const GROWTH_STAGGER_SECONDS = 0.3;
const FARMER_SPEED = 90;
const BUBBLE_OFFSET_Y = -58;
const BUBBLE_BOB_HEIGHT = 3;
const BUBBLE_BOB_SPEED = 4;

export type NpcInteraction = "mission" | "delivery";

type CreateGameParams = {
  canvas: HTMLCanvasElement;
  isPaused: () => boolean;
  hasHoe: () => boolean;
  getMissionStage: () => number;
  missionCount: number;
  hasDelivered: () => boolean;
  wheatGoal: number;
  onNpcInteract: (interaction: NpcInteraction) => void;
  onHarvest: () => void;
};

export function createGame({
  canvas,
  isPaused,
  hasHoe,
  getMissionStage,
  missionCount,
  hasDelivered,
  wheatGoal,
  onNpcInteract,
  onHarvest,
}: CreateGameParams) {
  const k = kaplay({
    canvas,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    background: [90, 160, 90],
    crisp: true,
    stretch: true,
    letterbox: true,
    global: false,
  });

  loadFarmMapSprites(k);
  k.loadSprite("plants", `${ASSETS_PATH}/plants.png`, { sliceX: 6, sliceY: 2 });
  k.loadSprite("farmer", `${CHARACTERS_PATH}/farmer.png`);
  const warriorSprite = {
    sliceX: 4,
    sliceY: 4,
    anims: {
      "walk-down": { from: 0, to: 3, loop: true, speed: 6 },
      "walk-up": { from: 4, to: 7, loop: true, speed: 6 },
      "walk-left": { from: 8, to: 11, loop: true, speed: 6 },
      "walk-right": { from: 12, to: 15, loop: true, speed: 6 },
    },
  };
  k.loadSprite("warrior", `${CHARACTERS_PATH}/warrior.png`, warriorSprite);
  k.loadSprite(
    "warrior-farmer",
    `${CHARACTERS_PATH}/warrior-farmer.png`,
    warriorSprite,
  );

  const directions = {
    down: { vector: k.vec2(0, 1), idleFrame: 0 },
    up: { vector: k.vec2(0, -1), idleFrame: 4 },
    left: { vector: k.vec2(-1, 0), idleFrame: 8 },
    right: { vector: k.vec2(1, 0), idleFrame: 12 },
  };
  type Direction = keyof typeof directions;
  const directionKeys = Object.keys(directions) as Direction[];

  k.onLoad(() => {
    buildFarmMap(k);

    const wheatPatches = WHEAT_POSITIONS.map(([x, y]) => ({
      sprite: k.add([
        k.sprite("plants", { frame: RIPE_WHEAT_FRAME }),
        k.pos(x, y),
        k.scale(SPRITE_SCALE),
        k.anchor("center"),
      ]),
      ripe: true,
    }));

    const player = k.add([
      k.sprite("warrior"),
      k.pos(120, 420),
      k.scale(CHARACTER_SCALE),
      k.area({ shape: new k.Rect(k.vec2(-6, 2), 12, 12) }),
      k.body(),
      k.anchor("center"),
    ]);

    const npc = k.add([
      k.sprite("farmer"),
      k.pos(205, 300),
      k.scale(CHARACTER_SCALE),
      k.area({ shape: new k.Rect(k.vec2(-6, 2), 12, 12) }),
      k.body({ isStatic: true }),
      k.anchor("center"),
    ]);

    const alertBubble = k.add([
      k.rect(28, 24, { radius: 6 }),
      k.color(255, 255, 255),
      k.outline(3, k.rgb(30, 30, 46)),
      k.pos(npc.pos.x, npc.pos.y + BUBBLE_OFFSET_Y),
      k.anchor("center"),
      k.z(10),
    ]);
    alertBubble.add([
      k.text("!", { size: 20 }),
      k.color(200, 40, 40),
      k.anchor("center"),
    ]);
    alertBubble.hidden = true;
    let harvestedInStage = 0;
    let lastPausedTime = -Infinity;
    let farmerLeaving = false;
    let deliveryStarted = false;
    let farmerGone = false;
    const farmerWaypoints = [[HOUSE_DOOR_STOP[0], npc.pos.y], HOUSE_DOOR_STOP];

    let facing: Direction = "down";
    let hoeEquipped = false;
    let previousStage = getMissionStage();

    function regrowWheat() {
      wheatPatches.forEach((patch, patchIndex) => {
        patch.ripe = false;
        GROWTH_FRAMES.forEach((frame, step) => {
          const delay =
            patchIndex * GROWTH_STAGGER_SECONDS + step * GROWTH_STEP_SECONDS;
          k.wait(delay, () => {
            patch.sprite.frame = frame;
            if (step === GROWTH_FRAMES.length - 1) patch.ripe = true;
          });
        });
      });
    }

    function updateFarmer(stage: number) {
      if (farmerGone) return;
      if (hasDelivered()) farmerLeaving = true;
      const allMissionsSolved = stage >= missionCount;
      const noticedProblem =
        !allMissionsSolved &&
        harvestedInStage >= HARVESTS_TO_NOTICE_PROBLEM_BY_STAGE[stage];
      const readyToDeliver =
        allMissionsSolved && harvestedInStage >= wheatGoal && !farmerLeaving;
      alertBubble.hidden = farmerLeaving || !(noticedProblem || readyToDeliver);
      alertBubble.pos.y =
        npc.pos.y +
        BUBBLE_OFFSET_Y +
        Math.sin(k.time() * BUBBLE_BOB_SPEED) * BUBBLE_BOB_HEIGHT;
      if (!farmerLeaving) return;
      const [targetX, targetY] = farmerWaypoints[0] ?? [];
      if (targetX === undefined) {
        npc.destroy();
        alertBubble.destroy();
        farmerGone = true;
        return;
      }
      const target = k.vec2(targetX, targetY);
      if (npc.pos.dist(target) < 2) farmerWaypoints.shift();
      else npc.moveTo(target, FARMER_SPEED);
    }

    for (const key of directionKeys) {
      k.onKeyDown(key, () => {
        if (isPaused()) return;
        facing = key;
        player.move(directions[key].vector.scale(PLAYER_SPEED));
        if (player.curAnim() !== `walk-${key}`) player.play(`walk-${key}`);
      });
    }

    k.onUpdate(() => {
      if (isPaused()) lastPausedTime = k.time();
      const stage = getMissionStage();
      if (stage > previousStage) {
        harvestedInStage = 0;
        regrowWheat();
      }
      previousStage = stage;
      updateFarmer(stage);
      if (hasHoe() && !hoeEquipped) {
        hoeEquipped = true;
        player.use(k.sprite("warrior-farmer"));
        player.frame = directions[facing].idleFrame;
      }
      const isWalking = directionKeys.some((key) => k.isKeyDown(key));
      if (isWalking && !isPaused()) return;
      if (!player.curAnim()) return;
      player.stop();
      player.frame = directions[facing].idleFrame;
    });

    k.onKeyPress("e", () => {
      if (isPaused()) return;
      if (k.time() - lastPausedTime < INTERACTION_COOLDOWN_SECONDS) return;
      const canTalkToFarmer = !farmerGone && !farmerLeaving && !deliveryStarted;
      if (canTalkToFarmer && player.pos.dist(npc.pos) <= INTERACTION_DISTANCE) {
        const readyToDeliver =
          getMissionStage() >= missionCount && harvestedInStage >= wheatGoal;
        deliveryStarted = readyToDeliver;
        onNpcInteract(readyToDeliver ? "delivery" : "mission");
        return;
      }
      const patch = wheatPatches.find(
        ({ sprite, ripe }) =>
          ripe && player.pos.dist(sprite.pos) <= HARVEST_DISTANCE,
      );
      if (!patch) return;
      patch.ripe = false;
      patch.sprite.frame = HARVESTED_WHEAT_FRAME;
      harvestedInStage += 1;
      onHarvest();
    });
  });

  return () => k.quit();
}
