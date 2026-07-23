// src/pages/client/SuiviMission.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  PageHeader,
  StatusBadge,
  Card,
  LocationPicker,   // BUG 1 — remplace MapEmbed (qui n'accepte pas lat/lng)
  UserAvatarCircle,
  Button,
  AlertBanner,
  SkeletonLoader,
  EmptyState,       // BUG 10 — état vide localisation
  MessageCircle,    // BUG 6 — importé depuis commons (barrel), plus depuis Icons.jsx
  MapPin,           // BUG 10 — icône EmptyState localisation
} from '../../components/commons';

import { MissionProgressHeader } from '../../components/client/missions/MissionProgressHeader';
import { MissionStepList }       from '../../components/client/missions/MissionStepList';
import { SequestredAmountCard }  from '../../components/client/missions/SequestredAmountCard';
import { LitigeAlertPanel }      from '../../components/client/missions/LitigeAlertPanel';

import { getMission }            from '../../services/clientService';
import { useProviderLocation }   from '../../hooks/useProviderLocation';
import { buildMissionDisplayTitle } from '../../utils/formatters';

export default function SuiviMission() {
  const navigate = useNavigate();
  const { id: missionId } = useParams();

  const [mission, setMission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  // Position live du prestataire — polling 10s géré par le hook, s'arrête
  // automatiquement dès que mission.status !== 'en_cours'.
  const { providerLocation } = useProviderLocation(missionId);

  useEffect(() => {
    if (!missionId) {
      setError('Mission introuvable.');
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    getMission(missionId)
      .then((data)  => { if (!cancelled) setMission(data); })
      .catch(()     => { if (!cancelled) setError('Impossible de charger la mission.'); })
      .finally(()   => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [missionId]);

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
  // BUG 2 — corrigé : variant="error" (pas type="danger")
  if (error) {
    return (
      <div className="p-6">
        <AlertBanner variant="error" message={error} />
      </div>
    );
  }

  if (!mission) return null;

  // BUG 9 — corrigé : fallback en majuscule
  const providerInitial = mission.providerAvatarInitial ?? 'P';
  const providerName    = mission.providerName ?? buildMissionDisplayTitle(mission);

  // Position live (polling) prioritaire, repli sur celle du chargement initial
  // tant que le hook n'a pas encore répondu.
  const location = providerLocation ?? mission.providerLocation ?? null;

  // ── État données ─────────────────────────────────────────
  return (
    <div className="flex flex-col gap-6 p-6 min-h-[100dvh] bg-sl-50">

      {/* En-tête */}
      <PageHeader
        title="Suivi de mission"
        subtitle={`${mission.category} · ${providerName}`}
        actions={
          // BUG 4 — corrigé : label obligatoire sur StatusBadge
          <StatusBadge variant="en_cours" label="En cours" withDot />
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
            {location ? (
              <>
                {/*
                  BUG 1 — corrigé : LocationPicker en readOnly remplace MapEmbed.
                  MapEmbed accepte uniquement `address` (string), pas lat/lng.
                  LocationPicker (react-leaflet) accepte defaultLocation { lat, lng }
                  et readOnly désactive toute interaction.
                */}
                <div className="h-[200px] overflow-hidden rounded-lg">
                  <LocationPicker
                    defaultLocation={{ lat: location.lat, lng: location.lng }}
                    readOnly
                  />
                </div>
                {location.sublabel && (
                  <p className="mt-2 text-[12px] text-sl-500 font-[family-name:var(--font-body)]">
                    {location.sublabel}
                  </p>
                )}
              </>
            ) : (
              // BUG 10 — corrigé : EmptyState au lieu du <p> brut
              <EmptyState
                icon={<MapPin size={24} />}
                title="Localisation indisponible"
                description="La position du prestataire n'est pas encore disponible."
              />
            )}
          </Card>

        </div>

        {/* ── Colonne droite ── */}
        <div className="flex flex-col gap-4">

          {/* Card Prestataire */}
          <Card title="Prestataire">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                {/*
                  BUG 3 — corrigé : prop color (pas bgClass).
                  L'API de UserAvatarCircle est : initial, size, color, imageUrl.
                  bgClass n'existe pas → couleur ignorée en silence.
                */}
                <UserAvatarCircle
                  initial={providerInitial}
                  size="md"
                  color="var(--color-brand)"
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
              </div>

              {/*
                BUG 5 — corrigé : on passe missionId + providerId dans l'état
                de navigation pour que ChatPage puisse pré-sélectionner
                la bonne conversation sans ambiguïté.
              */}
              <Button
                variant="secondary"
                size="sm"
                onClick={() =>
                  navigate('/client/chat', {
                    state: {
                      missionId:  mission.id,
                      providerId: mission.providerId,
                    },
                  })
                }
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