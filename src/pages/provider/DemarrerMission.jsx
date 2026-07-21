// src/pages/provider/DemarrerMission.jsx

import { useParams} from "react-router-dom";
import {
  PageHeader,
  Button,
  AlertBanner,
  SkeletonLoader,
  EmptyState,
} from "../../components/commons";
import { MissionSummaryCard } from "../../components/provider/mission-start/MissionSummaryCard";
import { ClientContactCard } from "../../components/provider/mission-start/ClientContactCard";
import { PreDepartureChecklist } from "../../components/provider/mission-start/PreDepartureChecklist";
import { MissionStepsForm } from "../../components/provider/mission-start/MissionStepsForm";
import { QuoteDetailCard } from "../../components/provider/mission-start/QuoteDetailCard";
import { MissionStepsChecklist } from "../../components/provider/mission-start/MissionStepsChecklist";
import { formatXAF } from "../../utils/formatters";
import { useDemarrerMission } from "../../hooks/provider/useDemarrerMission";


export default function DemarrerMission() {
  const { id: missionId } = useParams();
  const {
    mission,
    client,
    loading,
    loadError,
    reload,
    planningLoading,
    planningError,
    submitPlanning,
    startLoading,
    startError,
    start,
    updatingStepId,
    toggleStep,
    completeLoading,
    completeError,
    complete,
    contactClient,
    quote,
    quoteLoading,
    quoteError,
  } = useDemarrerMission(missionId);

  // ─── États de chargement / erreur ─────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col gap-6 p-4 sm:p-6">
        <SkeletonLoader variant="card" count={2} />
      </div>
    );
  }

  if (loadError === "not_found") {
    return (
      <EmptyState
        title="Mission introuvable"
        subtitle="Cette mission n'existe pas ou tu n'y as pas accès."
        action={<Button variant="primary" onClick={reload}>Réessayer</Button>}
      />
    );
  }

  if (loadError === "fetch_error") {
    return (
      <div className="p-4 sm:p-6">
        <AlertBanner
          type="danger"
          title="Erreur de chargement"
          message="Impossible de récupérer les informations de la mission."
        />
        <Button variant="secondary" onClick={reload} className="mt-4">
          Réessayer
        </Button>
      </div>
    );
  }

  const hasSteps = Array.isArray(mission.steps) && mission.steps.length > 0;
  const isPending = mission.status === "en_attente";
  const isActive = mission.status === "en_cours";

  return (
    <>
      <PageHeader title={mission.title} subtitle={mission.category} />

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 sm:gap-6 p-4 sm:p-6">
        {/* ── Colonne principale ── */}
        <div className="flex flex-col gap-4 sm:gap-6 min-w-0">
          <MissionSummaryCard mission={mission} />

          {/* VUE A — planification (en_attente, pas encore de steps) */}
          {isPending && !hasSteps && (
            <MissionStepsForm
              onSubmit={submitPlanning}
              loading={planningLoading}
              error={planningError}
            />
          )}

          {/* VUE B — prêt à démarrer (en_attente, steps déjà définies) */}
          {isPending && hasSteps && (
            <div className="flex flex-col items-center gap-3 bg-success-light rounded-[var(--radius-lg)] p-5 sm:p-6 text-center">
              <p className="text-[14px] font-medium text-sl-700 m-0">
                Prêt à commencer l'intervention ?
              </p>
              <Button
                variant="primary"
                size="lg"
                onClick={start}
                disabled={startLoading}
                className="w-full max-w-sm"
              >
                {startLoading ? "Démarrage..." : "Démarrer la mission maintenant"}
              </Button>
              <p className="text-[12px] text-sl-400 m-0">
                Le client sera notifié et l'heure de début enregistrée
              </p>
              {startError && (
                <AlertBanner type="danger" message={startError} className="w-full mt-2" />
              )}
            </div>
          )}

          {/* VUE C — mission en cours */}
          {isActive && (
            <>
              <MissionStepsChecklist
                steps={mission.steps}
                onToggleStep={toggleStep}
                updatingStepId={updatingStepId}
              />

              <Button variant="primary" size="lg" onClick={complete} disabled={completeLoading}>
                {completeLoading ? "Finalisation..." : "Terminer la mission"}
              </Button>

              {completeError && <AlertBanner type="danger" message={completeError} />}
            </>
          )}

          {/* VUE D — terminée / litige / autre statut, lecture seule */}
          {!isPending && !isActive && (
            <AlertBanner
              type={mission.status === "litige" ? "danger" : "info"}
              title="Mission non active"
              message={`Cette mission est actuellement "${mission.status}". Aucune action de démarrage disponible.`}
            />
          )}
        </div>

        {/* ── Colonne latérale ── */}
        <div className="flex flex-col gap-4 sm:gap-6 min-w-0">
          {client && <ClientContactCard client={client} onContact={contactClient} />}

          {quote && <QuoteDetailCard quote={quote} />}
          {quoteLoading && <SkeletonLoader variant="card" />}
          {quoteError && <AlertBanner type="warning" message={quoteError} />}

          {isPending && hasSteps && (
            <>
              <PreDepartureChecklist />
              <AlertBanner
                type="warning"
                title="Rappel séquestre"
                message={`${formatXAF(mission.sequesteredAmount)} séquestrés. Libération après double validation.`}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
}