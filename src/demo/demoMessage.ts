import { isDemoMode } from './demoMode';

export const demoResetToastOptions = isDemoMode
  ? { description: '변경사항은 새로고침하면 초기화됩니다.' }
  : undefined;
