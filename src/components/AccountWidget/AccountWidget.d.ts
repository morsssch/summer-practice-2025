import React from 'react';
import './AccountWidget.scss';
interface AccountWidgetProps {
    id: string;
    name: string;
    balance: number;
    currency: string;
}
export declare const AccountWidget: React.FC<AccountWidgetProps>;
export {};
