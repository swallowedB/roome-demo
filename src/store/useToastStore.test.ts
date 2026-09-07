import assert from 'node:assert/strict';
import test from 'node:test';
import { useToastStore } from './useToastStore';

type ToastOptions = {
  description?: string;
  duration?: number;
};

type ToastStateWithDescription = {
  description: string | null;
  hideToast: () => void;
  showToast: (
    message: string,
    type: 'success' | 'error' | 'info',
    options?: ToastOptions,
  ) => void;
};

test('keeps the demo reset notice as a toast description', () => {
  const store = useToastStore.getState() as unknown as ToastStateWithDescription;
  store.hideToast();

  store.showToast('가구 설정이 변경됐어요!', 'success', {
    description: '변경사항은 새로고침하면 초기화됩니다.',
    duration: 100,
  });

  assert.equal(
    (useToastStore.getState() as unknown as ToastStateWithDescription)
      .description,
    '변경사항은 새로고침하면 초기화됩니다.',
  );

  store.hideToast();
});
