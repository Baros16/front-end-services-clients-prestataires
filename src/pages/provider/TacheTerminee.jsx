import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  PageHeader, Card, AmountDisplay, ProgressBar,
  StatusBadge, SkeletonLoader, AlertBanner, Button,
} from '../../components/commons';
import { StepsList } from '../../components/provider/StepsList';
import { getProviderDashboard, completeMission } from '../../services/providerService';
import mockDashboard from '../../data/provider/mock_dashboard.json';

export default function TacheTerminee() {
  const navigate      = useNavigate();
  const { missionId } = useParams();
  const [mission,      setMission]      = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [isConfirming, setIsConfirming] = useState(false);
  const [confirmed,    setConfirmed]    = useState(false);

  useEffect(() => {
    getProviderDashboard()
      .then((d) => setMission(d.recentMissions.find((r) => r.id === missionId) ?? d.recentMissions[0]))
      .catch(() => setMission(mockDashboard.data.recentMissions[0]))
      .finally(() => setLoading(false));
  }, [missionId]);

  const handleConfirm = async () => {
    setIsConfirming(true);
    try   { await completeMission(mission.id); }
    catch { }
    finally { setIsConfirming(false); setConfirmed(true); }
  };

  if (loading) return <div className="p-6"><SkeletonLoader variant="row" count={4} /></div>;

  const stepsCompleted = mission.steps?.filter((s) => s.completed).length ?? 0;
  const stepsTotal     = mission.steps?.length ?? 0;
  const progressPct    = stepsTotal > 0 ? Math.round((stepsCompleted / stepsTotal) * 100) : 0;

  if (confirmed) return (
    <div className="p-6 flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-5 max-w-sm w-full">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto text-3xl">✅</div>
        <h2 className="text-xl font-bold text-sl-900">Mission terminée !</h2>
        <p className="text-sm text-sl-500">Le client a été notifié. Le paiement sera libéré après sa confirmation.</p>
        <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-left">
          <p className="text-xs font-medium text-green-600 mb-1">Montant en cours de libération</p>
          <AmountDisplay amount={mission.totalAmount} size="lg" />
        </div>
        <Button variant="primary" onClick={() => navigate('/provider/dashboard')} className="w-full">Retour au tableau de bord</Button>
        <Button variant="ghost"   onClick={() => navigate('/provider/gains')}     className="w-full">Voir mes gains</Button>
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-6 max-w-2xl space-y-5">
      <PageHeader title="Terminer la mission" subtitle={mission.title} />

      <Card title="AVANCEMENT DES ÉTAPES">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-sl-600">Étapes réalisées</span>
          <span className="text-sm font-semibold text-sl-900">{stepsCompleted} / {stepsTotal}</span>
        </div>
        <ProgressBar value={progressPct} max={100} showLabel size="md" />
        <div className="mt-4">
          <StepsList steps={mission.steps} />
        </div>
      </Card>

      <Card title="RÉCAPITULATIF FINANCIER">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-sl-600">Montant à libérer</p>
            <p className="text-xs text-sl-400 mt-0.5">Après confirmation du client</p>
          </div>
          <AmountDisplay amount={mission.sequesteredAmount ?? mission.totalAmount} size="md" />
        </div>
        <div className="mt-3">
          <StatusBadge label="Séquestré" variant="sequestre" size="sm" />
        </div>
      </Card>

      {progressPct < 100 && (
        <AlertBanner
          type="warning"
          message={`${stepsTotal - stepsCompleted} étape(s) non cochée(s). Confirmez-vous la fin ?`}
        />
      )}

      <div className="space-y-2">
        <Button variant="primary" disabled={isConfirming} onClick={handleConfirm} className="w-full">
          {isConfirming ? 'Confirmation en cours…' : 'Confirmer la fin de mission'}
        </Button>
        <Button variant="ghost" onClick={() => navigate(-1)} className="w-full">Retour</Button>
      </div>
    </div>
  );
}
