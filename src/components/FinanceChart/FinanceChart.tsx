import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns';
import {
  format,
  parseISO,
  startOfDay,
  startOfWeek,
  startOfMonth,
  subDays,
  subWeeks,
  subMonths,
  eachDayOfInterval,
  eachWeekOfInterval,
  eachMonthOfInterval,
} from 'date-fns';
import { ru } from 'date-fns/locale';
import provider from '../../services/provider';
import type { Transaction } from '../../services/types';
import './FinanceChart.scss';

interface FinanceChartProps {
  showIncome?: boolean;
  showExpenses?: boolean;
  enablePeriodSelection?: boolean;
  enableTouchDetails?: boolean;
}

interface GroupedData {
  date: string;
  income: number;
  expense: number;
}

interface TouchDetails {
  x: number;
  date: string;
  income: number;
  expense: number;
}

const FinanceChart: React.FC<FinanceChartProps> = ({
  showIncome = true,
  showExpenses = true,
  enablePeriodSelection = true,
  enableTouchDetails = true,
}) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('day');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [touchDetails, setTouchDetails] = useState<TouchDetails | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isTouching, setIsTouching] = useState(false);
  const holdTimeoutRef = useRef<number | null>(null);
  const [isHeld, setIsHeld] = useState(false);
  const [isScrollingBlocked, setIsScrollingBlocked] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await provider.getTransactions();
        setTransactions(data);
      } catch (error: any) {
        console.error('Ошибка при загрузке транзакций:', error);
      }
    };
    fetchTransactions();
  }, []);

  const groupTransactions = (
    transactions: Transaction[],
    period: string,
  ): GroupedData[] => {
    const grouped: { [key: string]: { income: number; expense: number } } = {};
    transactions.forEach((tx) => {
      const date = parseISO(tx.date);
      let key: string;
      if (period === 'day') {
        key = format(startOfDay(date), 'yyyy-MM-dd');
      } else if (period === 'week') {
        key = format(startOfWeek(date, { weekStartsOn: 1 }), 'yyyy-MM-dd');
      } else {
        key = format(startOfMonth(date), 'yyyy-MM');
      }
      if (!grouped[key]) {
        grouped[key] = { income: 0, expense: 0 };
      }
      if (tx.type === 'income') {
        grouped[key].income += tx.amount;
      } else if (tx.type === 'expense') {
        grouped[key].expense += tx.amount;
      }
    });
    return Object.entries(grouped)
      .map(([date, values]) => ({ date, ...values }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  useEffect(() => {
    if (!chartRef.current || !transactions.length) {
      return;
    }

    const data = groupTransactions(transactions, period);
    const datasets: any[] = [];
    if (showExpenses) {
      datasets.push({
        label: 'Расходы',
        data: data.map((d) => ({ x: d.date, y: d.expense })),
        borderColor: 'black',
        fill: false,
        tension: 0.1,
      });
    }

    if (showIncome) {
      datasets.push({
        label: 'Доход',
        data: data.map((d) => ({ x: d.date, y: d.income })),
        borderColor: '#1bb257',
        fill: false,
        tension: 0.1,
      });
    }

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
      chartInstanceRef.current = null;
    }

    const endDate = new Date();
    const startDate =
      period === 'day'
        ? subDays(endDate, 90)
        : period === 'week'
          ? subWeeks(endDate, 90)
          : subMonths(endDate, 90);
    const dates =
      period === 'day'
        ? eachDayOfInterval({ start: startDate, end: endDate })
        : period === 'week'
          ? eachWeekOfInterval(
              { start: startDate, end: endDate },
              { weekStartsOn: 1 },
            )
          : eachMonthOfInterval({ start: startDate, end: endDate });
    const dateStrings = dates.map((date) =>
      period === 'day'
        ? format(date, 'yyyy-MM-dd')
        : period === 'week'
          ? format(startOfWeek(date, { weekStartsOn: 1 }), 'yyyy-MM-dd')
          : format(startOfMonth(date), 'yyyy-MM'),
    );

    chartInstanceRef.current = new Chart(chartRef.current, {
      type: 'line',
      data: { datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            type: 'time',
            time: {
              unit:
                period === 'day' ? 'day' : period === 'week' ? 'week' : 'month',
              tooltipFormat:
                period === 'day'
                  ? 'd MMMM yyyy'
                  : period === 'week'
                    ? 'd MMMM yyyy'
                    : 'MMMM yyyy',
              displayFormats: {
                day: 'd MMM',
                week: 'd MMM',
                month: 'MMM yyyy',
              },
            },
            grid: {
              drawOnChartArea: false,
            },
            adapters: {
              date: {
                locale: ru,
              },
            },
            ticks: {
              maxRotation: 0,
              autoSkip: true,
              maxTicksLimit: 10,
              font: {
                family: 'Inter',
                size: 12,
                style: 'normal',
                lineHeight: 1.2,
              },
            },
          },
          y: {
            beginAtZero: true,
            position: 'right',
            ticks: {
              font: {
                family: 'Inter',
                size: 12,
                style: 'normal',
                lineHeight: 1.2,
              },
            },
          },
        },
        plugins: {
          tooltip: { enabled: false },
          legend: { display: false },
        },
        interaction: { mode: 'nearest', axis: 'x', intersect: false },
      },
    });

    const wrapper = document.querySelector('.finance-chart-wrapper');
    if (wrapper) {
      wrapper.scrollLeft = wrapper.scrollWidth;
    }

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [transactions, period, showIncome, showExpenses]);

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!enableTouchDetails || !chartInstanceRef.current || !chartRef.current) {
      return;
    }
    touchStartX.current = e.targetTouches[0]?.clientX || 0;
    touchStartY.current = e.targetTouches[0]?.clientY || 0;
    setIsTouching(true);
    const rect = chartRef.current.getBoundingClientRect();
    const x = e.targetTouches[0]?.clientX - rect.left || 0;
    const chartArea = chartInstanceRef.current.chartArea;
    if (x < chartArea.left || x > chartArea.right) {
      return;
    }

    holdTimeoutRef.current = window.setTimeout(() => {
      const data = groupTransactions(transactions, period);
      const index = Math.round(
        ((x - chartArea.left) / (chartArea.right - chartArea.left)) *
          (data.length - 1),
      );
      if (index >= 0 && index < data.length) {
        setTouchDetails({
          x,
          date: data[index].date,
          income: data[index].income,
          expense: data[index].expense,
        });
        setIsHeld(true);
        setIsScrollingBlocked(true);
      }
    }, 500); // 500 мс задержки для удержания
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const currentX = e.targetTouches[0]?.clientX || 0;
    const currentY = e.targetTouches[0]?.clientY || 0;

    const dx = Math.abs(currentX - touchStartX.current);
    const dy = Math.abs(currentY - touchStartY.current);

    if (holdTimeoutRef.current && (dx > 10 || dy > 10)) {
      clearTimeout(holdTimeoutRef.current);
      holdTimeoutRef.current = null;
    }

    if (
      !enableTouchDetails ||
      !isTouching ||
      !chartInstanceRef.current ||
      !chartRef.current ||
      !isHeld
    ) {
      return;
    }

    e.preventDefault();

    const rect = chartRef.current.getBoundingClientRect();
    const x = e.targetTouches[0]?.clientX - rect.left || 0;
    const chartArea = chartInstanceRef.current.chartArea;
    if (x < chartArea.left || x > chartArea.right) {
      return;
    }

    const data = groupTransactions(transactions, period);
    const index = Math.round(
      ((x - chartArea.left) / (chartArea.right - chartArea.left)) *
        (data.length - 1),
    );
    if (index >= 0 && index < data.length) {
      setTouchDetails({
        x,
        date: data[index].date,
        income: data[index].income,
        expense: data[index].expense,
      });
    }

    setIsScrollingBlocked(true);
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!enableTouchDetails || !isTouching) {
      return;
    }
    setIsTouching(false);
    setIsHeld(false);
    setIsScrollingBlocked(false);
    if (holdTimeoutRef.current) {
      clearTimeout(holdTimeoutRef.current);
      holdTimeoutRef.current = null;
    }
    setTouchDetails(null);
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handlePeriodSelect = (newPeriod: 'day' | 'week' | 'month') => {
    setPeriod(newPeriod);
    setIsMenuOpen(false);
  };

  return (
    <div className="option-wrapper">
      <div className="title-wrapper">
        <h2 className="subtitle">Статистика по операциям</h2>
        {enablePeriodSelection && (
          <div className="period-selector">
            <button
              onClick={toggleMenu}
              className="menu-button"
            >
              ⋮
            </button>
            {isMenuOpen && (
              <ul className="period-menu">
                <li>
                  <button onClick={() => handlePeriodSelect('day')}>
                    День
                  </button>
                </li>
                <li>
                  <button onClick={() => handlePeriodSelect('week')}>
                    Неделя
                  </button>
                </li>
                <li>
                  <button onClick={() => handlePeriodSelect('month')}>
                    Месяц
                  </button>
                </li>
              </ul>
            )}
          </div>
        )}
      </div>
      <div
        className={`finance-chart-wrapper ${isScrollingBlocked ? 'no-scroll' : ''}`}
      >
        <div
          ref={containerRef}
          className="finance-chart-container"
        >
          <canvas
            ref={chartRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="finance-chart-canvas"
          />
          {touchDetails && enableTouchDetails && containerRef.current && (
            <div className="touch-details-container">
              <div
                className="touch-details-line"
                style={{ left: `${touchDetails.x + 20}px` }}
              />
              <div
                className="touch-details-box"
                style={{
                  left:
                    touchDetails.x + 150 < containerRef.current.offsetWidth
                      ? `${touchDetails.x + 30}px`
                      : `${touchDetails.x - 150}px`,
                }}
              >
                <p className='touch-details-title'>
                  {format(parseISO(touchDetails.date), 'd MMMM yyyy', {
                    locale: ru,
                  })}
                </p>
                {showIncome && <p>Доход - {touchDetails.income}</p>}
                {showExpenses && (
                  <p>Траты - {touchDetails.expense}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinanceChart;
