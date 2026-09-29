import MainPage from '@pages/main/MainPage';
import BaseLayout from '@routes/layout/BaseLayout';
import { Navigate, Route, Routes } from 'react-router-dom';
import { lazy, Suspense, type ReactNode } from 'react';
// import PaymentPage from '@pages/payment/PaymentPage';
// import PaymentSuccessPage from '@pages/payment/PaymentSuccessPage';
// import PaymentFailPage from '@pages/payment/PaymentFailPage';
// import RefundPage from '@pages/payment/RefundPage';
import ProtectedRoute from '@/components/ProtectedRoute';
import { isDemoMode } from '@/demo/demoMode';
import Loading from '@/components/Loading';

const BookPage = lazy(() => import('@pages/book/BookPage'));
const BookCasePage = lazy(() => import('@pages/bookcase/BookCasePage'));
const CdPage = lazy(() => import('@pages/cd/CdPage'));
const CdRackPage = lazy(() => import('@pages/cdrack/CdRackPage'));
const EventPage = lazy(() => import('@pages/event/EventPage'));
const LoginPage = lazy(() => import('@pages/login/LoginPage'));
const NotFoundPage = lazy(() => import('@pages/NotFoundPage'));
const PointPage = lazy(() => import('@pages/point/PointPage'));
const ProfileCardEditPage = lazy(
  () => import('@pages/profile-card-edit/ProfileCardEditPage'),
);
const ProfileCardPage = lazy(() => import('@pages/profile-card/ProfileCardPage'));
const RoomPage = lazy(() => import('@pages/room/RoomPage'));
const OAuthCallback = lazy(() => import('@pages/login/components/OAuthCallback'));
const ExtraInfo = lazy(() => import('@pages/login/ExtraInfo'));
const TempPage = lazy(() => import('@pages/temp/TempPage'));

const ServiceOnly = ({ children }: { children: ReactNode }) =>
  isDemoMode ? <Navigate to='/' replace /> : children;

const Router = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
      <Route
        path='/temp'
        element={<ServiceOnly><TempPage /></ServiceOnly>}
      />
      <Route
        path='/login/callback'
        element={<ServiceOnly><OAuthCallback /></ServiceOnly>}
      />
      <Route
        path='/login'
        element={<ServiceOnly><LoginPage /></ServiceOnly>}
      />
      <Route
        path='/onboarding'
        element={<Navigate to='/' replace />}
      />
      <Route
        path='/login/info'
        element={<ServiceOnly><ExtraInfo /></ServiceOnly>}
      />

      {/* 보호 라우터  */}
      <Route element={<ProtectedRoute />}>
        {/* 헤더가 필요한 페이지 */}
        <Route element={<BaseLayout hasHeader={true} />}>
          <Route
            path='/'
            element={<MainPage />}
          />
          <Route
            path='/bookcase/:userId'
            element={<BookCasePage />}
          />
          <Route
            path='/cdrack/:userId'
            element={<CdRackPage />}
          />
          <Route
            path='/room/:userId'
            element={<RoomPage />}
          />
          <Route
            path='/profile/:userId'
            element={<ServiceOnly><ProfileCardPage /></ServiceOnly>}
          />
          <Route
            path='/profile/:userId/edit'
            element={<ServiceOnly><ProfileCardEditPage /></ServiceOnly>}
          />
          <Route
            path='/point/:userId'
            element={<ServiceOnly><PointPage /></ServiceOnly>}
          />
          {/* <Route
          path='/payment'
          element={<PaymentPage />}
          />
          <Route
          path='/payment/refund'
          element={<RefundPage />}
          /> */}
          <Route
            path='/event'
            element={<ServiceOnly><EventPage /></ServiceOnly>}
          />
          <Route
            path='/cd/:cdId/user/:userId'
            element={<CdPage />}
          />
        </Route>

        {/* 내 서평 보기/작성/수정 */}
        <Route
          path='/book/:bookId'
          element={<BookPage />}
        />
        {/* 다른 유저의 서평 보기 */}
        <Route
          path='/book/:bookId/user/:userId'
          element={<BookPage />}
        />
        <Route
          path='*'
          element={<NotFoundPage />}
        />

        {/* <Route
        path='/payment/success'
        element={<PaymentSuccessPage />}
        />
        <Route
        path='/payment/fail'
        element={<PaymentFailPage />}
        /> */}
      </Route>
      </Routes>
    </Suspense>
  );
};
export default Router;
