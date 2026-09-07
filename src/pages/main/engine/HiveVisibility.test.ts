import assert from 'node:assert/strict';
import test from 'node:test';

import { shouldKeepHiveRoomMounted } from './HiveVisibility';

test('keeps a room mounted while it is inside the render buffer', () => {
  assert.equal(shouldKeepHiveRoomMounted(false, true), true);
});

test('unmounts a room outside both the viewport and the render buffer', () => {
  assert.equal(shouldKeepHiveRoomMounted(false, false), false);
});
