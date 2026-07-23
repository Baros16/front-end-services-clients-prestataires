import { useState, useEffect, useMemo } from 'react';

import { MissionCard }      from '../../components/missions/MissionCard';
import { MissionsSkeleton } from '../../components/missions/MissionsSkeleton';

import {
  PageHeader,
  TabBar,
  AlertBanner,
  EmptyState,
  Flag,
} from '../../components/commons';

import { getClientMissions } from '../../services/clientService';

const TABS = [
  { id: '',         label: 'Toutes'    },
  { id: 'en_cours', label: 'En cours'  },
  { id: 'terminee', label: 'Terminées' },
  { id: 'litige',   label: 'Litige'    },
];

export default function MissionsPage() {
  const [missions,  setMissions]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);
  const [activeTab, setActiveTab] = useState('');

  // Un seul chargement — l'API réelle ne filtre pas côté serveur (cf. 1.6),
  // le filtrage par onglet se fait en mémoire ci-dessous.
  useEffect(() => {
    setLoading(true);
    setError(null);
    getClientMissions()
      .then(setMissions)
      .catch(err => {
        console.error('[MissionsPage - client]', err);
        setError('Impossible de charger les missions. Vérifiez votre connexion.');
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredMissions = useMemo(() => {
    if (!activeTab) return missions;
    return missions.filter(m => m.status === activeTab);
  }, [missions, activeTab]);

  return (
    <div className="p-4 md:p-6 flex flex-col gap-5">

      <PageHeader
        title="Mes missions"
        subtitle="Historique et suivi de vos interventions"
      />

      <TabBar
        tabs={TABS}
        activeId={activeTab}
        onChange={setActiveTab}
      />

      {loading ? (
        <MissionsSkeleton />
      ) : error ? (
        <AlertBanner message={error} type="danger" />
      ) : filteredMissions.length === 0 ? (
        <EmptyState
          icon={<Flag size={40} strokeWidth={1.5} />}
          title="Aucune mission trouvée"
          subtitle={
            activeTab
              ? 'Aucune mission ne correspond à ce filtre.'
              : "Vos missions apparaîtront ici dès qu'une demande est acceptée."
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMissions.data.map(mission => (
            <MissionCard key={mission.id} mission={mission} basePath="/client/missions" />
          ))}
        </div>
      )}
    </div>
  );
}