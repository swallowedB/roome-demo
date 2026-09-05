import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useUserStore } from '../store/useUserStore';
import { useEffect, useState } from 'react';
import { fetchUserInfo, refreshAccessTokenAPI } from '@/apis/auth';
import Loading from '@/components/Loading';
import { DEMO_USER, isDemoMode } from '@/demo/demoMode';

export default function ProtectedRoute() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setUser = useUserStore((state) => state.setUser);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    if (isDemoMode) {
      setUser(DEMO_USER);
      setLoading(false);
      return;
    }

    const initialize = async () => {
      try {
        let token = accessToken;

        if (!token) {
          token = await refreshAccessTokenAPI();
          setAccessToken(token);
        }

        const user = await fetchUserInfo(token);
        setUser(user);
      } catch (error) {
        console.error('🚨 인증 초기화 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, [accessToken, setAccessToken, setUser]);

  if (loading) return <Loading />;

  if (isDemoMode) return <Outlet />;

  const isAuthenticated = !!useAuthStore.getState().accessToken;
  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace state={{ from: location }} />
  );
}
