// src/pages/client/NotationPrestataire.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  PageHeader, Card, Button, AlertBanner, SkeletonLoader, EmptyState, RatingStars, Avatar,
} from '../../components/commons';
import { CheckCircle } from '../../components/commons';
import { getMission } from '../../services/clientService';
import { formatXAF } from '../../utils/formatters';
import { CriterionSelector } from '../../components/client/urgency/CriterionSelector';

export default function NotationPrestataire() {
  const { missionId } = useParams();
  const navigate = useNavigate();
  const [mission, setMission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [ponctualite, setPonctualite] = useState('');
  const [qualite, setQualite] = useState('');
  const [proprete, setProprete] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!missionId) return;
    getMission(missionId)
      .then((data) => setMission(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [missionId]);

  const handleSubmit = async () => {
    if (rating === 0) {
      setError('Veuillez attribuer une note');
      return;
    }
    setSubmitting(true);
    setError(null);
    // Simulation d'envoi
    await new Promise((r) => setTimeout(r, 500));
    setSubmitted(true);
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="p-6 flex flex-col gap-6">
        <SkeletonLoader variant="card" count={2} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <AlertBanner type="danger" message={error} />
      </div>
    );
  }

  if (!mission) {
    return (
      <div className="p-6">
        <EmptyState title="Mission introuvable" description="Impossible de charger les détails de la mission." />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: 'var(--color-success-light)' }}>
          <CheckCircle size={28} style={{ color: 'var(--color-success)' }} />
        </div>
        <h2 className="text-xl font-bold" style={{ color: 'var(--color-sl-800)' }}>Note envoyee !</h2>
        <p className="text-sm" style={{ color: 'var(--color-sl-500)' }}>Merci d'avoir note votre prestataire.</p>
        <Button variant="primary" onClick={() => navigate('/client/missions')}>Retour aux missions</Button>
      </div>
    );
  }

  return (
    <div className="p-6 flex flex-col gap-6 max-w-2xl mx-auto">
      <PageHeader title="Noter le prestataire" subtitle="Votre avis nous aide à améliorer la qualité du service" />

      {/* Confirmation paiement */}
      <Card>
        <div className="text-center py-4">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: 'var(--color-success-light)' }}>
              <CheckCircle size={28} style={{ color: 'var(--color-success)' }} />
            </div>
          </div>
          <h3 className="text-xl font-bold" style={{ color: 'var(--color-sl-800)' }}>Mission terminee !</h3>
          <p className="text-sm" style={{ color: 'var(--color-sl-500)' }}>Plomberie - Quartier Commercial, Bafoussam</p>
          <div className="mt-4 inline-block" style={{ background: 'var(--color-success-light)', border: '1px solid var(--color-success)', borderRadius: 'var(--radius-md)' }}>
            <div className="p-4">
              <p className="text-xs font-bold" style={{ color: 'var(--color-success)' }}>Paiement libere</p>
              <p className="text-2xl font-black" style={{ color: 'var(--color-success)' }}>{formatXAF(23000)}</p>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex flex-col items-center gap-6 py-6">
          <Avatar
            initial={mission.provider?.firstName?.[0] ?? mission.providerName?.[0] ?? 'P'}
            size="lg"
          />
          <div className="text-center">
            <h3 className="text-lg font-semibold" style={{ color: 'var(--color-sl-800)' }}>
              {mission.provider?.firstName ?? mission.providerName ?? 'Prestataire'}
            </h3>
            <p className="text-sm" style={{ color: 'var(--color-sl-500)' }}>
              {mission.service?.name ?? mission.serviceName ?? 'Service'}
            </p>
          </div>

          <div className="flex flex-col items-center gap-2">
            <p className="text-sm font-medium" style={{ color: 'var(--color-sl-600)' }}>Votre note</p>
            <RatingStars value={rating} onChange={setRating} size="xl" />
          </div>

          {/* Criteres */}
          <div className="w-full max-w-md space-y-4">
            <CriterionSelector
              label="Ponctualite"
              options={['Tres ponctuel', 'Legerement en retard', 'En retard']}
              value={ponctualite}
              onChange={setPonctualite}
            />
            <CriterionSelector
              label="Qualite du travail"
              options={['Excellent', 'Bien', 'Correct']}
              value={qualite}
              onChange={setQualite}
            />
            <CriterionSelector
              label="Proprete"
              options={['Tres propre', 'Propre', 'A ameliorer']}
              value={proprete}
              onChange={setProprete}
            />
          </div>

          <div className="w-full max-w-md">
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-sl-600)' }}>
              Commentaire (optionnel)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Partagez votre experience..."
              rows={4}
              className="w-full px-4 py-3 rounded-lg text-sm outline-none resize-none"
              style={{ border: '1px solid var(--color-sl-300)', background: 'var(--color-surface)' }}
            />
          </div>
        </div>
      </Card>

      {error && <AlertBanner type="danger" message={error} />}

      <Button variant="primary" size="lg" className="w-full" disabled={submitting || rating === 0} onClick={handleSubmit}>
        {submitting ? 'Envoi...' : 'Envoyer la note'}
      </Button>
    </div>
  );
}