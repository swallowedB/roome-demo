import assert from 'node:assert/strict';
import test from 'node:test';
import * as demoEntry from './demoEntry';

type RoomNavigation = (
  navigate: (path: string, options: unknown) => void,
  user: { userId: number },
) => void;

test('navigates from the hive to a room with a browser view transition', () => {
  const calls: Array<{ path: string; options: unknown }> = [];
  const { navigateToRoom } = demoEntry as typeof demoEntry & {
    navigateToRoom: RoomNavigation;
  };

  navigateToRoom((path, options) => calls.push({ path, options }), {
    userId: 101,
  });

  assert.deepEqual(calls, [
    { path: '/room/101', options: { viewTransition: true } },
  ]);
});
