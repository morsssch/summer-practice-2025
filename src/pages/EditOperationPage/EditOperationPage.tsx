import React, { useEffect, useState } from 'react';
import './EditOperationPage.scss';
import { useParams, useNavigate } from 'react-router';
import type {
  Account,
  Category,
  Transaction,
  TransactionType,
} from '../../services/types';
import provider from '../../services/provider';
import { ButtonSelector } from '../../components/ButtonSelector/ButtonSelector';
import { Dropdown } from '../../components/Dropdown/Dropdown';
import { Input } from '../../components/Input/Input';
import { CategoriesWidget } from '../../components/CategoriesWidget/CategoriesWidget';
import { ActionButton } from '../../components/ActionButton/ActionButton';
import { useAlert } from '../../HOC/useAlert';
import DatePicker from '../../components/DatePicker/DatePicker';
import { useConfirmDeletion } from '../../HOC/useConfirmDeletion';

export const EditOperationPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const alert = useAlert();
  const confirmDeletion = useConfirmDeletion();

  const [isEditing, setIsEditing] = useState(false);
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [type, setType] = useState<TransactionType>('expense');
  const [accountId, setAccountId] = useState('');
  const [targetAccountId, setTargetAccountId] = useState('');
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [date, setDate] = useState<string>('');

  useEffect(() => {
    const load = async () => {
      const [allAccounts, allCategories, allTransactions] = await Promise.all([
        provider.getAccounts(),
        provider.getCategories(),
        provider.getTransactions(),
      ]);
      const tx = allTransactions.find((t) => t.id === id);
      if (!tx) {
        alert('Операция не найдена');
        navigate('/operations');
        return;
      }

      setAccounts(allAccounts);
      setCategories(allCategories);
      setTransaction(tx);

      setType(tx.type);
      setAccountId(tx.accountId);
      setCategoryId(tx.categoryId);
      setTargetAccountId(tx.toId || '');
      setAmount(tx.amount);
      setComment(tx.comment ?? '');
      setDate(tx.date);
    };

    load();
  }, [id]);

  const handleSave = async () => {
    if (!transaction) {
      return;
    }
    const account = accounts.find((a) => a.id === accountId);
    if (!account) {
      alert('Счёт не найден');
      return;
    }

    if (amount <= 0) {
      alert('Сумма должна быть положительной');
      return;
    }

    if (!date) {
      alert('Дата не указана');
      return;
    }

    if (type === 'transfer') {
      const to = accounts.find((a) => a.id === targetAccountId);

      if (!to) {
        alert('Счёт получатель не найден');
        return;
      }

      if (account.id === to.id) {
        alert('Счёт и получатель совпадают');
        return;
      }

      if (account.currency !== to.currency) {
        alert('Валюта счетов должна совпадать');
        return;
      }

      await provider.updateTransaction(transaction.id, {
        type: 'transfer',
        accountId: account.id,
        accountName: account.name,
        toId: to.id,
        categoryId: '',
        categoryName: '',
        amount,
        comment,
        date,
        currency: account.currency,
      });
    } else {
      await provider.updateTransaction(transaction.id, {
        type,
        accountId: account.id,
        accountName: account.name,
        toId: '',
        categoryId: categoryId ?? '',
        categoryName: categories.find((c) => c.id === categoryId)?.name || '',
        amount,
        comment,
        date,
        currency: account.currency,
      });
    }

    setIsEditing(false);
    navigate('/operations')
  };

  const handleDelete = async () => {
    if (!transaction) {
      return;
    }
    confirmDeletion(`данную операцию`, async () => {
      await provider.deleteTransaction(transaction.id);
      navigate('/operations');
    });
  };

  if (!transaction) {
    return <div className="loading">Загрузка...</div>;
  }

  return (
    <>
      <h1 className="title">Операция</h1>
      <div className="option-wrapper">
        <h2 className="subtitle">Тип</h2>
        <ButtonSelector
          options={[
            { value: 'income', label: 'Доход' },
            { value: 'expense', label: 'Расход' },
            { value: 'transfer', label: 'Перевод' },
          ]}
          initialSelected={type}
          onSelect={(val) => {
            setType(val as TransactionType);
            setCategoryId(null);
          }}
          disabled={!isEditing}
        />
      </div>
      <div className="option-wrapper">
        <h2 className="subtitle">Счёт</h2>
        <Dropdown
          options={accounts.map((a) => ({
            value: a.id,
            label: `${a.name} (${a.currency})`,
          }))}
          value={accountId}
          onChange={(v) => setAccountId(v as string)}
          placeholder="Выберите счёт"
          required
          disabled={!isEditing}
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
                label: `${a.name} (${a.currency})`,
              }))}
            value={targetAccountId}
            onChange={(v) => setTargetAccountId(v as string)}
            placeholder="Выберите получателя"
            required
            disabled={!isEditing}
          />
        </div>
      )}
      <div className="option-wrapper">
        <h2 className="subtitle">Сумма</h2>
        <Input
          value={amount.toString()}
          type="number"
          placeholder="Введите сумму"
          required
          onChange={(val) => setAmount(Number(val))}
          disabled={!isEditing}
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
            disabled={!isEditing}
          />
        </div>
      )}
      <div className="option-wrapper">
        <h2 className="subtitle">Комментарий</h2>
        <Input
          type="textarea"
          value={comment}
          onChange={(val) => setComment(String(val))}
          rows={4}
          maxLength={200}
          disabled={!isEditing}
        />
      </div>
      <div className="option-wrapper">
        <h2 className="subtitle">Дата</h2>
        <DatePicker
          type="single"
          value={date}
          withTime={true}
          onChange={(iso) => setDate(iso as string)}
          placeholder="дд:мм:гггг"
          required
          errorMessage="Укажите корректную дату"
          disabled={!isEditing}
        />
      </div>
      <div className='option-wrapper'>
        {isEditing ? (
          <ActionButton
            label="Сохранить"
            onClick={handleSave}
          />
        ) : (
          <ActionButton
            label="Редактировать"
            onClick={() => setIsEditing(true)}
          />
        )}
        <ActionButton
          label="Удалить"
          onClick={handleDelete}
          danger
        />
      </div>
    </>
  );
};

export default EditOperationPage;
