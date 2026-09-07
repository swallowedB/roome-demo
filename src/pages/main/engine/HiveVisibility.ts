export const shouldKeepHiveRoomMounted = (
  isInViewport: boolean,
  isInRenderBuffer: boolean,
) => isInViewport || isInRenderBuffer;
