import { AnimatePresence } from 'framer-motion';
import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { useUserStore } from '../../store/useUserStore';
import AnimationGuide from '../../components/AnimationGuide';
import RankingModal from './components/RankingModal';
import MyRoomBtn from './components/MyRoomBtn';
import RankMenu from './components/RankMenu';
import Loading from '../../components/Loading';
import { DEMO_WELCOME_STORAGE_KEY } from '@/demo/demoWelcome';

const HiveRooms = lazy(() => import('./components/HiveRooms'));

export default function MainPage() {
  const [isRankingOpen, setIsRankingOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const hasShownGuide = useRef(false);
  const user = useUserStore((state) => state.user);

  const handleLoadingComplete = useCallback(() => {
    if (!hasShownGuide.current) {
      setIsGuideOpen(true);
      hasShownGuide.current = true;
    }
  }, []);

  useEffect(() => {
    if (isGuideOpen) {
      const timer = setTimeout(() => {
        setIsGuideOpen(false);
      }, 2300);

      return () => clearTimeout(timer);
    }
  }, [isGuideOpen]);

  return (
    <main className='@container main-background w-full min-h-screen relative overflow-hidden'>
      {/* 메인 벌집 구조의 방 */}
      <Suspense fallback={<Loading overlay />}>
        <HiveRooms
          myUserId={user?.userId}
          onLoadingComplete={handleLoadingComplete}
        />
      </Suspense>

      {/* 하단 버튼 */}
      <RankMenu onOpen={() => setIsRankingOpen(true)} />
      {user && <MyRoomBtn user={user} />}
      {import.meta.env.DEV && (
        <button
          type='button'
          onClick={() => {
            localStorage.removeItem(DEMO_WELCOME_STORAGE_KEY);
            window.location.reload();
          }}
          className='fixed bottom-6 left-1/2 z-40 -translate-x-1/2 rounded-full border border-white/70 bg-[#162C63]/75 px-4 py-2 text-xs font-semibold text-white shadow-lg backdrop-blur-sm transition-opacity hover:bg-[#162C63]'
          aria-label='데모 안내 미리 보기'>
          데모 안내 미리 보기
        </button>
      )}

      {/* 랭킹 모달 */}
      <AnimatePresence>
        {isRankingOpen && (
          <div className='@container w-full h-full'>
            <RankingModal onClose={() => setIsRankingOpen(false)} />
          </div>
        )}
      </AnimatePresence>

      {/* 드래그 가이드 */}
      <AnimatePresence>
        {isGuideOpen && (
          <AnimationGuide
            titleText={'마우스 왼쪽 버튼으로 드래그하고'}
            subText={'휠로 줌 인/아웃을 해보세요!'}
            onClose={() => setIsGuideOpen(false)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
