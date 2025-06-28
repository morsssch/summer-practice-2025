import React from 'react';
import 'chartjs-adapter-date-fns';
import './FinanceChart.scss';
interface FinanceChartProps {
    showIncome?: boolean;
    showExpenses?: boolean;
    enablePeriodSelection?: boolean;
    enableTouchDetails?: boolean;
}
declare const FinanceChart: React.FC<FinanceChartProps>;
export default FinanceChart;
