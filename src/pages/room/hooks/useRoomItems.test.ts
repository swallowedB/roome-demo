import assert from 'node:assert/strict';
import test from 'node:test';
import { getRoomItems } from './useRoomItems';

test('keeps the piggy bank in demo room items', () => {
  const items = getRoomItems({ roomId: 101, furnitures: [] });

  assert.equal(
    items.some((item) => item.type === 'PIGGY_BANK'),
    true,
  );
});
