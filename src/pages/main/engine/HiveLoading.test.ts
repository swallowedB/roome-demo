import assert from 'node:assert/strict';
import test from 'node:test';
import { hasInitialHiveSceneLoaded } from './HiveLoading';

test('marks the hive ready after the first three visible rooms load', () => {
  assert.equal(
    hasInitialHiveSceneLoaded(
      ['room-1', 'room-2', 'room-3', 'room-4'],
      new Set(['room-1', 'room-2', 'room-3']),
    ),
    true,
  );
});

test('keeps the hive loading until three visible rooms load', () => {
  assert.equal(
    hasInitialHiveSceneLoaded(
      ['room-1', 'room-2', 'room-3', 'room-4'],
      new Set(['room-1', 'room-2']),
    ),
    false,
  );
});

test('requires every room when fewer than three are initially visible', () => {
  assert.equal(
    hasInitialHiveSceneLoaded(['room-1', 'room-2'], new Set(['room-1'])),
    false,
  );
});
