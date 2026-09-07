import loding from '@assets/loading.svg';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface LoadingProps {
  overlay?: boolean;
}

interface DelayedLoadingProps extends LoadingProps {
  delay?: number;
  isLoading?: boolean;
}

const Loading = ({ overlay = false }: LoadingProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className={`${
        overlay ? 'absolute inset-0' : 'w-full h-screen relative'
      } bg-[#1E3675]/80 backdrop-blur-xs flex place-content-center z-99`}
    >
      <div className="container">
      <img src={loding} alt="loading" className="box box-1 w-30 h-30" />
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
      </div>
    </motion.div>
  );
};

export const DelayedLoading = ({
  delay = 250,
  overlay = false,
  isLoading = true,
}: DelayedLoadingProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setIsVisible(false);
      return;
    }

    const timer = window.setTimeout(() => setIsVisible(true), delay);
    return () => window.clearTimeout(timer);
  }, [delay, isLoading]);

  return (
    <AnimatePresence>
      {isVisible && <Loading overlay={overlay} />}
    </AnimatePresence>
  );
};

export default Loading;
