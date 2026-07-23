// src/pages/client/LitigeClient.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  PageHeader, Card, Button, AlertBanner, SkeletonLoader, EmptyState, Input, PhotoUploader, AmountDisplay,
} from '../../components/commons';
import { Scale, AlertTriangle } from '../../components/commons';
import { getLitigeMotifs } from '../../services/sharedService';

export default function LitigeClient() {
  const { missionId } = useParams();
  const navigate = useNavigate();
  const [motifs, setMotifs] = useState([]);
  const [selectedMotif, setSelectedMotif] = useState('');
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    getLitigeMotifs()
      .then((data) => setMotifs(data?.data ?? data ?? []))
      .catch(() => setMotifs([]))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async () => {
    if (!selectedMotif) { setError('Veuillez sélectionner un motif'); return; }
    if (!description.trim()) { setError('Veuillez décrire le problème'); return; }
    setSubmitting(true);
    setError(null);
    await new Promise((r) => setTimeout(r, 800));
    setSubmitted(true);
    setSubmitting(false);
  };

  if (loading) return <div className="p-6"><SkeletonLoader variant="card" count={2} /></div>;

  if (submitted) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: 'var(--color-warning-light)' }}>
          <AlertTriangle size={28} style={{ color: 'var(--color-warning)' }} />
        </div>
        <h2 className="text-xl font-bold" style={{ color: 'var(--color-sl-800)' }}>Litige signalé</h2>
        <p className="text-sm text-center" style={{ color: 'var(--color-sl-500)' }}>
          Votre litige a été enregistré. Le service client vous contactera sous 24h.
        </p>
        <Button variant="primary" onClick={() => navigate('/client/missions')}>Retour aux missions</Button>
      </div>
    );
  }

  return (
    <div className="p-6 flex flex-col gap-6 max-w-2xl mx-auto">
      <PageHeader title="Signaler un litige" subtitle="En cas de problème avec votre prestation" />

      <Card title="Motif du litige">
        <div className="flex flex-col gap-3">
          {motifs.length === 0 ? (
            <p className="text-sm" style={{ color: 'var(--color-sl-500)' }}>Chargement des motifs...</p>
          ) : (
            motifs.map((motif) => (
              <button
                key={motif.id}
                onClick={() => { setSelectedMotif(motif.id); setError(null); }}
                className="w-full text-left p-4 rounded-lg transition-all"
                style={{
                  border: `2px solid ${selectedMotif === motif.id ? 'var(--color-brand)' : 'var(--color-sl-200)'}`,
                  background: selectedMotif === motif.id ? 'var(--color-brand-xlight)' : 'var(--color-surface)',
                }}
              >
                <span className="text-sm font-semibold" style={{ color: 'var(--color-sl-800)' }}>{motif.title}</span>
                {motif.description && (
                  <p className="text-xs mt-1" style={{ color: 'var(--color-sl-500)' }}>{motif.description}</p>
                )}
              </button>
            ))
          )}
        </div>
      </Card>

      <Card title="Description">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Décrivez le problème rencontré en détail..."
          rows={5}
          className="w-full px-4 py-3 rounded-lg text-sm outline-none resize-none"
          style={{ border: '1px solid var(--color-sl-300)', background: 'var(--color-surface)' }}
        />
      </Card>

      <Card title="Photos / Preuves (optionnel)">
        <PhotoUploader
          maxPhotos={5}
          photos={photos}
          onAdd={(p) => setPhotos((prev) => [...prev, p])}
          onRemove={(idx) => setPhotos((prev) => prev.filter((_, i) => i !== idx))}
        />
      </Card>

      {/* Montant concerne */}
      <Card>
        <h3 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--color-sl-400)' }}>Montant concerne</h3>
        <p className="text-3xl font-black" style={{ color: 'var(--color-sl-900)' }}>23 000 XAF</p>
      </Card>

      {error && <AlertBanner type="danger" message={error} />}

      <Button variant="danger" size="lg" className="w-full" disabled={submitting} onClick={handleSubmit}>
        {submitting ? 'Envoi...' : 'Signaler le litige'}
      </Button>
    </div>
  );
}