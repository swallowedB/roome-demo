import type { ReactNode } from 'react';

interface DesktopAction {
  id: string;
  icon: ReactNode;
  isActive?: boolean;
  label: string;
  onClick: () => void;
}

interface DesktopActionRailProps {
  actions: DesktopAction[];
  ariaLabel: string;
}

export default function DesktopActionRail({
  actions,
  ariaLabel,
}: DesktopActionRailProps) {
  return (
    <aside
      aria-label={ariaLabel}
      className='fixed right-10 top-1/2 z-40 flex -translate-y-1/2 flex-col gap-7'>
      {actions.map(({ id, icon, isActive, label, onClick }) => (
        <button
          key={id}
          type='button'
          aria-label={label}
          onClick={onClick}
          className={`group relative flex h-8 w-8 items-center justify-center transition-transform duration-200 hover:scale-110 ${
            isActive ? 'scale-110' : ''
          }`}>
          {icon}
          <span className='absolute right-full mr-4 w-max rounded-full bg-white px-4 py-[10px] text-xs font-semibold text-[#162C63] opacity-0 transition-opacity group-hover:opacity-100'>
            {label}
          </span>
        </button>
      ))}
    </aside>
  );
}
