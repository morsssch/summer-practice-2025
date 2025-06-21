import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import './EditAccountPage.scss';
import { Input } from '../../components/Input/Input';
import { Dropdown } from '../../components/Dropdown/Dropdown';
import { ButtonSelector } from '../../components/ButtonSelector/ButtonSelector';
import { ActionButton } from '../../components/ActionButton/ActionButton';
import provider from '../../services/provider';
import type { Account, AccountType } from '../../services/types';
import type { Option } from '../../components/ButtonSelector/ButtonSelector';
import currencyOptions from '../../constants/currencyOptions.json';
import selectorOptions from '../../constants/accountOptions.json';
import { useConfirmDeletion } from '../../HOC/useConfirmDeletion';

export const EditAccountPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const inputRef = useRef<{ validate: () => boolean }>(null);
  const confirmDeletion = useConfirmDeletion();

  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState('');
  const [type, setType] = useState<AccountType>('other');
  const [currency, setCurrency] = useState('RUB');

  useEffect(() => {
    const fetchAccount = async () => {
      const accounts = await provider.getAccounts();
      const found = accounts.find((a) => a.id === id);
      if (!found) {
        navigate('/accounts');
        return;
      }
      const defaultCurrency = await provider.getDefaultCurrency(); 
      setAccount(found);
      setName(found.name);
      setType(found.type);
      setCurrency(found.currency || defaultCurrency || 'RUB');
      setLoading(false);
    };
    fetchAccount();
  }, [id, navigate]);

  const handleSaveClick = () => {
    const isValid = inputRef.current?.validate();
    if (isValid) {
      handleSave();
    }
  };

  const handleSave = async () => {
    if (!account) {
      return;
    }
    await provider.updateAccount({ ...account, name, type, currency });
    navigate('/accounts');
  };

  const handleDelete = () => {
    if (!account) {
      return;
    }

    confirmDeletion(`счёт «${account.name}»`, async () => {
      await provider.deleteAccount(account.id);
      navigate('/accounts');
    });
  };

  if (loading) {
    return <div>Загрузка...</div>;
  }

  return (
    <>
      <h1 className="title">Редактировать счёт</h1>
      <div className="options-wrapper">
        <div className="option-wrapper">
          <h2 className="subtitle">Тип</h2>
          <ButtonSelector
            options={selectorOptions as Option[]}
            initialSelected={type as string}
            onSelect={(value) => setType(value as AccountType)}
          />
        </div>

        <div className="option-wrapper">
          <h2 className="subtitle">Название</h2>
          <Input
            ref={inputRef}
            required
            maxLength={32}
            value={name}
            type="text"
            placeholder="Введите..."
            onChange={(value) => setName(value as string)}
          />
        </div>

        <div className="option-wrapper">
          <h2 className="subtitle">Валюта</h2>
          <Dropdown
            options={currencyOptions}
            value={currency}
            onChange={(value) => setCurrency(value as string)}
            placeholder="Выберите..."
          />
        </div>

        <div className="option-wrapper">
          <ActionButton label="Сохранить" onClick={handleSaveClick} />
          <ActionButton label="Удалить" onClick={handleDelete} danger={true} />
        </div>
      </div>
    </>
  );
};