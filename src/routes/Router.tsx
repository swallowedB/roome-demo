import BookPage from '@pages/book/BookPage';
import BookCasePage from '@pages/bookcase/BookCasePage';
import CdPage from '@pages/cd/CdPage';
import CdRackPage from '@pages/cdrack/CdRackPage';
import EventPage from '@pages/event/EventPage';
import LoginPage from '@pages/login/LoginPage';
import MainPage from '@pages/main/MainPage';
import NotFoundPage from '@pages/NotFoundPage';
import PointPage from '@pages/point/PointPage';
import ProfileCardEditPage from '@pages/profile-card-edit/ProfileCardEditPage';
import ProfileCardPage from '@pages/profile-card/ProfileCardPage';
import BaseLayout from '@routes/layout/BaseLayout';
import { Navigate, Route, Routes } from 'react-router-dom';
import { type ReactNode } from 'react';
import RoomPage from '../pages/room/RoomPage';
// import PaymentPage from '@pages/payment/PaymentPage';
// import PaymentSuccessPage from '@pages/payment/PaymentSuccessPage';
// import PaymentFailPage from '@pages/payment/PaymentFailPage';
// import RefundPage from '@pages/payment/RefundPage';
import ProtectedRoute from '@/components/ProtectedRoute';
import OAuthCallback from '@pages/login/components/OAuthCallback';
import ExtraInfo from '@pages/login/ExtraInfo';
import OnboardingPage from '@pages/onboarding/OnboardingPage';
import TempPage from '@pages/temp/TempPage';
import { isDemoMode } from '@/demo/demoMode';

const ServiceOnly = ({ children }: { children: ReactNode }) =>
  isDemoMode ? <Navigate to='/' replace /> : children;

const Router = () => {
  return (
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
        element={<OnboardingPage />}
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
            element={<ServiceOnly><BookCasePage /></ServiceOnly>}
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
          element={<ServiceOnly><BookPage /></ServiceOnly>}
        />
        {/* 다른 유저의 서평 보기 */}
        <Route
          path='/book/:bookId/user/:userId'
          element={<ServiceOnly><BookPage /></ServiceOnly>}
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
  );
};
export default Router;
