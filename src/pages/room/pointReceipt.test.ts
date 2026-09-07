import assert from 'node:assert/strict';
import test from 'node:test';

type ShouldOpenDemoPointReceipt = (
  isDemoMode: boolean,
  isRoomOwner: boolean,
) => boolean;

test('opens a receipt only for the demo room owner', async () => {
  const modulePath = './pointReceiptBehavior';
  const { shouldOpenDemoPointReceipt } = (await import(modulePath)) as {
    shouldOpenDemoPointReceipt: ShouldOpenDemoPointReceipt;
  };

  assert.equal(shouldOpenDemoPointReceipt(true, true), true);
  assert.equal(shouldOpenDemoPointReceipt(true, false), false);
  assert.equal(shouldOpenDemoPointReceipt(false, true), false);
});
