import assert from 'node:assert/strict';
import test from 'node:test';

type ShouldShowInitialRoomLoading = (
  isModelLoading: boolean,
  hasRenderedScene: boolean,
) => boolean;

test('only displays room loading before the first scene has rendered', async () => {
  const modulePath = './roomRendering';
  const { shouldShowInitialRoomLoading } = (await import(modulePath)) as {
    shouldShowInitialRoomLoading: ShouldShowInitialRoomLoading;
  };

  assert.equal(shouldShowInitialRoomLoading(true, false), true);
  assert.equal(shouldShowInitialRoomLoading(true, true), false);
  assert.equal(shouldShowInitialRoomLoading(false, true), false);
});
