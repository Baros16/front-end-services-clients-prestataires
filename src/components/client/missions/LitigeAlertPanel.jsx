// src/components/client/missions/LitigeAlertPanel.jsx
import { useNavigate } from 'react-router-dom';
import { AlertTriangle } from '../../commons/Icons';

export function LitigeAlertPanel({ missionId }) {
  const navigate = useNavigate();

  return (
    <div className="bg-accent-light rounded-[var(--radius-lg)] p-4 flex flex-col gap-3">
      <button
        className="flex items-center gap-2 text-[13px] font-[family-name:var(--font-body)] font-semibold text-warning bg-transparent border-none cursor-pointer p-0 active:scale-95 transition-transform"
        onClick={() => navigate(`/client/litige/${missionId}`)}
      >
        <AlertTriangle size={14} />
        Signaler un problème
      </button>
    </div>
  );
}