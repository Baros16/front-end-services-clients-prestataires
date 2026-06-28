import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  PageHeader, Card, AmountDisplay, PhotoUploader,
  SkeletonLoader, AlertBanner, Button, EmptyState,
} from '../../components/commons';
import { MotifSelector }  from '../../components/provider/MotifSelector';
import { getLitigeMotifs, reportLitige, getProviderDashboard } from '../../services/providerService';
import mockDashboard from '../../data/provider/mock_dashboard.json';
import mockMotifs    from '../../data/shared/mock_litige_motifs.json';

export default function SignalerLitige() {
  const navigate      = useNavigate();
  const { missionId } = useParams();
  const [mission,       setMission]       = useState(null);
  const [motifs,        setMotifs]        = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [selectedMotif, setSelectedMotif] = useState(null);
  const [description,   setDescription]   = useState('');
  const [photos,        setPhotos]        = useState([]);
  const [isSubmitting,  setIsSubmitting]  = useState(false);
  const [submitted,     setSubmitted]     = useState(false);
  const [error,         setError]         = useState(null);

  useEffect(() => {
    Promise.all([getProviderDashboard(), getLitigeMotifs()])
      .then(([dash, motifsData]) => {
        const m = dash.recentMissions.find((r) => r.id === missionId) ?? dash.recentMissions[0];
        setMission(m);
        setMotifs(Array.isArray(motifsData) ? motifsData : mockMotifs.data);
      })
      .catch(() => {
        setMission(mockDashboard.data.recentMissions[0]);
        setMotifs(mockMotifs.data);
      })
      .finally(() => setLoading(false));
  }, [missionId]);

  const handleAddPhoto    = (file) => setPhotos((p) => [...p, { id: `ph_${Date.now()}`, url: URL.createObjectURL(file), name: file.name }]);
  const handleRemovePhoto = (id)   => setPhotos((p) => p.filter((ph) => ph.id !== id));

  const handleSubmit = async () => {
    if (!selectedMotif)                  { setError('Veuillez sélectionner un motif.'); return; }
    if (description.trim().length < 10)  { setError('Description trop courte (10 caractères minimum).'); return; }
    setError(null);
    setIsSubmitting(true);
    try   { await reportLitige(mission.id, { motifId: selectedMotif, description }); }
    catch { }
    finally { setIsSubmitting(false); setSubmitted(true); }
  };

  if (loading) return <div className="p-6"><SkeletonLoader variant="row" count={5} /></div>;

  if (submitted) return (
    <div className="p-6 flex items-center justify-center min-h-[60vh]">
      <EmptyState
        title="Litige signalé avec succès"
        description="Notre équipe Service Client examinera votre signalement sous 48h."
        action={{ label: 'Retour au tableau de bord', onClick: () => navigate('/provider/dashboard') }}
      />
    </div>
  );

  return (
    <div className="p-4 md:p-6 max-w-2xl space-y-5">
      <PageHeader
        title="Signaler un litige"
        subtitle={`Mission ${mission.category} · ${mission.title}`}
      />

      <Card title="MOTIF DU LITIGE">
        <MotifSelector
          motifs={motifs}
          selectedId={selectedMotif}
          onChange={(id) => { setSelectedMotif(id); setError(null); }}
        />
      </Card>

      <Card title="DESCRIPTION DÉTAILLÉE">
        <textarea
          rows={5}
          value={description}
          onChange={(e) => { setDescription(e.target.value); setError(null); }}
          placeholder="Décrivez précisément ce qui s'est passé…"
          className="w-full border border-sl-200 rounded-lg px-3 py-2.5 text-sm resize-none focus:outline-none focus:border-brand"
        />
        <p className="text-xs text-sl-400 mt-1">{description.length} / 10 minimum</p>
        <div className="mt-4">
          <PhotoUploader
            label="PHOTOS / PREUVES (OPTIONNEL)"
            maxPhotos={4}
            photos={photos}
            onAdd={handleAddPhoto}
            onRemove={handleRemovePhoto}
          />
        </div>
      </Card>

      <Card title="MONTANT CONCERNÉ">
        <AmountDisplay amount={mission.totalAmount} size="lg" />
      </Card>

      {error && <AlertBanner type="error" message={error} />}

      <div className="flex gap-3 justify-end">
        <Button variant="ghost"  onClick={() => navigate(-1)}>Annuler</Button>
        <Button variant="danger" disabled={isSubmitting} onClick={handleSubmit}>
          {isSubmitting ? 'Envoi en cours…' : 'Envoyer le signalement'}
        </Button>
      </div>
    </div>
  );
}
