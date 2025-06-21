import React, { useEffect, useRef, useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import './OperationsPage.scss';
import { useSearchParams } from 'react-router-dom';
import { Settings2 } from 'lucide-react';
import { OperationGroup } from '../../components/OperationGroup/OperationGroup';
import { Dropdown } from '../../components/Dropdown/Dropdown';
import DatePicker from '../../components/DatePicker/DatePicker';
import provider from '../../services/provider';
import type { Account, Category, Transaction } from '../../services/types';
import { ActionButton } from '../../components/ActionButton/ActionButton';

const periodOptions = [
  { value: 'all', label: 'Все операции' },
  { value: 'day', label: 'За день' },
  { value: 'week', label: 'За неделю' },
  { value: 'month', label: 'За месяц' },
  { value: 'custom', label: 'Период' },
];

export const OperationsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [type, setType] = useState<string>('all');
  const [accountId, setAccountId] = useState<string>('');
  const [currency, setCurrency] = useState<string>('');
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [period, setPeriod] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [visibleCount, setVisibleCount] = useState(10);

  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = searchParams.get('type');
    const a = searchParams.get('accountId');
    const c = searchParams.get('currency');
    const d = searchParams.get('dateRange');

    if (t) {setType(t);}
    if (a) {setAccountId(a);}
    if (c) {setCurrency(c);}
    if (d && d.includes(',')) {
      const [start, end] = d.split(',');
      if (start && end) {
        setDateRange([start, end]);
      } else {
        setDateRange(null);
      }
    } else {
      setDateRange(null);
    }
  }, [searchParams]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [txs, accs, cats] = await Promise.all([
          provider.getTransactions(),
          provider.getAccounts(),
          provider.getCategories(),
        ]);
        setTransactions(txs);
        setAccounts(accs);
        setCategories(cats);
        setError(null);
      } catch (err) {
        setError('Ошибка загрузки данных');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleCount((prev) => prev + 10);
        }
      },
      { threshold: 0.1 },
    );
    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  const updateParam = (key: string, value: string) => {
    if (value) {
      searchParams.set(key, value);
    } else {
      searchParams.delete(key);
    }
    setSearchParams(searchParams, { replace: true });
  };

  const resetFilters = () => {
    setType('all');
    setAccountId('');
    setCurrency('');
    setDateRange(null);
    setPeriod('all');
    setSearchParams({}, { replace: true });
  };

  const applyPeriodFilter = (tx: Transaction): boolean => {
    if (period === 'all') {
      return true;
    }

    const txDate = new Date(tx.date);
    if (period === 'custom' && dateRange && dateRange[0] && dateRange[1]) {
      const start = new Date(dateRange[0]);
      const end = new Date(dateRange[1]);
      return txDate >= start && txDate <= end;
    }

    const now = new Date();
    switch (period) {
      case 'day':
        return txDate.toDateString() === now.toDateString();
      case 'week': {
        const diff = (now.getTime() - txDate.getTime()) / (1000 * 60 * 60 * 24);
        return diff <= 7;
      }
      case 'month':
        return (
          txDate.getMonth() === now.getMonth() &&
          txDate.getFullYear() === now.getFullYear()
        );
      default:
        return true;
    }
  };

  const categoryMap = useMemo(
    () => new Map(categories.map((c) => [c.id, c])),
    [categories],
  );
  const accountMap = useMemo(
    () => new Map(accounts.map((a) => [a.id, a])),
    [accounts],
  );

  const filtered = useMemo(
    () =>
      transactions.filter((tx) => {
        if (type !== 'all' && tx.type !== type) {
          return false;
        }
        if (accountId && tx.accountId !== accountId && tx.toId !== accountId) {
          return false;
        }
        if (currency && tx.currency !== currency) {
          return false;
        }
        if (!applyPeriodFilter(tx)) {
          return false;
        }
        return true;
      }),
    [transactions, type, accountId, currency, period, dateRange],
  );

  const grouped = useMemo(
    () =>
      filtered.reduce(
        (acc, tx) => {
          const dateKey = tx.date.split('T')[0];
          if (!acc[dateKey]) {
            acc[dateKey] = [];
          }
          acc[dateKey].push(tx);
          return acc;
        },
        {} as Record<string, Transaction[]>,
      ),
    [filtered],
  );

  const sortedDates = useMemo(
    () => Object.keys(grouped).sort((a, b) => b.localeCompare(a)),
    [grouped],
  );

  const handleDeleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((tx) => tx.id !== id));
  };

  if (isLoading) {
    return <p className="loading">Загрузка...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <>
      <h1 className="title">История операций</h1>

      <div className="filter-panel">
        <div className="filter-header">
          <button
            className="filter-icon-button"
            onClick={() => setFiltersVisible((prev) => !prev)}
            aria-label="Toggle filters"
          >
            <Settings2 />
          </button>

          <div className="filter-buttons">
            <button
              className={`filter-button ${type === 'all' ? 'active' : ''}`}
              onClick={() => {
                setType('all');
                updateParam('type', 'all');
              }}
            >
              Все
            </button>
            <button
              className={`filter-button ${type === 'income' ? 'active' : ''}`}
              onClick={() => {
                setType('income');
                updateParam('type', 'income');
              }}
            >
              Доходы
            </button>
            <button
              className={`filter-button ${type === 'expense' ? 'active' : ''}`}
              onClick={() => {
                setType('expense');
                updateParam('type', 'expense');
              }}
            >
              Расходы
            </button>
          </div>
        </div>

        <AnimatePresence>
          {filtersVisible && (
            <motion.div
              key="extra-filters"
              className="extra-filters"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 20,
                mass: 0.5,
              }}
            >
              <div className="filler"></div>
              <h2 className="subtitle">Фильтры</h2>
              <Dropdown
                options={periodOptions}
                value={period}
                onChange={(val) => {
                  setPeriod(val as string);
                  if (val !== 'custom') {
                    setDateRange(null);
                    updateParam('dateRange', '');
                  }
                }}
                placeholder="Период"
              />

              {period === 'custom' && (
                <DatePicker
                  type="range"
                  value={dateRange}
                  withTime={false}
                  onChange={(iso) => {
                    if (Array.isArray(iso) && iso.length === 2 && iso[0] && iso[1]) {
                      setDateRange([iso[0], iso[1]]);
                      updateParam('dateRange', iso.join(','));
                    } else {
                      setDateRange(null);
                      updateParam('dateRange', '');
                    }
                  }}
                  placeholder={['Начало', 'Конец']}
                  required
                  errorMessage="Укажите корректные даты"
                />
              )}

              <Dropdown
                options={[
                  { value: '', label: 'Все счета' },
                  ...accounts.map((a) => ({
                    value: a.id,
                    label: `${a.name} (${a.currency})`,
                  })),
                ]}
                value={accountId}
                onChange={(val) => {
                  setAccountId(val as string);
                  updateParam('accountId', val as string);
                }}
                placeholder="Счёт"
              />

              <Dropdown
                options={[
                  { value: '', label: 'Все валюты' },
                  ...[...new Set(transactions.map((tx) => tx.currency))].map(
                    (c) => ({
                      value: c,
                      label: c,
                    }),
                  ),
                ]}
                value={currency}
                onChange={(val) => {
                  setCurrency(val as string);
                  updateParam('currency', val as string);
                }}
                placeholder="Валюта"
              />

              <ActionButton
                label="Сбросить фильтры"
                onClick={resetFilters}
              />
              <div className="filler"></div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {sortedDates.length === 0 ? (
        <p className="no-operations">Операции не найдены</p>
      ) : (
        sortedDates.slice(0, visibleCount).map((date) => (
          <OperationGroup
            key={date}
            date={date}
            transactions={grouped[date].map((tx) => ({
              ...tx,
              onDelete: () => handleDeleteTransaction(tx.id),
              editPath: `/operations/edit/${tx.id}`,
            }))}
            categoryMap={categoryMap}
            accountMap={accountMap}
          />
        ))
      )}

      <div ref={loadMoreRef} className="load-more-trigger" />
    </>
  );
};