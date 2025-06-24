import React from 'react';
import './FabMenu.scss';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router';

export const FabMenu: React.FC = () => {
  const navigate = useNavigate()

  return (
    <>
      <div className="fab-container">
        <button
          className="fab-button"
          onClick={() => navigate('/operations/new')}
        >
          <Plus />
        </button>
      </div>
    </>
  );
};
