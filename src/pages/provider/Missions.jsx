// src/pages/provider/MissionsPage.jsx
import { useState, useEffect }        from 'react';

import { MissionCard }                from '../../components/missions/MissionCard';
import { MissionsSkeleton }           from '../../components/missions/MissionsSkeleton';

import {
  PageHeader,
  TabBar,
  AlertBanner,
  EmptyState,
  Flag,
  ErrorState,
} from '../../components/commons';

import { getProviderMissions }        from '../../services/providerService';

const TABS = [
  { id: '',           label: 'Toutes'    },
  { id: 'en_attente', label: 'En attente' },
  { id: 'en_cours',   label: 'En cours'  },
  { id: 'terminee',   label: 'Terminées' },
  { id: 'litige',     label: 'Litige'    },
];

export default function MissionsPage() {
  const [missions,    setMissions]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);
  const [activeTab,   setActiveTab]   = useState('');

  useEffect(() => {
    setLoading(true);
    setError(null);
    getProviderMissions(activeTab ? { status: activeTab } : {})
      .then(setMissions)
      .catch(err => {
        console.error('[MissionsPage]', err);
        setError('Impossible de charger les missions. Vérifiez votre connexion.');
      })
      .finally(() => setLoading(false));
  }, [activeTab]);

  return (
    <div className="p-4 md:p-6 flex flex-col gap-5">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <PageHeader
        title="Mes missions"
        subtitle="Historique et suivi de vos interventions"
      />

      {/* ── Filtres ────────────────────────────────────────────────────── */}
      <TabBar
        tabs={TABS}
        activeId={activeTab}
        onChange={ setActiveTab}
      />

      {/* ── Contenu ────────────────────────────────────────────────────── */}
      {loading ? (
        <MissionsSkeleton />
      ) : error ? (
        <ErrorState/>
      ) : missions.length === 0 ? (
        <EmptyState
          icon={<Flag size={40} strokeWidth={1.5} />}
          title="Aucune mission trouvée"
          subtitle={
            activeTab
              ? 'Aucune mission ne correspond à ce filtre.'
              : 'Vos missions apparaîtront ici dès qu\'une demande vous est attribuée.'
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {missions.data.map(mission => (
            <MissionCard key={mission.id} mission={mission}  basePath="/provider/missions"/>
          ))}
        </div>
      )}
    </div>
  );
}