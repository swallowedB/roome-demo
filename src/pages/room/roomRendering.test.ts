import assert from 'node:assert/strict';
import test from 'node:test';

type ShouldShowInitialRoomLoading = (
  isModelLoading: boolean,
  hasRenderedScene: boolean,
) => boolean;

type InitialRoomLoadingState = 'blocking' | 'ready';

test('only displays room loading before the first scene has rendered', async () => {
  const modulePath = './roomRendering';
  const { shouldShowInitialRoomLoading } = (await import(modulePath)) as {
    shouldShowInitialRoomLoading: ShouldShowInitialRoomLoading;
  };

  assert.equal(shouldShowInitialRoomLoading(true, false), true);
  assert.equal(shouldShowInitialRoomLoading(true, true), false);
  assert.equal(shouldShowInitialRoomLoading(false, true), false);
});

test('uses a blocking room-loading state until the first scene is rendered', async () => {
  const modulePath = './roomRendering';
  const { getInitialRoomLoadingState } = (await import(modulePath)) as {
    getInitialRoomLoadingState?: (
      isModelLoading: boolean,
      hasRenderedScene: boolean,
    ) => InitialRoomLoadingState;
  };

  assert.equal(getInitialRoomLoadingState?.(true, false), 'blocking');
  assert.equal(getInitialRoomLoadingState?.(true, true), 'ready');
});
