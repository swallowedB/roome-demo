import Header from '@components/header/Header';
import { Outlet } from 'react-router-dom';
import DemoNotice from '@components/DemoNotice';
import { isDemoMode } from '@/demo/demoMode';

interface BaseLayoutProps {
  hasHeader?: boolean;
}

const BaseLayout = ({ hasHeader = true }: BaseLayoutProps) => {
  return (
    <div className='min-h-screen relative'>
      <main className={`${hasHeader ? 'pt-[header높이값]' : ''} relative`}>
        <Outlet />
      </main>
      {hasHeader && <Header />}
      {hasHeader && isDemoMode && <DemoNotice />}
    </div>
  );
};

export default BaseLayout;
