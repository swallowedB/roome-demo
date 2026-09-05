import ctaButtonImage from '@/assets/onboarding/button-background-image.png';
import { Link } from 'react-router-dom';
import { getEntryPath } from '@/demo/demoEntry';
import { isDemoMode } from '@/demo/demoMode';

const CtaButton = () => {
  return (
    <div className='w-full flex items-center justify-center'>
      <Link
        to={getEntryPath(isDemoMode)}
        style={{ backgroundImage: `url(${ctaButtonImage})` }}
        className='inline-flex items-center justify-center h-14 px-12
          bg-cover bg-center bg-no-repeat rounded-full
          text-white font-bold hover:opacity-90 transition-opacity
          whitespace-nowrap break-keep'>
        {isDemoMode ? '포트폴리오 데모 시작하기' : 'RoomE 이용하러 가기'}
      </Link>
    </div>
  );
};

export default CtaButton;
