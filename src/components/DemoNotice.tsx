import { useEffect, useState } from 'react';
import LayeredButton from './LayeredButton';
import ModalBackground from './ModalBackground';
import {
  DEMO_WELCOME_STORAGE_KEY,
  shouldShowDemoWelcome,
} from '@/demo/demoWelcome';
import { isDemoMode } from '@/demo/demoMode';

const hasSeenDemoWelcome = () =>
  localStorage.getItem(DEMO_WELCOME_STORAGE_KEY) === 'true';

export default function DemoNotice() {
  const [isOpen, setIsOpen] = useState(() =>
    shouldShowDemoWelcome(isDemoMode, hasSeenDemoWelcome()),
  );

  useEffect(() => {
    if (!isOpen) return;

    localStorage.setItem(DEMO_WELCOME_STORAGE_KEY, 'true');
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <ModalBackground onClose={() => setIsOpen(false)}>
      <section
        role='dialog'
        aria-modal='true'
        aria-labelledby='demo-welcome-title'
        className='w-[min(440px,calc(100vw-40px))] rounded-3xl border-2 border-[#FCF7FD] bg-[#FCF7FD]/20 p-2.5 backdrop-blur-2xl modal-shadow'>
        <div className='rounded-2xl bg-[#FCF7FD] px-8 py-10 text-center'>
          <img
            src='/RoomE.svg'
            alt=''
            className='mx-auto mb-4 h-14 w-14'
          />
          <h2
            id='demo-welcome-title'
            className='mb-5 text-2xl font-bold text-[#162C63]'>
            RoomE 데모에 오신 걸 환영해요!
          </h2>
          <p className='mb-8 text-[15px] leading-6 text-[#162C63B2]'>
            방을 둘러보고, 가구를 자유롭게 바꿔보세요.
            <br />
            변경한 내용은 새로고침하면 초기화됩니다.
          </p>
          <LayeredButton
            theme='blue'
            onClick={() => setIsOpen(false)}
            className='py-2.5 text-base'>
            RoomE 둘러보기
          </LayeredButton>
        </div>
      </section>
    </ModalBackground>
  );
}
