import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  PageHeader, Card, AmountDisplay, MapEmbed,
  SkeletonLoader, AlertBanner, Button,
} from '../../components/commons';
import PreDepartChecklist       from '../../components/provider/PreDepartChecklist';
import SequestredReminderCard   from '../../components/provider/SequestredReminderCard';
import { MissionInfoGrid }      from '../../components/provider/MissionInfoGrid';
import { ContactClientButton }  from '../../components/provider/ContactClientButton';
import { getProviderDashboard, startMission } from '../../services/providerService';
import mockDashboard   from '../../data/provider/mock_dashboard.json';
import mockChecklist   from '../../data/provider/mock_checklist.json';

export default function DemarrerMission() {
  const navigate    = useNavigate();
  const { id }      = useParams();
  const [mission,    setMission]    = useState(null);
  const [checklist,  setChecklist]  = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [isStarting, setIsStarting] = useState(false);
  const [started,    setStarted]    = useState(false);

  useEffect(() => {
    getProviderDashboard()
      .then((d) => {
        const m = d.recentMissions.find((r) => r.id === id) ?? d.recentMissions[0];
        setMission(m);
        setChecklist(mockChecklist.data.map((item) => ({ ...item, checked: false })));
      })
      .catch(() => {
        setMission(mockDashboard.data.recentMissions[0]);
        setChecklist(mockChecklist.data.map((item) => ({ ...item, checked: false })));
      })
      .finally(() => setLoading(false));
  }, [id]);

  const toggle     = (itemId) => setChecklist((p) => p.map((i) => i.id === itemId ? { ...i, checked: !i.checked } : i));
  const allChecked = checklist.every((i) => i.checked);

  const handleStart = async () => {
    if (!allChecked) return;
    setIsStarting(true);
    try   { await startMission(mission.id); }
    catch { }
    finally { setIsStarting(false); setStarted(true); }
  };

  if (loading) return <div className="p-6"><SkeletonLoader variant="row" count={5} /></div>;

  if (started) return (
    <div className="p-6 flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-4 max-w-sm">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto text-3xl">✅</div>
        <h2 className="text-xl font-semibold text-sl-900">Mission démarrée !</h2>
        <p className="text-sm text-sl-500">Le client a été notifié.</p>
        <Button variant="primary" onClick={() => navigate('/provider/dashboard')}>
          Retour au tableau de bord
        </Button>
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-6 space-y-5">
      <PageHeader title="Missions en attente" subtitle="Missions payées, prêtes à démarrer" />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 space-y-5">
          <Card>
            <MissionInfoGrid mission={mission} />
            <div className="mt-5">
              <MapEmbed
                address={mission.location.address}
                label={`📍 ${mission.location.address}`}
                height="200px"
                interactive={false}
              />
            </div>
            <div className="mt-5 space-y-3">
              {!allChecked && (
                <AlertBanner type="warning" message="Cochez tous les éléments avant de démarrer." />
              )}
              <Button
                variant="primary"
                disabled={!allChecked || isStarting}
                onClick={handleStart}
                className="w-full"
              >
                {isStarting ? 'Démarrage…' : '▶ Démarrer la mission maintenant'}
              </Button>
              {allChecked && (
                <p className="text-xs text-center text-sl-400">
                  Le client sera notifié et l'heure enregistrée
                </p>
              )}
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card title="CHECKLIST AVANT DÉPART">
            <PreDepartChecklist items={checklist} onToggle={toggle} />
          </Card>
          <ContactClientButton />
          <SequestredReminderCard amount={mission.sequesteredAmount} />
        </div>
      </div>
    </div>
  );
}
