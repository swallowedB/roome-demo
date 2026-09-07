import { useUserStore } from '@/store/useUserStore';
import { getPointBalance, getPointHistory } from '@apis/point';
import PointReceipt from '@components/point/PointReceipt';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import PointHistory from './components/PointHistory';

export default function PointPage() {
  const navigate = useNavigate();
  const [pointBalance, setPointBalance] = useState(0);

  const userId = Number(useParams().userId);
  const myUserId = useUserStore((state) => state.user).userId;

  const { ref, inView } = useInView();

  // useInfiniteQuery
  const { data, isLoading, isFetching, hasNextPage, fetchNextPage } =
    useInfiniteQuery({
      queryKey: ['points', userId],
      queryFn: async ({ pageParam }) => {
        return pageParam.dayCursor
          ? fetchPointsHistory(pageParam?.itemCursor, pageParam.dayCursor)
          : fetchPointsHistory(pageParam?.itemCursor);
      },
      getNextPageParam: (lastPage) => {
        if (lastPage.nextItemCursor > lastPage.lastId) {
          return {
            itemCursor: lastPage.nextItemCursor,
            dayCursor: lastPage.nextDayCursor,
          };
        }
        return undefined;
      },
      initialPageParam: { itemCursor: 0, dayCursor: '' },
      staleTime: 1000 * 60 * 1, // 1분
    });

  useEffect(() => {
    const fetchPointBalance = async () => {
      try {
        const { balance } = await getPointBalance(userId);
        setPointBalance(balance);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPointBalance();
  }, [userId]);

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const fetchPointsHistory = useCallback(
    async (itemCursor: number, dayCursor?: string) => {
      return dayCursor
        ? await getPointHistory(20, itemCursor, dayCursor)
        : await getPointHistory(20, itemCursor);
    },
    [],
  );

  if (userId !== myUserId) {
    navigate(`/profile/${userId}`);
  }
  return (
    <div className='w-full h-screen main-background'>
      <PointReceipt
        balance={pointBalance}
        onClose={() => navigate(-1)}>
        {isLoading ? (
          <div className='w-full h-[400px] flex items-center justify-center'>
            <p className='text-gray-500 animate-pulse'>로딩 중...</p>
          </div>
        ) : (
          <PointHistory
            data={data}
            isFetching={isFetching}
            ref={ref}
          />
        )}
      </PointReceipt>
    </div>
  );
}
