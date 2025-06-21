import React, { useState, useRef, useEffect } from 'react';
import './AddAccountPage.scss';
import { useNavigate } from 'react-router-dom';
import type { Option } from '../../components/ButtonSelector/ButtonSelector';
import { ButtonSelector } from '../../components/ButtonSelector/ButtonSelector';
import { Input } from '../../components/Input/Input';
import { Dropdown } from '../../components/Dropdown/Dropdown';
import { ActionButton } from '../../components/ActionButton/ActionButton';
import provider from '../../services/provider';
import type { AccountType } from '../../services/types';
import currencyOptions from '../../constants/currencyOptions.json';
import selectorOptions from '../../constants/accountOptions.json';

export const AddAccountPage: React.FC = () => {
  const navigate = useNavigate();
  const inputRef = useRef<{ validate: () => boolean }>(null);

  const [selectedType, setSelectedType] = useState<AccountType>('card');
  const [selectedName, setSelectedName] = useState<string>('');
  const [selectedCurrency, setSelectedCurrency] = useState<string>('RUB');

  useEffect(() => {
    const fetchDefaultCurrency = async () => {
      const currency = await provider.getDefaultCurrency();
      if (currency) {
        setSelectedCurrency(currency);
      }
    };
    fetchDefaultCurrency();
  }, []);

  const AddAccountHandler = async () => {
    const isValid = inputRef.current?.validate();
    if (isValid) {
      await provider.addAccount({
        type: selectedType,
        name: selectedName,
        currency: selectedCurrency,
      });
      navigate('/accounts');
    }
  };

  return (
    <>
      <h1 className="title">Новый счёт</h1>
      <div className="options-wrapper">
        <div className="option-wrapper">
          <h2 className="subtitle">Тип</h2>
          <ButtonSelector
            options={selectorOptions as Option[]}
            initialSelected={selectedType as string}
            onSelect={(value) => setSelectedType(value as AccountType)}
          />
        </div>

        <div className="option-wrapper">
          <h2 className="subtitle">Название</h2>
          <Input
            ref={inputRef}
            required={true}
            maxLength={32}
            value={selectedName}
            type="text"
            placeholder="Введите..."
            onChange={(value) => setSelectedName(value as string)}
          />
        </div>

        <div className="option-wrapper">
          <h2 className="subtitle">Валюта</h2>
          <Dropdown
            options={currencyOptions}
            value={selectedCurrency}
            onChange={(value) => setSelectedCurrency(value as string)}
            placeholder="Выберите..."
          />
        </div>
        <ActionButton
          label={'Добавить'}
          onClick={AddAccountHandler}
        />
      </div>
    </>
  );
};
