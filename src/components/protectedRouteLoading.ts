export type ProtectedRouteLoadingState = 'hidden' | 'delayed' | 'ready';

export const getProtectedRouteLoadingState = (
  isDemo: boolean,
  isLoading: boolean,
): ProtectedRouteLoadingState => {
  if (!isLoading) return 'ready';
  return isDemo ? 'hidden' : 'delayed';
};
