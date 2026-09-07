export const shouldOpenDemoPointReceipt = (
  isDemoMode: boolean,
  isRoomOwner: boolean,
) => isDemoMode && isRoomOwner;
