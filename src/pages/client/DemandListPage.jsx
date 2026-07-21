import { useState,  } from 'react';
import { useNavigate } from 'react-router-dom';

import { DemandCard }       from '../../components/client/demandes/DemandCard';
import { MissionsSkeleton } from '../../components/missions/MissionsSkeleton';

import {
  PageHeader,
  TabBar,
  AlertBanner,
  EmptyState,
  Flag,
} from '../../components/commons';

import { useClientDemands } from '../../hooks/useClientDemands';

const navigate = useNavigate();

const TABS = [
  { id: '',         label: 'Toutes'    },
  { id: 'ouverte',  label: 'Ouvertes'  },
  { id: 'en_cours', label: 'En cours'  },
  { id: 'terminee', label: 'Terminées' },
];

export default function DemandsListPage() {
  const [activeTab, setActiveTab] = useState('');
  const { demands, loading, error } = useClientDemands(activeTab);

  return (
    <div className="p-4 md:p-6 flex flex-col gap-5">

      <PageHeader
        title="Mes demandes"
        subtitle="Historique de vos demandes de service"
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
      ) : demands.length === 0 ? (
        <EmptyState
          icon={<Flag size={40} strokeWidth={1.5} />}
          title="Aucune demande trouvée"
          subtitle={
            activeTab
              ? 'Aucune demande ne correspond à ce filtre.'
              : "Vos demandes apparaîtront ici une fois publiées."
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {demands.map(demand => (
            <DemandCard key={demand.id} demand={demand} 
            onClick={demand.quoteId ? () => navigate(`/client/devis/${demand.quoteId}`) : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}