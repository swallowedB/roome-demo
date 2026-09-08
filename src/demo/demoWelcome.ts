export const DEMO_WELCOME_STORAGE_KEY = 'roome-demo-welcome-shown';

export const shouldShowDemoWelcome = (
  isDemo: boolean,
  hasSeenWelcome: boolean,
) => isDemo && !hasSeenWelcome;
