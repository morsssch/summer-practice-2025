import React from 'react';
import { useLocalStorage } from '../../HOC/useLocalStorage';
import Header from '../../components/Header/Header';
import { BalanceWidget } from '../../widgets/BalanceWidget/BalanceWidget';

export const HomePage: React.FC = () => {
  const [data, setData] = useLocalStorage('button', 0);

  return (
    <>
      <Header name={'Мария'} />
      <BalanceWidget balance={12345} />
    </>
  );
};

export default HomePage;

{
  /* <div>
  <button onClick={() => setData((prev) => ++prev)}>{data}</button>
</div> */
}
