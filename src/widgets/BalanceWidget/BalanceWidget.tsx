import React, { useEffect } from 'react';
import './BalanceWidget.scss';
import { motion, useMotionValue, useAnimation } from 'framer-motion';
import { useNavigate } from 'react-router';
import { ArrowUpRight } from 'lucide-react';

interface BalanceWidgetProps {
  balance: number;
}

export const BalanceWidget: React.FC<BalanceWidgetProps> = ({ balance }) => {
  const navigate = useNavigate();
  const x = useMotionValue(0);
  const controls = useAnimation();

  useEffect(() => {
    const unsubscribe = x.onChange((value: number) => {
      if (value > 0) {
        controls.start({ x: 0, transition: { duration: 0 } });
        x.set(0);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [x, controls]);

  const handleDragEnd = () => {
    const threshold = -100;
    if (x.get() < threshold) {
      navigate('/accounts');
    } else {
      controls.start({ x: 0, transition: { type: 'spring', stiffness: 300 } });
    }
  };

  return (
    <div className="balance-swipe-container">
      <div className="balance-background">
        <div className="balance-background-inner">
          <p className="right-title">Все счета</p>
          <div className="right-action">
            Перейти
            <ArrowUpRight size={16}/>
          </div>
        </div>
      </div>
      <motion.div
        className="balance-card"
        drag="x"
        dragConstraints={{ left: -110, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        style={{ x }}
        animate={controls}
        whileTap={{ cursor: 'grabbing' }}
      >
        <h2 className="label">Всего</h2>
        <h1 className="amount">{balance.toLocaleString('ru-RU')} ₽</h1>
        <p className="hint">Проведите влево, чтобы посмотреть все счета</p>
      </motion.div>
    </div>
  );
};
