
// src/components/client/mission/LitigeAlertPanel.jsx
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/commons';
import { AlertTriangle } from '@/components/commons/Icons';

export function LitigeAlertPanel({ missionId }) {
  const navigate = useNavigate();

  return (
    <div
      className="rounded-[var(--radius-lg)] p-4 flex flex-col gap-3"
      style={{ backgroundColor: 'var(--color-danger-light)' }}
    >
      <button
        className="flex items-center gap-2 text-sm font-body active:scale-95 transition-transform"
        style={{ color: 'var(--color-danger)' }}
        onClick={() => navigate(`/client/litige?missionId=${missionId}`)}
      >
        <AlertTriangle size={16} />
        Signaler un problème
      </button>

      <Button
        variant="danger"
        size="md"
        onClick={() => navigate(`/client/litige?missionId=${missionId}`)}
        className="active:scale-95"
      >
        Ouvrir un litige
      </Button>
    </div>
  );
}