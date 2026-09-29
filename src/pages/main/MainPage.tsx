import { AnimatePresence } from 'framer-motion';
import { lazy, Suspense, useState } from 'react';
import { useUserStore } from '../../store/useUserStore';
import RankingModal from './components/RankingModal';
import MyRoomBtn from './components/MyRoomBtn';
import RankMenu from './components/RankMenu';
import Loading from '../../components/Loading';

const HiveRooms = lazy(() => import('./components/HiveRooms'));

export default function MainPage() {
  const [isRankingOpen, setIsRankingOpen] = useState(false);
  const user = useUserStore((state) => state.user);

  const handleRankOpen = () => setIsRankingOpen(true);

  return (
    <main className='@container main-background w-full min-h-screen relative overflow-hidden'>
      {/* 메인 벌집 구조의 방 */}
      <Suspense fallback={<Loading overlay />}>
        <HiveRooms myUserId={user?.userId} />
      </Suspense>

      {/* 하단 버튼 */}
      <RankMenu onOpen={handleRankOpen} />
      {user && <MyRoomBtn user={user} />}

      {/* 랭킹 모달 */}
      <AnimatePresence>
        {isRankingOpen && (
          <div className='@container w-full h-full'>
            <RankingModal onClose={() => setIsRankingOpen(false)} />
          </div>
        )}
      </AnimatePresence>

    </main>
  );
}
