// src/pages/client/SuiviMission.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  PageHeader,
  StatusBadge,
  Card,
  MapEmbed,
  UserAvatarCircle,
  Button,
  AlertBanner,
  SkeletonLoader,
} from '../../components/commons';

import { MessageCircle } from '../../components/commons/Icons';

import { MissionProgressHeader } from '../../components/client/missions/MissionProgressHeader';
import { MissionStepList }       from '../../components/client/missions/MissionStepList';
import { SequestredAmountCard }  from '../../components/client/missions/SequestredAmountCard';
import { LitigeAlertPanel }      from '../../components/client/missions/LitigeAlertPanel';

import { getMission } from '../../services/clientService';

export default function SuiviMission() {
  const navigate = useNavigate();
  const [mission, setMission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    getMission('msn_001')
      .then((data) => setMission(data))
      .catch(() => setError('Impossible de charger la mission.'))
      .finally(() => setLoading(false));
  }, []);

  // ── État chargement ──────────────────────────────────────
  if (loading) {
    return (
      <div className="p-6 flex flex-col gap-4">
        <SkeletonLoader variant="metric" count={3} />
        <SkeletonLoader variant="card" count={2} />
      </div>
    );
  }

  // ── État erreur ──────────────────────────────────────────
  if (error) {
    return (
      <div className="p-6">
        <AlertBanner type="danger" message={error} />
      </div>
    );
  }

  // Données prestataire depuis mock
  const providerInitial = mission.providerAvatarInitial ?? '?';
  const providerName = mission.providerName ?? 'Prestataire';
  // ── État données ─────────────────────────────────────────
  return (
    <div className="flex flex-col gap-6 p-6 min-h-[100dvh] bg-sl-50">

      {/* En-tête */}
      <PageHeader
        title="Suivi de mission"
        subtitle={`${mission.category} · ${providerName}`}
        actions={
          <StatusBadge variant="en_cours" withDot />
        }
      />

      {/* Grille 2 colonnes */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">

        {/* ── Colonne gauche ── */}
        <div className="flex flex-col gap-6">

        <Card title="Avancement">
          <div className="flex flex-col gap-4">
           <MissionProgressHeader
             startedAt={mission.startedAt}
             estimatedDurationHours={mission.estimatedDurationHours}
            />
            <div className="border-t border-sl-100 pt-4">
             <span className="text-[11px] font-[family-name:var(--font-body)] font-bold tracking-[0.1em] uppercase text-sl-500 mb-3 block">
               ETAPES DE LA MISSION
              </span>
              <MissionStepList steps={mission.steps} />
           </div>
          </div>
        </Card>
          {/* Card Localisation */}
          <Card title="Localisation temps réel">
            <MapEmbed
              address={mission.providerLocation.sublabel}
              label={mission.providerLocation.label}
              height="200px"
            />
          </Card>
        </div>

        {/* ── Colonne droite ── */}
        <div className="flex flex-col gap-4">

          {/* Card Prestataire */}
          <Card title="Prestataire">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <UserAvatarCircle
                  initial={providerInitial}
                  size="md"
                  bgClass="bg-brand"
                />
                <div className="flex flex-col">
                  <span className="text-[14px] font-semibold font-[family-name:var(--font-body)] text-sl-900">
                    {providerName}
                  </span>
                  <span className="flex items-center gap-1 text-[12px] font-[family-name:var(--font-body)] text-success">
                    <span className="w-2 h-2 rounded-full bg-success sl-animate-pulse-dot" />
                    Sur place
                  </span>

                </div>
              </div><Button
                variant="secondary"
                size="sm"
                onClick={() => navigate('/client/chat')}
                className="w-full"
              >
                <MessageCircle size={14} />
                Envoyer un message
              </Button>
            </div>
          </Card>

          {/* Card Séquestre */}
          <SequestredAmountCard
            totalAmount={mission.totalAmount}
            steps={mission.steps}
          />

          {/* Panel Litige */}
          <LitigeAlertPanel missionId={mission.id} />

        </div>
      </div>
    </div>
  );
}