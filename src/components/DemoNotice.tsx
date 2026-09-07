import { useEffect } from 'react';
import { useToastStore } from '@/store/useToastStore';

const DEMO_NOTICE_SESSION_KEY = 'roome-demo-notice-shown';

export default function DemoNotice() {
  const showToast = useToastStore((state) => state.showToast);

  useEffect(() => {
    if (sessionStorage.getItem(DEMO_NOTICE_SESSION_KEY)) return;

    sessionStorage.setItem(DEMO_NOTICE_SESSION_KEY, 'true');
    showToast('포트폴리오 데모입니다.', 'info', {
      description: '변경사항은 새로고침하면 초기화됩니다.',
      duration: 3000,
    });
  }, [showToast]);

  return null;
}
