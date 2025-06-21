import React, { useState, useEffect } from 'react';
import './AccountsPage.scss';
import { Info, Plus } from 'lucide-react';
import provider from '../../services/provider';
import type { Account, Transaction } from '../../services/types';
import { AccountWidget } from '../../components/AccountWidget/AccountWidget';
import { ActionButton } from '../../components/ActionButton/ActionButton';

export const AccountsPage: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [, setTransactions] = useState<Transaction[]>([]);
  const [balances, setBalances] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [accountsData, transactionsData] = await Promise.all([
          provider.getAccounts(),
          provider.getTransactions(),
        ]);
        setAccounts(accountsData);
        setTransactions(transactionsData);

        const balancesData: Record<string, number> = {};
        await Promise.all(
          accountsData.map(async (account) => {
            balancesData[account.id] = await provider.getAccountBalance(
              account.id,
              transactionsData,
            );
          }),
        );
        setBalances(balancesData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <div className="loading">Загрузка данных...</div>;
  }
  if (error) {
    return <div className="error">Ошибка: {error}</div>;
  }

  return (
    <>
      <h1 className="title">Счета</h1>
      <div className="accounts-wrapper">
        <ActionButton
          label="Добавить счёт"
          icon={Plus}
          to="/accounts/new"
        />
        <div className="accounts-hint">
          <Info size={24} className='accounts-hint-icon'/>
          Проведите влево по счёту чтобы его настроить
        </div>

        {accounts.map((account) => (
          <AccountWidget
            id={account.id}
            key={account.id}
            name={account.name}
            balance={balances[account.id] ?? 0}
            currency={account.currency || 'RUB'}
          />
        ))}
      </div>
    </>
  );
};
