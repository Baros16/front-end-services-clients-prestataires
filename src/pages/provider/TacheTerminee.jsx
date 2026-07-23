// src/pages/provider/TacheTerminee.jsx
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  PageHeader, Card, Button, AlertBanner, SkeletonLoader, EmptyState, PhotoUploader,
} from '../../components/commons';
import { CheckCircle, ArrowLeft } from '../../components/commons';

export default function TacheTerminee() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [photos, setPhotos] = useState([]);
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!confirmed) { setError('Veuillez confirmer que la tâche est terminée'); return; }
    setSubmitting(true);
    setError(null);
    await new Promise(r => setTimeout(r, 800));
    setSubmitted(true);
    setSubmitting(false);
  };

  if (submitted) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: 'var(--color-success-light)' }}>
          <CheckCircle size={32} style={{ color: 'var(--color-success)' }} />
        </div>
        <h2 className="text-xl font-bold" style={{ color: 'var(--color-sl-800)' }}>Tâche terminée !</h2>
        <p className="text-sm text-center" style={{ color: 'var(--color-sl-500)' }}>
          La mission a été marquée comme terminée. Le client sera notifié.
        </p>
        <Button variant="primary" onClick={() => navigate('/provider/missions')}>Retour aux missions</Button>
      </div>
    );
  }

  return (
    <div className="p-6 flex flex-col gap-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/provider/missions')} className="p-2 rounded-lg hover:bg-sl-100">
          <ArrowLeft size={20} />
        </button>
        <PageHeader title="Terminer la mission" subtitle="Confirmez que la prestation est achevée" />
      </div>

      <Card title="Photos avant / après (optionnel)">
        <PhotoUploader
          maxPhotos={6}
          photos={photos}
          onAdd={(p) => setPhotos(prev => [...prev, p])}
          onRemove={(idx) => setPhotos(prev => prev.filter((_, i) => i !== idx))}
        />
      </Card>

      <Card>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => { setConfirmed(e.target.checked); setError(null); }}
            className="w-5 h-5 rounded"
            style={{ accentColor: 'var(--color-brand)' }}
          />
          <span className="text-sm" style={{ color: 'var(--color-sl-700)' }}>
            Je confirme que la prestation est entièrement terminée et conforme au devis
          </span>
        </label>
      </Card>

      {error && <AlertBanner type="danger" message={error} />}

      <Button variant="primary" size="lg" className="w-full" disabled={submitting || !confirmed} onClick={handleSubmit}>
        {submitting ? 'Enregistrement...' : 'Marquer comme terminée'}
      </Button>
    </div>
  );
}