import { useEffect, useRef, useState } from 'react';
import CdAddIcon from '../../../components/icons/CdAddIcon';
import CdListIcon from '../../../components/icons/CdListIcon';
import DesktopActionRail from '../../../components/DesktopActionRail';
import DockMenuIcon from '../../../components/icons/DockMenuIcon';
import { useWindowSize } from '../../../hooks/useWindowSize';

export default function CdDockMenu({
  activeSettings,
  onSettingsChange,
  resetState,
}: CdDockMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { width } = useWindowSize();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (resetState) {
      setIsOpen(false);
    }
  }, [resetState]);

  if (width >= 1280) {
    return (
      <DesktopActionRail
        ariaLabel='플레이리스트 편집'
        actions={[
          {
            id: 'add',
            label: '새 음악 추가하기',
            isActive: activeSettings === 'add',
            onClick: () => {
              onSettingsChange('add');
            },
            icon: (
              <CdAddIcon
                className={`h-8 w-8 text-white transition-opacity ${
                  activeSettings === 'add'
                    ? 'opacity-100'
                    : 'opacity-40 group-hover:opacity-100'
                }`}
              />
            ),
          },
          {
            id: 'delete',
            label: '음악 삭제하기',
            isActive: activeSettings === 'delete',
            onClick: () => {
              onSettingsChange('delete');
            },
            icon: (
              <CdListIcon
                className={`h-8 w-8 text-white transition-opacity ${
                  activeSettings === 'delete'
                    ? 'opacity-100'
                    : 'opacity-40 group-hover:opacity-100'
                }`}
              />
            ),
          },
        ]}
      />
    );
  }

  return (
    <div
      ref={menuRef}
      aria-label='플레이리스트 편집 메뉴 열기'
      className={`bottom-menu bottom-20 right-21 max-sm:bottom-12 max-sm:right-8 relative z-[5] ${
        isOpen ? 'h-[202px]' : 'h-16'
      }`}>
      <div className='relative flex flex-col-reverse items-center w-full h-full gap-5'>
        {/* 메인 버튼 */}
        <button
          className='bottom-menu-icon bg-white group absolute'
          onClick={() => {
            setIsOpen((prev) => !prev);
          }}>
          <DockMenuIcon
            className={`w-6 h-6 transition-colors ${
              activeSettings === null
                ? 'text-[#162C63]'
                : 'text-white group-hover:text-[#516392]'
            }`}
          />
          <span className='absolute right-full mr-4 w-max bg-white text-[#162C63] text-xs font-semibold rounded-full px-4 py-[6px] opacity-0 group-hover:opacity-100 transition-opacity'>
            플레이리스트 편집하기
          </span>
        </button>

        {/* 하위 버튼 */}
        {isOpen && (
          <div className='bottom-menu-content'>
            {/* 새 음악 추가하기 */}
            <button
              onClick={() => {
                onSettingsChange('add');
              }}
              className={`bottom-menu-icon group absolute bottom-[68px] ${
                activeSettings === 'add'
                  ? 'bg-white'
                  : 'bg-transparent hover:bg-white/50'
              }`}>
              <CdAddIcon
                className={`w-8 h-8 transition-colors ${
                  activeSettings === 'add'
                    ? 'text-[#162C63]'
                    : 'text-white group-hover:text-[#516392]'
                }`}
              />
              <span className='absolute right-full mr-4 w-max bg-white text-[#162C63] text-xs font-semibold rounded-full px-4 py-[6px] opacity-0 group-hover:opacity-100 transition-opacity'>
                새 음악 추가하기
              </span>
            </button>

            {/* 음악 삭제하기 */}
            <button
              onClick={() => {
                onSettingsChange('delete');
              }}
              className={`bottom-menu-icon group absolute bottom-[138px] ${
                activeSettings === 'delete'
                  ? 'bg-white'
                  : 'bg-transparent hover:bg-white/50'
              }`}>
              <CdListIcon
                className={`w-8 h-8 transition-colors ${
                  activeSettings === 'delete'
                    ? 'text-[#162C63]'
                    : 'text-white group-hover:text-[#516392]'
                }`}
              />
              <span className='absolute right-full mr-4 w-max bg-white text-[#162C63] text-xs font-semibold rounded-full px-4 py-[6px] opacity-0 group-hover:opacity-100 transition-opacity'>
                음악 삭제하기
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
