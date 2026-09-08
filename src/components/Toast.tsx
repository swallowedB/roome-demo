import { useToastStore } from '@/store/useToastStore';
import { TOAST_STYLES } from '@/constants/toast';

export const Toast = () => {
  const { message, type, description } = useToastStore();

  if (!message || !type) return null;

  const style = TOAST_STYLES[type];

  return (
    <div
      className={`
      fixed top-8 left-1/2 -translate-x-1/2 z-[500]
      py-4 px-8 rounded-lg
      flex items-center gap-4 justify-start
      border-2 ${style?.bg} ${style?.border}
      animate-fade-in-down
      shadow-md
      w-auto max-w-sm sm:max-w-md md:max-w-lg
      sm:w-auto max-sm:w-[calc(100vw-3rem)]
    `}>
      <img
        src={style?.icon}
        alt={`${type} 알림 아이콘`}
        className={`h-7 w-7 flex-shrink-0 ${style?.iconColor}`}
      />
      <div className='flex min-w-0 flex-col items-start gap-1'>
        <span
          className={`${style?.textColor} break-keep text-left text-sm font-semibold sm:text-base`}>
          {message}
        </span>
        {description && (
          <span
            className={`${style?.textColor} break-keep text-left text-xs font-medium opacity-70`}>
            {description}
          </span>
        )}
      </div>
    </div>
  );
};
