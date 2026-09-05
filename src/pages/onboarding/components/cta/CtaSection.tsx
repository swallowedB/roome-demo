import React from 'react';
import SectionTitle from '../SectionTitle';
import CtaButton from '../CtaButton';
import ctaBackground from '@/assets/onboarding/cta-background.png';
import { isDemoMode } from '@/demo/demoMode';

const CtaSection = () => {
  return (
    <section className='w-full h-[577px] py-16 relative flex flex-col items-center justify-center'>
      <img
        src={ctaBackground}
        alt=''
        className='absolute top-0 left-0 w-auto h-[577px] aspect-[1920/577] object-cover z-0'
      />
      <div className='relative z-10'>
        <SectionTitle
          lowerTitle={
            isDemoMode
              ? 'RoomE 포트폴리오 데모를 둘러보세요'
              : '이제, 당신의 방을 만들어볼 차례예요'
          }
          lowerTitleClassName='text-2xl sm:text-3xl md:text-4xl lg:text-5xl'
          description={
            isDemoMode
              ? '저장한 내용은 새로고침하면 초기화됩니다.'
              : '소셜 로그인으로 간편하게 RoomE를 이용해보세요!'
          }
          descriptionClassName='text-base sm:text-lg md:text-xl lg:text-2xl'
        />
        <CtaButton />
      </div>
    </section>
  );
};

export default CtaSection;
