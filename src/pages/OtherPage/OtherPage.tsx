import React from 'react';
import {
  Info,
  MessageCircle,
  BookOpen,
  Send,
  Rocket,
  Github,
  Settings,
  Palette,
  Folder,
  LayoutDashboard,
} from 'lucide-react';
import { Button } from '../../components/Button/Button';
import { Header } from '../../components/Header';

export const OtherPage: React.FC = () => {
  return (
    <>
      <Header />

      <div className="option-wrapper">
        <h2 className="subtitle">Общее</h2>
        <Button label="О приложении" to="/about" icon={Info} />
        <Button label="Что нового" to="/changelog" icon={Rocket} />
        <Button label="Настройки" to="/setting" icon={Settings} />
      </div>

      <div className="option-wrapper">
        <h2 className="subtitle">Кастомизация</h2>
        <Button label="Тема оформления" to="/appearance" icon={Palette} />
        <Button label="Панель навигации" to="/navigation" icon={LayoutDashboard} />
        <Button label="Категории" to="/categories" icon={Folder} />
      </div>

      <div className="option-wrapper">
        <h2 className="subtitle">Поддержка и связь</h2>
        <Button label="Помощь" to="/help" icon={BookOpen} />
        <Button label="Обратная связь" to="/feedback" icon={MessageCircle} />
        <Button label="Предложить идею / пожелание" to="/suggest" icon={Send} />
      </div>

      <div className="option-wrapper">
        <h2 className="subtitle">Наши соцсети</h2>
        <Button label="Telegram" to="https://t.me/your_project" icon={Send} />
        <Button label="VK" to="https://vk.com/your_project" icon={Send} />
        <Button label="GitHub / Notion" to="https://github.com/your_project" icon={Github} />
      </div>
    </>
  );
};
