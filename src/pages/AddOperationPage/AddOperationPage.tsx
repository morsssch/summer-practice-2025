import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import type { TransactionType, Account, Category } from '../../services/types';
import provider from '../../services/provider';
import { ButtonSelector } from '../../components/ButtonSelector/ButtonSelector';
import { Dropdown } from '../../components/Dropdown/Dropdown';
import { Input } from '../../components/Input/Input';
import { CategoriesWidget } from '../../components/CategoriesWidget/CategoriesWidget';
import { ActionButton } from '../../components/ActionButton/ActionButton';
import { useAlert } from '../../HOC/useAlert';
import DatePicker from '../../components/DatePicker/DatePicker';

const typeOptions = [
  { value: 'income', label: 'Доход' },
  { value: 'expense', label: 'Расход' },
  { value: 'transfer', label: 'Перевод' },
];

export const AddOperationPage: React.FC = () => {
  const navigate = useNavigate();
  const alert = useAlert();

  const [type, setType] = useState<TransactionType>('expense');
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [accountBalances, setAccountBalances] = useState<{
    [key: string]: number;
  }>({});
  const [categories, setCategories] = useState<Category[]>([]);
  const [accountId, setAccountId] = useState<string | number>('');
  const [targetAccountId, setTargetAccountId] = useState<string | number>('');
  const [amount, setAmount] = useState<number | null>(null);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [comment, setComment] = useState('');
  const [date, setDate] = useState<string>(new Date().toISOString());

  useEffect(() => {
    const loadData = async () => {
      const allAccounts = await provider.getAccounts();
      const allCategories = await provider.getCategories();
      const transactions = await provider.getTransactions();

      const balances: { [key: string]: number } = {};
      for (const account of allAccounts) {
        balances[account.id] = await provider.getAccountBalance(
          account.id,
          transactions,
        );
      }

      setAccounts(allAccounts);
      setAccountBalances(balances);
      setCategories(allCategories);
    };
    loadData();
  }, []);

  const handleSave = async () => {
    if (!accountId || !amount || amount <= 0) {
      alert('Укажи счёт и сумму');
      return;
    }

    const transactions = await provider.getTransactions();
    const selectedAccount = accounts.find((a) => a.id === accountId);

    if (!selectedAccount) {
      alert('Счёт не найден');
      return;
    }

    if (type === 'transfer') {
      if (!targetAccountId || accountId === targetAccountId) {
        alert('Укажи другой счёт для перевода');
        return;
      }

      const to = accounts.find((a) => a.id === targetAccountId);

      if (!to) {
        alert('Счёт получатель не найден');
        return;
      }
      if (selectedAccount.currency !== to.currency) {
        alert('Счета должны быть в одной валюте');
        return;
      }

      const fromBalance = await provider.getAccountBalance(
        accountId as string,
        transactions,
      );

      if (fromBalance < amount) {
        alert('Недостаточно средств на выбранном счёте');
        return;
      }

      await provider.addTransfer({
        fromId: accountId as string,
        toId: targetAccountId as string,
        amount,
        comment,
        date: date || new Date().toISOString(), 
      });
    } else {
      if (!date) {
        alert('Укажи дату');
        return;
      }

      await provider.addTransaction({
        type,
        accountId: accountId as string,
        accountName: selectedAccount.name,
        amount,
        categoryId: categoryId || '',
        categoryName: categories.find((c) => c.id === categoryId)?.name || '',
        comment,
        date, // Используем дату из DatePicker
        currency: selectedAccount.currency,
      });
    }

    navigate('/operations');
  };

  return (
    <>
      <h1 className="title">Добавление операции</h1>

      <div className="option-wrapper">
        <h2 className="subtitle">Тип операции</h2>
        <ButtonSelector
          options={typeOptions}
          initialSelected={type}
          onSelect={(val) => {
            setType(val as TransactionType);
            setCategoryId(null);
          }}
        />
      </div>

      <div className="option-wrapper">
        <h2 className="subtitle">Счёт</h2>
        <Dropdown
          options={accounts.map((a) => ({
            value: a.id,
            label: `${a.name} (${accountBalances[a.id] || 0} ${a.currency})`,
          }))}
          value={accountId}
          onChange={setAccountId}
          placeholder="Выберите счёт"
          required
        />
      </div>

      {type === 'transfer' && (
        <div className="option-wrapper">
          <h2 className="subtitle">Счёт получатель</h2>
          <Dropdown
            options={accounts
              .filter((a) => a.id !== accountId)
              .map((a) => ({
                value: a.id,
                label: `${a.name} (${accountBalances[a.id] || 0} ${a.currency})`,
              }))}
            value={targetAccountId}
            onChange={setTargetAccountId}
            placeholder="Выберите другой счёт"
            required
          />
        </div>
      )}

      <div className="option-wrapper">
        <h2 className="subtitle">Сумма</h2>
        <Input
          value={amount?.toString() ?? ''}
          type="number"
          placeholder="Введите сумму"
          required={true}
          onChange={(val) => setAmount(Number(val))}
        />
      </div>

      {type !== 'transfer' && (
        <div className="option-wrapper">
          <h2 className="subtitle">Категория</h2>
          <CategoriesWidget
            mode="select"
            type={type}
            categories={categories}
            selectedCategoryId={categoryId ?? ''}
            onSelect={setCategoryId}
          />
        </div>
      )}

      <div className="option-wrapper">
        <h2 className="subtitle">Комментарий</h2>
        <Input
          type="textarea"
          value={comment.toString()}
          onChange={(val) => setComment(String(val))}
          rows={4}
          maxLength={200}
        />
      </div>

      <div className="option-wrapper">
        <h2 className="subtitle">Дата и время</h2>
        <DatePicker
          type="single"
          value={date}
          withTime={true}
          onChange={(iso) => setDate(iso as string)}
          placeholder="дд:мм:гггг"
          required={true}
          errorMessage="Укажите корректную дату"
        />
      </div>

      <div className="option-wrapper">
        <ActionButton
          label="Добавить"
          onClick={handleSave}
        />
      </div>
    </>
  );
};

export default AddOperationPage;
