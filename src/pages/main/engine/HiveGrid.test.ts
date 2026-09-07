import assert from 'node:assert/strict';
import test from 'node:test';

import { buildHiveGrid } from './HiveGrid';

const rooms = Array.from(
  { length: 33 },
  (_, index) => ({ roomId: String(index + 1) }) as Room,
);

test('gives all 33 hive rooms distinct world coordinates', () => {
  const positionedRooms = buildHiveGrid(rooms);
  const coordinateKeys = positionedRooms.map(({ position }) => position.join(','));

  assert.equal(positionedRooms.length, 33);
  assert.equal(new Set(coordinateKeys).size, 33);
});

test('uses full-scale spacing for the first hexagonal ring', () => {
  const positionedRooms = buildHiveGrid(rooms);

  assert.deepEqual(
    positionedRooms.slice(0, 7).map(({ position }) => position),
    [
      [0, 0, 0],
      [-2.823, 0, 0],
      [2.823, 0, 0],
      [-1.4115, 1.6514166666666666, -1.4],
      [1.4115, 1.6514166666666666, -1.4],
      [-1.4115, -1.6514166666666666, 1.4],
      [1.4115, -1.6514166666666666, 1.4],
    ],
  );
});
