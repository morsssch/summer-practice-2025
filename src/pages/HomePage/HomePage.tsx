import React from 'react';
import { useLocalStorage } from '../../HOC/useLocalStorage';

export const HomePage: React.FC = () => {
  const [data, setData] = useLocalStorage('button', 0);

  return (
    <div>
      <h2>Страница</h2>
      <button onClick={() => setData((prev) => ++prev)}>{data}</button>
    </div>
  );
};

export default HomePage;
