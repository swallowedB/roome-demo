export const getEntryPath = (demo: boolean) => (demo ? '/' : '/login');

export const getCurrentRoomPath = (user: { userId: number }) =>
  `/room/${user.userId}`;

export const navigateToRoom = (
  navigate: (path: string, options: { viewTransition: true }) => void,
  user: { userId: number },
) => navigate(getCurrentRoomPath(user), { viewTransition: true });
