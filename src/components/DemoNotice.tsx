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
          <p className='mb-3 text-xs font-bold tracking-[0.16em] text-[#73A1F7]'>
            PORTFOLIO DEMO
          </p>
          <h2
            id='demo-welcome-title'
            className='mb-3 text-2xl font-bold text-[#162C63]'>
            RoomE 데모에 오신 걸 환영해요!
          </h2>
          <p className='mb-2 text-[15px] leading-6 text-[#162C63B2]'>
            이 사이트는 RoomE 포트폴리오 데모입니다.
            <br />
            방을 둘러보고 가구를 설정해 보세요.
          </p>
          <p className='mb-8 text-xs leading-5 text-[#162C63]/70'>
            데모에서 바꾼 내용은 새로고침하면 초기화됩니다.
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
