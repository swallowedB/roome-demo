import assert from 'node:assert/strict';
import test from 'node:test';
import * as HiveLoading from './HiveLoading';

const { hasInitialHiveSceneLoaded } = HiveLoading;

type HiveLoadingState = 'loading' | 'ready';

const getHiveLoadingState = (
  HiveLoading as typeof HiveLoading & {
    getHiveLoadingState?: (
      isRoomDataLoading: boolean,
      isSceneLoading: boolean,
    ) => HiveLoadingState;
  }
).getHiveLoadingState;

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

test('keeps the hive covered until room data and the initial scene are both ready', () => {
  assert.equal(getHiveLoadingState?.(true, false), 'loading');
  assert.equal(getHiveLoadingState?.(false, true), 'loading');
  assert.equal(getHiveLoadingState?.(false, false), 'ready');
});
