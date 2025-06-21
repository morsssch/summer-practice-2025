import React, { useEffect, useState } from 'react';
import './BalanceWidget.scss';
import { motion, useMotionValue, useAnimation } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import provider from '../../services/provider';
import currencyOptions from '../../constants/currencyOptions.json';

export const BalanceWidget: React.FC = () => {
  const [balance, setBalance] = useState<number | null>(null);
  const [defaultCurrency, setDefaultCurrency] = useState<string>('RUB');
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

  useEffect(() => {
    const fetchData = async () => {
      const [total, currency] = await Promise.all([
        provider.getTotalBalance(await provider.getDefaultCurrency()),
        provider.getDefaultCurrency(),
      ]);
      setBalance(total);
      setDefaultCurrency(currency || 'RUB');
    };
    fetchData();
  }, []);

  const handleDragEnd = () => {
    const threshold = -100;
    if (x.get() < threshold) {
      navigate('/accounts');
    } else {
      controls.start({ x: 0, transition: { type: 'spring', stiffness: 300 } });
    }
  };

  const currencyOption = currencyOptions.find(
    (opt) => opt.value === defaultCurrency,
  );
  const currencySymbol = currencyOption
    ? currencyOption.label.split(' ')[0]
    : '₽';
  const locale = defaultCurrency === 'RUB' ? 'ru-RU' : 'en-US';

  return (
    <div className="balance-swipe-container">
      <div className="balance-background">
        <div className="balance-background-inner">
          <p className="right-title">Все счета</p>
          <div className="right-action">
            Перейти
            <ArrowUpRight size={16} />
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
        <h1 className="amount">
          {balance === null
            ? 'Загрузка...'
            : `${balance.toLocaleString(locale)} ${currencySymbol}`}
        </h1>
        <p className="hint">Проведите влево, чтобы посмотреть все счета</p>
      </motion.div>
    </div>
  );
};
