
// src/pages/client/SuiviMission.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  PageHeader, StatusBadge, Card,
  MapEmbed, UserAvatarCircle, Button,
  AlertBanner, SkeletonLoader,
} from "@/components/commons";

import { MessageCircle } from "@/components/commons/Icons";

import { MissionProgressHeader } from '@/components/client/missions/MissionProgressHeader';
import { MissionStepList }       from '@/components/client/missions/MissionStepList';
import { SequestredAmountCard }  from '@/components/client/missions/SequestredAmountCard';
import { LitigeAlertPanel }      from '@/components/client/missions/LitigeAlertPanel';

import { getMission } from '../../services/clientService';

export default function SuiviMission() {
  const navigate = useNavigate();
  const [mission, setMission]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

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
        <SkeletonLoader variant="card"   count={2} />
      </div>
    );
  }

  // ── État erreur ──────────────────────────────────────────
  if (error) {
    return (
      <div className="p-6">
        <AlertBanner variant="error" message={error} />
      </div>
    );
  }

  const completedCount = mission.steps.filter((s) => s.completed).length;

  // ── État données ─────────────────────────────────────────
  return (
    <div className="flex flex-col gap-6 p-6 min-h-[100dvh]"
      style={{ backgroundColor: 'var(--color-sl-50)' }}
    >
      {/* En-tête */}
      <PageHeader
        title="Suivi de mission"
        subtitle={`${mission.category} · Jean-Claude Mbarga`}
        actions={
          <StatusBadge label="EN COURS" variant="en_cours" withDot />
        }dev
      />

      {/* Grille 2 colonnes */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">

        {/* ── Colonne gauche ── */}
        <div className="flex flex-col gap-6">

          {/* Card Avancement */}
          <Card title="Avancement">
            <MissionProgressHeader
              startedAt={mission.startedAt}
              estimatedDurationHours={mission.estimatedDurationHours}
            />
          </Card>

          {/* Card Étapes */}
          <Card title="La Mission">
            <MissionStepList steps={mission.steps} />
          </Card>

          {/* Carte localisation */}
          <Card title="Localisation temps réel">
            <MapEmbed
              address={mission.providerLocation.sublabel}
              label={mission.providerLocation.label}
              height={200}
            />
          </Card>
        </div>

        {/* ── Colonne droite ── */}
        <div className="flex flex-col gap-4">

          {/* Card Prestataire */}
          <Card title="Prestataire">
            <div className="flex flex-col items-center gap-3">
              <UserAvatarCircle
                initial="J"
                size="lg"
                color="var(--color-brand)"
              />
              <div className="text-center">
                <p
                  className="font-body font-semibold text-sm"
                  style={{ color: 'var(--color-sl-900)' }}
                >
                  Jean-Claude Mbarga
                </p>
                <p
                  className="text-xs font-body"
                  style={{ color: 'var(--color-success)' }}
                >
                Sur place
                </p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate('/client/chat')}
                className="w-full active:scale-95"
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
