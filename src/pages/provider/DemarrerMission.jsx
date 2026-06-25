// src/pages/provider/StartMissionPage.jsx
// M4 Kenfack — Écran 18 : Démarrer Mission (UC24)

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  PageHeader, Card, AmountDisplay, MapEmbed,
  SkeletonLoader, AlertBanner, Button, StatusBadge,
  UserAvatarCircle,
} from "../../components/commons";
import { CheckCircle, MessageCircle } from "../../components/commons/Icons";

import { getProviderDashboard, startMission } from "../../services/providerService";
import mockDashboard from "../../data/provider/mock_dashboard.json";
import { formatXAF } from "../../utils/formatters";

const DEFAULT_CHECKLIST = [
  { id: "c1", label: "Matériaux préparés"             },
  { id: "c2", label: "Outils chargés dans le véhicule" },
  { id: "c3", label: "Adresse client confirmée"        },
  { id: "c4", label: "Téléphone chargé"                },
];

export default function StartMissionPage() {
  const navigate      = useNavigate();
  const { missionId } = useParams();

  const [mission,    setMission]    = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);
  const [checked,    setChecked]    = useState({});
  const [isStarting, setIsStarting] = useState(false);
  const [started,    setStarted]    = useState(false);

  useEffect(() => {
    getProviderDashboard()
      .then((d) => {
        const m = d.recentMissions.find((r) => r.id === missionId)
          ?? d.recentMissions.find((r) => r.status === "en_cours")
          ?? d.recentMissions[0];
        setMission(m);
        const init = {};
        DEFAULT_CHECKLIST.forEach((c) => { init[c.id] = false; });
        setChecked(init);
      })
      .catch(() => {
        const m = mockDashboard.data.recentMissions[0];
        setMission(m);
        const init = {};
        DEFAULT_CHECKLIST.forEach((c) => { init[c.id] = false; });
        setChecked(init);
      })
      .finally(() => setLoading(false));
  }, [missionId]);

  const toggle      = (id) => setChecked((p) => ({ ...p, [id]: !p[id] }));
  const allChecked  = DEFAULT_CHECKLIST.every((c) => checked[c.id]);

  const handleStart = async () => {
    if (!allChecked) return;
    setIsStarting(true);
    try   { await startMission(mission.id); setStarted(true); }
    catch { setStarted(true); } // fallback démo
    finally { setIsStarting(false); }
  };

  if (loading) return (
    <div className="p-6"><SkeletonLoader variant="row" count={5} /></div>
  );

  if (error) return (
    <div className="p-6">
      <AlertBanner type="error" message={error} />
    </div>
  );

  if (started) return (
    <div className="p-6 flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-4 max-w-sm">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
          style={{ background: "var(--color-success-light)" }}
        >
          <CheckCircle size={32} style={{ color: "var(--color-success)" }} />
        </div>
        <h2 className="text-xl font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--color-sl-900)" }}>
          Mission démarrée !
        </h2>
        <p className="text-sm" style={{ color: "var(--color-sl-500)" }}>
          Le client a été notifié. Bonne intervention.
        </p>
        <Button variant="primary" onClick={() => navigate("/provider/dashboard")}>
          Retour au tableau de bord
        </Button>
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-6 space-y-5">
      <PageHeader
        title="Missions en attente"
        subtitle="Missions payées, prêtes à démarrer"
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* Colonne gauche */}
        <div className="xl:col-span-2 space-y-5">

          {/* Fiche mission */}
          <Card>
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs mb-1" style={{ color: "var(--color-sl-400)" }}>
                  Mission confirmée · Paiement reçu
                </p>
                <h2
                  className="text-xl font-bold"
                  style={{ fontFamily: "var(--font-display)", color: "var(--color-sl-900)" }}
                >
                  {mission.title}
                </h2>
              </div>
              <StatusBadge label="SÉQUESTRÉE" variant="sequestre" />
            </div>

            {/* Triplet infos */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              <MetricInfo label="CLIENT"        value="Madeleine K." />
              <MetricInfo label="MONTANT"       value={<AmountDisplay amount={mission.totalAmount} size="md" />} />
              <MetricInfo label="DURÉE ESTIMÉE" value={`${mission.estimatedDurationHours}h`} />
            </div>

            {/* Carte */}
            <MapEmbed
              address={mission.location.address}
              label={`Adresse : ${mission.location.address}`}
              height="200px"
              interactive={false}
            />

            {/* CTA */}
            <div
              className="mt-5 rounded-xl p-4 text-center space-y-3"
              style={{ background: "var(--color-sl-50)" }}
            >
              <p className="text-sm" style={{ color: "var(--color-sl-500)" }}>
                Prêt à commencer l'intervention ?
              </p>
              <Button
                variant="primary"
                disabled={!allChecked || isStarting}
                onClick={handleStart}
                className="w-full active:scale-95"
              >
                {isStarting ? "Démarrage…" : "Démarrer la mission maintenant"}
              </Button>
              {allChecked && (
                <p className="text-xs" style={{ color: "var(--color-sl-400)" }}>
                  Le client sera notifié et l'heure de début enregistrée
                </p>
              )}
              {!allChecked && (
                <p className="text-xs" style={{ color: "var(--color-warning)" }}>
                  Cochez tous les éléments de la checklist avant de démarrer
                </p>
              )}
            </div>
          </Card>

        </div>

        {/* Colonne droite */}
        <div className="space-y-4">

          {/* Client */}
          <Card title="CLIENT">
            <ClientCard />
          </Card>

          {/* Checklist */}
          <Card title="CHECKLIST AVANT DÉPART">
            <div className="space-y-2">
              {DEFAULT_CHECKLIST.map((item) => (
                <ChecklistItem
                  key={item.id}
                  label={item.label}
                  checked={!!checked[item.id]}
                  onToggle={() => toggle(item.id)}
                />
              ))}
            </div>
          </Card>

          {/* Rappel séquestre */}
          <AlertBanner
            type="info"
            title="Rappel séquestre"
            message={`${formatXAF(mission.sequesteredAmount)} séquestrés. Libération après double validation.`}
          />

        </div>
      </div>
    </div>
  );
}

function MetricInfo({ label, value }) {
  return (
    <div
      className="rounded-lg p-3"
      style={{ background: "var(--color-sl-50)" }}
    >
      <p className="text-[10px] font-medium uppercase tracking-wider mb-1"
         style={{ color: "var(--color-sl-400)" }}>
        {label}
      </p>
      <div className="font-semibold text-sm" style={{ color: "var(--color-sl-900)" }}>
        {value}
      </div>
    </div>
  );
}

function ClientCard() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <UserAvatarCircle initial="M" size="lg" />
        <div>
          <p className="font-semibold text-sm" style={{ color: "var(--color-sl-900)" }}>
            Madeleine Kamdem
          </p>
          <p className="text-xs" style={{ color: "var(--color-sl-400)" }}>
            3 missions · Client vérifié
          </p>
        </div>
      </div>
      <Button variant="secondary" className="w-full active:scale-95">
        <MessageCircle size={14} className="mr-1.5" />
        Contacter le client
      </Button>
    </div>
  );
}

function ChecklistItem({ label, checked, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className="w-full flex items-center gap-3 text-left py-2 active:scale-95 transition-transform"
    >
      <div
        className="w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors"
        style={{
          background:   checked ? "var(--color-brand)"   : "transparent",
          borderColor:  checked ? "var(--color-brand)"   : "var(--color-sl-300)",
        }}
      >
        {checked && <CheckCircle size={12} color="white" />}
      </div>
      <span
        className="text-sm"
        style={{
          color:          checked ? "var(--color-sl-400)" : "var(--color-sl-800)",
          textDecoration: checked ? "line-through"        : "none",
        }}
      >
        {label}
      </span>
    </button>
  );
}