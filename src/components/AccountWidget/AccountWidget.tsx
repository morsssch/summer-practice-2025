import React, { useEffect } from 'react';
import './AccountWidget.scss';
import { motion, useMotionValue, useAnimation } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import currencyOptions from '../../constants/currencyOptions.json';

interface AccountWidgetProps {
  id: string;
  name: string;
  balance: number;
  currency: string;
}

export const AccountWidget: React.FC<AccountWidgetProps> = ({
  id,
  name,
  balance,
  currency,
}) => {
  const x = useMotionValue(0);
  const controls = useAnimation();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = x.onChange((value: number) => {
      if (value > 0) {
        controls.start({ x: 0, transition: { duration: 0 } });
        x.set(0);
      }
    });
    return () => unsubscribe();
  }, [x, controls]);

  const handleDragEnd = () => {
    const threshold = -100;
    if (x.get() < threshold) {
      navigate(`/accounts/${id}/edit`);
      controls.start({
        x: -100,
        transition: { type: 'spring', stiffness: 300 },
      });
    } else {
      controls.start({ x: 0, transition: { type: 'spring', stiffness: 300 } });
    }
  };

  const handleClick = () => {
    navigate(`/operations?accountId=${id}`);
  };

  const currencyOption = currencyOptions.find((opt) => opt.value === currency);
  const currencySymbol = currencyOption
    ? currencyOption.label.split(' ')[0]
    : '₽';
  const locale = currency === 'RUB' ? 'ru-RU' : 'en-US';

  return (
    <div className="account-swipe-container">
      <div className="account-background">
        <div className="account-background-inner">
          <p className="right-title">Настройки</p>
          <div className="right-action">
            Перейти
            <ArrowUpRight size={16} />
          </div>
        </div>
      </div>
      <motion.div
        className="account-card"
        drag="x"
        dragConstraints={{ left: -100, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        style={{ x }}
        animate={controls}
        whileTap={{ cursor: 'grabbing' }}
        onClick={handleClick}
      >
        <h2 className="account-name">{name}</h2>
        <p className="account-balance">
          {balance.toLocaleString(locale)} {currencySymbol}
        </p>
      </motion.div>
    </div>
  );
};
