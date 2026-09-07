export const hasInitialHiveSceneLoaded = (
  initialRoomIds: string[],
  loadedRooms: Set<string>,
) => {
  const requiredRoomIds = initialRoomIds.slice(
    0,
    Math.min(3, initialRoomIds.length),
  );

  return (
    requiredRoomIds.length > 0 &&
    requiredRoomIds.every((roomId) => loadedRooms.has(roomId))
  );
};
