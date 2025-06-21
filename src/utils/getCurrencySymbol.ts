import currencies from './../constants/currencyOptions.json'

type CurrencySymbolMap = {
  [key: string]: string;
};

const createSymbolMap = (): CurrencySymbolMap => {
  const symbolMap: CurrencySymbolMap = {};

  currencies.forEach((currency) => {
    const symbolMatch = currency.label.match(/^[^a-zA-Zа-яА-Я\s]+/);
    if (symbolMatch) {
      symbolMap[currency.value] = symbolMatch[0];
    }
  });

  return symbolMap;
};

const currencySymbolMap = createSymbolMap();

export const getCurrencySymbol = (currencyCode: string): string => {
  return currencySymbolMap[currencyCode] || currencyCode; 
};
