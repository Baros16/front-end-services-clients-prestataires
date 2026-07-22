// src/pages/provider/NoterClient.jsx
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  PageHeader, Card, Button, AlertBanner, RatingStars, Avatar,
} from '../../components/commons';

export default function NoterClient() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (rating === 0) { setError('Veuillez attribuer une note'); return; }
    setSubmitting(true);
    setError(null);
    await new Promise(r => setTimeout(r, 500));
    setSubmitted(true);
    setSubmitting(false);
  };

  if (submitted) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: 'var(--color-success-light)' }}>
          <span style={{ color: 'var(--color-success)', fontSize: 28 }}>✓</span>
        </div>
        <h2 className="text-xl font-bold" style={{ color: 'var(--color-sl-800)' }}>Note envoyée !</h2>
        <Button variant="primary" onClick={() => navigate('/provider/missions')}>Retour aux missions</Button>
      </div>
    );
  }

  return (
    <div className="p-6 flex flex-col gap-6 max-w-2xl mx-auto">
      <PageHeader title="Noter le client" subtitle="Donnez votre avis sur le client" />

      <Card>
        <div className="flex flex-col items-center gap-6 py-6">
          <Avatar initial="C" size="lg" />
          <div className="flex flex-col items-center gap-2">
            <p className="text-sm font-medium" style={{ color: 'var(--color-sl-600)' }}>Votre note</p>
            <RatingStars value={rating} onChange={setRating} size="xl" />
          </div>
          <div className="w-full max-w-md">
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-sl-600)' }}>
              Commentaire (optionnel)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Partagez votre expérience..."
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