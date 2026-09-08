import assert from 'node:assert/strict';
import test from 'node:test';
import { shouldShowDemoWelcome } from './demoWelcome';

test('shows the demo welcome only for a demo visitor who has not seen it', () => {
  assert.equal(shouldShowDemoWelcome(true, false), true);
  assert.equal(shouldShowDemoWelcome(true, true), false);
  assert.equal(shouldShowDemoWelcome(false, false), false);
});
