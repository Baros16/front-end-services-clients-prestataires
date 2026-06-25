// src/pages/provider/MissionCompletedPage.jsx
// M4 Kenfack — Écran 19 : Tâche Terminée (UC25)

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  PageHeader, Card, AmountDisplay, ProgressBar,
  StatusBadge, SkeletonLoader, AlertBanner, Button,
} from "../../components/commons";
import { CheckCircle } from "../../components/commons/Icons";

import { getProviderDashboard, completeMission } from "../../services/providerService";
import mockDashboard from "../../data/provider/mock_dashboard.json";
import { formatXAF } from "../../utils/formatters";

export default function MissionCompletedPage() {
  const navigate      = useNavigate();
  const { missionId } = useParams();

  const [mission,      setMission]      = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [isConfirming, setIsConfirming] = useState(false);
  const [confirmed,    setConfirmed]    = useState(false);

  useEffect(() => {
    getProviderDashboard()
      .then((d) => {
        const m = d.recentMissions.find((r) => r.id === missionId)
          ?? d.recentMissions[0];
        setMission(m);
      })
      .catch(() => setMission(mockDashboard.data.recentMissions[0]))
      .finally(() => setLoading(false));
  }, [missionId]);

  const handleConfirm = async () => {
    setIsConfirming(true);
    try   { await completeMission(mission.id); }
    catch { /* fallback démo */ }
    finally { setIsConfirming(false); setConfirmed(true); }
  };

  if (loading) return (
    <div className="p-6"><SkeletonLoader variant="row" count={4} /></div>
  );

  const stepsCompleted = mission.steps?.filter((s) => s.completed).length ?? 0;
  const stepsTotal     = mission.steps?.length ?? 0;
  const progressPct    = stepsTotal > 0 ? Math.round((stepsCompleted / stepsTotal) * 100) : 0;

  if (confirmed) return (
    <div className="p-6 flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-5 max-w-sm w-full">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
          style={{ background: "var(--color-success-light)" }}
        >
          <CheckCircle size={32} style={{ color: "var(--color-success)" }} />
        </div>
        <h2
          className="text-xl font-bold"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-sl-900)" }}
        >
          Mission terminée !
        </h2>
        <p className="text-sm" style={{ color: "var(--color-sl-500)" }}>
          Le client a été notifié. Le paiement sera libéré après sa confirmation.
        </p>
        <div
          className="rounded-xl p-4 text-left space-y-1"
          style={{ background: "var(--color-success-light)" }}
        >
          <p className="text-xs font-medium" style={{ color: "var(--color-success)" }}>
            Montant en cours de libération
          </p>
          <AmountDisplay amount={mission.totalAmount} size="lg" />
        </div>
        <div className="space-y-2">
          <Button variant="primary" onClick={() => navigate("/provider/dashboard")} className="w-full active:scale-95">
            Retour au tableau de bord
          </Button>
          <Button variant="ghost" onClick={() => navigate("/provider/gains")} className="w-full active:scale-95">
            Voir mes gains
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-6 max-w-2xl space-y-5">
      <PageHeader
        title="Terminer la mission"
        subtitle={mission.title}
        badge={{ label: "EN COURS", variant: "en_cours" }}
      />

      {/* Avancement étapes */}
      <Card title="AVANCEMENT DES ÉTAPES">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm" style={{ color: "var(--color-sl-600)" }}>
            Étapes réalisées
          </span>
          <span className="text-sm font-semibold" style={{ color: "var(--color-sl-900)" }}>
            {stepsCompleted} / {stepsTotal}
          </span>
        </div>

        <ProgressBar value={progressPct} max={100} showLabel size="md" />

        <div className="mt-4 space-y-2">
          {mission.steps?.map((step) => (
            <div key={step.id} className="flex items-center gap-2.5">
              <CheckCircle
                size={16}
                style={{ color: step.completed ? "var(--color-success)" : "var(--color-sl-300)", flexShrink: 0 }}
              />
              <span
                className="text-sm"
                style={{
                  color:          step.completed ? "var(--color-sl-400)" : "var(--color-sl-800)",
                  textDecoration: step.completed ? "line-through"        : "none",
                }}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Récap financier */}
      <Card title="RÉCAPITULATIF FINANCIER">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm" style={{ color: "var(--color-sl-600)" }}>
              Montant à libérer
            </p>
            <p className="text-xs mt-0.5" style={{ color: "var(--color-sl-400)" }}>
              Après confirmation du client
            </p>
          </div>
          <AmountDisplay amount={mission.sequesteredAmount ?? mission.totalAmount} size="md" />
        </div>
        <div className="mt-3">
          <StatusBadge label="Séquestré" variant="sequestre" size="sm" />
        </div>
      </Card>

      {/* Avertissement si étapes incomplètes */}
      {progressPct < 100 && (
        <AlertBanner
          type="warning"
          message={`${stepsTotal - stepsCompleted} étape(s) non cochée(s). Confirmez-vous la fin de la mission ?`}
        />
      )}

      {/* Actions */}
      <div className="space-y-2">
        <Button
          variant="primary"
          disabled={isConfirming}
          onClick={handleConfirm}
          className="w-full active:scale-95"
          style={{ background: "var(--color-success)" }}
        >
          {isConfirming ? "Confirmation en cours…" : "Confirmer la fin de mission"}
        </Button>
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="w-full active:scale-95"
        >
          Retour
        </Button>
      </div>
    </div>
  );
}