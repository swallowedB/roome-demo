import { isDemoMode } from './demoMode';

export const withDemoResetNotice = (message: string) =>
  isDemoMode ? `${message} 변경사항은 새로고침하면 초기화됩니다.` : message;
