export const shouldShowInitialRoomLoading = (
  isModelLoading: boolean,
  hasRenderedScene: boolean,
) => isModelLoading && !hasRenderedScene;
