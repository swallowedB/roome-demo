import { create } from 'zustand';

type ToastType = 'success' | 'error' | 'info';

interface ToastState {
  message: string | null;
  type: ToastType | null;
  showToast: (message: string, type: ToastType, duration?: number) => void;
  hideToast: () => void;
}

let toastTimeout: ReturnType<typeof setTimeout> | undefined;

export const useToastStore = create<ToastState>((set) => ({
  message: null,
  type: null,
  showToast: (message, type, duration = 5000) => {
    if (toastTimeout) clearTimeout(toastTimeout);

    set({ message, type });
    toastTimeout = setTimeout(() => {
      set({ message: null, type: null });
      toastTimeout = undefined;
    }, duration);
  },
  hideToast: () => {
    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = undefined;
    set({ message: null, type: null });
  },
}));
