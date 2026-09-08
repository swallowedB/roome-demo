export const shouldShowInitialRoomLoading = (
  isModelLoading: boolean,
  hasRenderedScene: boolean,
) => isModelLoading && !hasRenderedScene;

export const getInitialRoomLoadingState = (
  isModelLoading: boolean,
  hasRenderedScene: boolean,
) =>
  shouldShowInitialRoomLoading(isModelLoading, hasRenderedScene)
    ? 'blocking'
    : 'ready';
