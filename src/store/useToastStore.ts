import { create } from 'zustand';

type ToastType = 'success' | 'error' | 'info';

interface ToastOptions {
  description?: string;
  duration?: number;
}

interface ToastState {
  message: string | null;
  type: ToastType | null;
  description: string | null;
  showToast: (message: string, type: ToastType, options?: ToastOptions) => void;
  hideToast: () => void;
}

let toastTimeout: ReturnType<typeof setTimeout> | undefined;

export const useToastStore = create<ToastState>((set) => ({
  message: null,
  type: null,
  description: null,
  showToast: (message, type, { description = null, duration = 5000 } = {}) => {
    if (toastTimeout) clearTimeout(toastTimeout);

    set({ message, type, description });
    toastTimeout = setTimeout(() => {
      set({ message: null, type: null, description: null });
      toastTimeout = undefined;
    }, duration);
  },
  hideToast: () => {
    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = undefined;
    set({ message: null, type: null, description: null });
  },
}));
