import { XMarkIcon } from '@heroicons/react/24/outline';
import { AnimatePresence, motion } from 'framer-motion';
import { useToastStore } from '@/store/useToastStore';
import { TOAST_STYLES } from '@/constants/toast';

const TOAST_ACCENT_STYLES = {
  success: 'bg-[#2E6FF4]',
  error: 'bg-[#FF5F91]',
  info: 'bg-[#7584AD]',
};

const TOAST_ICON_SURFACE_STYLES = {
  success: 'bg-[#EAF1FF]',
  error: 'bg-[#FFF0F5]',
  info: 'bg-[#F0F3FA]',
};

export const Toast = () => {
  const { message, type, description, dismissible, hideToast } =
    useToastStore();

  return (
    <AnimatePresence initial={false} mode='popLayout'>
      {message && type && (
        <motion.div
          key={`${type}-${message}`}
          initial={{ opacity: 0, y: -40, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -16, scale: 0.96 }}
          transition={{
            type: 'spring',
            stiffness: 360,
            damping: 24,
            mass: 0.88,
          }}
          role={type === 'error' ? 'alert' : 'status'}
          aria-live={type === 'error' ? 'assertive' : 'polite'}
          className='fixed left-1/2 top-4 z-[500] w-[min(26rem,calc(100vw-2rem))] -translate-x-1/2 overflow-hidden rounded-2xl border border-white/80 bg-white/80 px-5 py-4 shadow-[0_18px_42px_rgba(15,23,42,0.14),0_6px_16px_rgba(15,23,42,0.06)] backdrop-blur-md'>
          <div className='flex items-start gap-3.5'>
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-[0_8px_20px_rgba(15,23,42,0.07)] ${TOAST_ICON_SURFACE_STYLES[type]}`}>
              <img
                src={TOAST_STYLES[type].icon}
                alt=''
                aria-hidden='true'
                className='h-6 w-6'
              />
            </div>
            <div className='min-w-0 flex-1 pt-0.5'>
              <p className='break-keep text-left text-sm font-semibold tracking-[-0.01em] text-[#1F3468] sm:text-base'>
                {message}
              </p>
              {description && (
                <p className='mt-1 break-keep text-left text-xs font-medium leading-5 text-[#1F3468] opacity-70'>
                  {description}
                </p>
              )}
            </div>
            {dismissible && (
              <button
                type='button'
                onClick={hideToast}
                aria-label='알림 닫기'
                className='rounded-lg p-1.5 text-[#1F3468]/45 transition-colors hover:bg-[#1F3468]/8 hover:text-[#1F3468]'>
                <XMarkIcon className='h-5 w-5' />
              </button>
            )}
          </div>
          <div className={`absolute inset-x-0 bottom-0 h-1 ${TOAST_ACCENT_STYLES[type]}`} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
