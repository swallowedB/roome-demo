import {
  HIVE_ROOM_DEPTH_STEP,
  HIVE_ROOM_VERTICAL_STEP,
  HIVE_ROOM_WIDTH,
} from '../constants/hiveGrid';

type CubePosition = [number, number, number];

type PositionedHiveRoom = {
  room: Room;
  position: CubePosition;
  index: number;
};

const directions: CubePosition[] = [
  [-1, 0, 1],
  [1, 0, -1],
  [0, -1, 1],
  [1, -1, 0],
  [-1, 1, 0],
  [0, 1, -1],
];

const expansions = [
  { directionIndex: 2, dir: [-1, 0, 1] as CubePosition },
  { directionIndex: 0, dir: [-1, 0, 1] as CubePosition },
  { directionIndex: 4, dir: [-1, 0, 1] as CubePosition },
  { directionIndex: 3, dir: [1, 0, -1] as CubePosition },
  { directionIndex: 1, dir: [1, 0, -1] as CubePosition },
  { directionIndex: 5, dir: [1, 0, -1] as CubePosition },
];

function expandRing(
  directionIndex: number,
  dir: CubePosition,
  previousRing: number[],
  result: { position: CubePosition; room: Room }[],
  visited: Set<string>,
  rooms: Room[],
  roomIndex: number,
  placedInRing: number,
  positionsInRing: number,
) {
  if (placedInRing >= positionsInRing || roomIndex >= rooms.length) {
    return { roomIndex, placedInRing };
  }

  for (let index = 0; index < previousRing.length; index++) {
    const basePosition = result[
      previousRing[(directionIndex + index) % previousRing.length]
    ].position;
    const position: CubePosition = [
      basePosition[0] + dir[0],
      basePosition[1] + dir[1],
      basePosition[2] + dir[2],
    ];
    const key = position.join(',');

    if (!visited.has(key) && position[0] + position[1] + position[2] === 0) {
      visited.add(key);
      result.push({ position, room: rooms[roomIndex] });
      return { roomIndex: roomIndex + 1, placedInRing: placedInRing + 1 };
    }
  }

  return { roomIndex, placedInRing };
}

export function buildHiveGrid(
  rooms: Room[],
  centerX = 0,
  centerY = 0,
): PositionedHiveRoom[] {
  if (!rooms.length) return [];

  const result: { position: CubePosition; room: Room }[] = [
    { position: [0, 0, 0], room: rooms[0] },
  ];
  const visited = new Set(['0,0,0']);
  const ringRooms: number[][] = [[0]];
  let roomIndex = 1;

  if (roomIndex < rooms.length) {
    const firstRingIndices: number[] = [];

    directions.forEach((position) => {
      if (roomIndex >= rooms.length) return;

      const key = position.join(',');
      if (visited.has(key)) return;

      visited.add(key);
      result.push({ position, room: rooms[roomIndex] });
      firstRingIndices.push(roomIndex++);
    });
    ringRooms.push(firstRingIndices);
  }

  let ring = 1;
  while (roomIndex < rooms.length) {
    const positionsInRing = Math.min(rooms.length - roomIndex, 6);
    let placedInRing = 0;
    const previousRing = ringRooms[ring];

    if (!previousRing?.length) break;

    expansions.forEach(({ directionIndex, dir }) => {
      const updated = expandRing(
        directionIndex,
        dir,
        previousRing,
        result,
        visited,
        rooms,
        roomIndex,
        placedInRing,
        positionsInRing,
      );
      roomIndex = updated.roomIndex;
      placedInRing = updated.placedInRing;
    });

    if (!placedInRing) break;

    ringRooms.push(
      Array.from({ length: placedInRing }, (_, index) =>
        roomIndex - placedInRing + index,
      ),
    );
    ring++;
  }

  return result.map(({ position: [q, r], room }, index) => ({
    room,
    position: [
      centerX + HIVE_ROOM_WIDTH * (q + r / 2),
      centerY - HIVE_ROOM_VERTICAL_STEP * r,
      r * HIVE_ROOM_DEPTH_STEP,
    ],
    index,
  }));
}
