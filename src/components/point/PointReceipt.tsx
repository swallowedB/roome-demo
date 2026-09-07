import coin from '@assets/point/coin.svg';
import receipt from '@assets/point/receipt.svg';
import { motion } from 'framer-motion';
import type { MouseEvent, ReactNode } from 'react';

interface PointReceiptProps {
  balance: number;
  children: ReactNode;
  onClose: () => void;
}

export default function PointReceipt({
  balance,
  children,
  onClose,
}: PointReceiptProps) {
  const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) onClose();
  };

  return (
    <motion.div
      role='dialog'
      aria-modal='true'
      aria-label='포인트 영수증'
      initial={{ y: '100vh', opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: '100vh', opacity: 0 }}
      transition={{ type: 'spring', stiffness: 130, damping: 18 }}
      onClick={handleBackdropClick}
      className='fixed inset-0 z-50 flex items-center justify-center'>
      <div className='relative w-[min(86vw,320px)] aspect-[400/650]'>
        <div
          style={{ backgroundImage: `url(${receipt})` }}
          className='w-full h-full bg-contain bg-no-repeat bg-center flex flex-col items-center gap-4 p-10'>
          <h1 className='text-[#3E507D] text-3xl font-bold py-4'>
            Point Receipt
          </h1>

          {children}

          <div className='w-full'>
            <div className='flex justify-between items-center mb-6'>
              <p className='text-[#162C63] font-medium text-sm'>
                포인트 잔고
              </p>
              <div className='flex items-center gap-1'>
                <img
                  src={coin}
                  alt='코인 이미지'
                  className='w-4 h-4'
                />
                <p className='text-[#162C63] text-sm font-medium'>
                  {balance.toLocaleString('ko-KR')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
