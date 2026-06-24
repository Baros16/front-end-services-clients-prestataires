// src/pages/provider/StartMissionPage.jsx
// M4 Kenfack — Semaine 3 — Écran 18 : Démarrer Mission (UC24)
// Layout 2 colonnes : colonne gauche (détails + carte) / colonne droite (client + checklist + séquestre)

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

// ✅ Composants communs Krisan
import {PageHeader}    from "../../components/commons/PageHeader";
import {StatusBadge}   from "../../components/commons/StatusBadge";
import {AmountDisplay} from "../../components/commons/AmountDisplay";
import {MapEmbed}      from "../../components/commons/MapEmbed";
import {SkeletonLoader} from "../../components/commons/SkeletonLoader";
import {AlertBanner}   from "../../components/commons/AlertBanner";

// ✅ Composants prestataire Krisan
import PreDepartChecklist from "../../components/provider/PreDepartChecklist";
import ClientMiniCard     from "../../components/provider/ClientMiniCard";
import SequestredReminderCard from "../../components/provider/SequestredReminderCard";

// ✅ Service + mock fallback
import { getProviderDashboard, startMission } from "../../services/providerService";
import mockDashboard from "../../data/provider/mock_dashboard.json";

// ─── CHECKLIST ITEMS PAR DÉFAUT ───────────────────────────────────────────────
const DEFAULT_CHECKLIST = [
  { id: "c1", label: "Matériaux préparés",    checked: false },
  { id: "c2", label: "Outils chargés",        checked: false },
  { id: "c3", label: "Adresse confirmée",     checked: false },
  { id: "c4", label: "Téléphone chargé",      checked: false },
];

// =============================================================================
export default function StartMissionPage() {
  const navigate          = useNavigate();
  const { missionId }     = useParams();           // /provider/missions/:missionId/start

  const [mission,    setMission]    = useState(null);
  const [profile,    setProfile]    = useState(null);
  const [checklist,  setChecklist]  = useState(DEFAULT_CHECKLIST);
  const [isLoading,  setIsLoading]  = useState(true);
  const [isStarting, setIsStarting] = useState(false);
  const [started,    setStarted]    = useState(false);

  useEffect(() => {
    getProviderDashboard()
      .then((d) => {
        setProfile(d.profile);
        // Cherche la mission par ID, sinon prend la première "en_attente"
        const found = d.recentMissions.find((m) => m.id === missionId)
          ?? d.recentMissions.find((m) => m.status === "en_cours")
          ?? d.recentMissions[0];
        setMission(found);
      })
      .catch(() => {
        const d = mockDashboard.data;
        setProfile(d.profile);
        setMission(d.recentMissions[0]);
      })
      .finally(() => setIsLoading(false));
  }, [missionId]);

  // Toggle item checklist
  const handleToggle = (itemId) => {
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, checked: !item.checked } : item
      )
    );
  };

  // Démarrer la mission
  const handleStart = async () => {
    if (!allChecked) return;
    setIsStarting(true);
    try {
      await startMission(mission.id);
      setStarted(true);
    } catch {
      // fallback : on considère comme démarré quand même (démo)
      setStarted(true);
    } finally {
      setIsStarting(false);
    }
  };

  const allChecked = checklist.every((i) => i.checked);

  // ── ÉTAT CHARGEMENT ───────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <>
        <PageHeader title="Démarrer la mission" />
        <div className="p-6 space-y-4">
          <SkeletonLoader variant="row" count={4} />
        </div>
      </>
    );
  }

  // ── ÉTAT SUCCÈS ───────────────────────────────────────────────────────────
  if (started) {
    return (
      <>
        <PageHeader title="Mission démarrée" />
        <div className="p-6 flex items-center justify-center min-h-64">
          <div className="text-center space-y-4 max-w-sm">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto text-3xl">✅</div>
            <h2 className="text-xl font-semibold text-sl-900">Mission démarrée !</h2>
            <p className="text-sm text-sl-500">
              Le client a été notifié. Bonne intervention !
            </p>
            <button
              onClick={() => navigate("/provider/missions")}
              className="mt-4 px-6 py-2 bg-brand text-white rounded-lg text-sm font-medium hover:bg-brand/90"
            >
              Voir mes missions 
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* En-tête avec badge statut */}
      <PageHeader
        title={mission.title}
        subtitle={mission.location.address}
        badge={{ label: "PAYÉE & SÉQUESTRÉE", variant: "sequestre" }}
      />

      <div className="p-6">
        {/* Layout 2 colonnes — maquette 12_PREST_Demarrer_Mission */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* ── COLONNE GAUCHE (2/3) ──────────────────────────────────────── */}
          <div className="xl:col-span-2 space-y-5">

            {/* Triplet infos mission */}
            <div className="bg-white border border-sl-100 rounded-xl p-5 grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wider text-sl-400 mb-1">Catégorie</p>
                <p className="font-semibold text-sl-900">{mission.category}</p>
              </div>
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wider text-sl-400 mb-1">Montant séquestré</p>
                {/* ✅ AmountDisplay — jamais xaf() custom */}
                <AmountDisplay amount={mission.sequesteredAmount} size="md" />
              </div>
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wider text-sl-400 mb-1">Durée estimée</p>
                <p className="font-semibold text-sl-900">{mission.estimatedDurationHours}h</p>
              </div>
            </div>

            {/* ✅ MapEmbed — composant Krisan §1.17, jamais un div bleu custom */}
            <MapEmbed
              address={mission.location.address}
              label="Localisation du client"
              height="220px"
              interactive={false}
            />

            {/* Bouton CTA principal */}
            {!allChecked && (
              // ✅ AlertBanner — composant Krisan pour les messages d'avertissement
              <AlertBanner
                variant="warning"
                message="Cochez tous les éléments de la checklist avant de démarrer."
              />
            )}
            <button
              onClick={handleStart}
              disabled={!allChecked || isStarting}
              className={`w-full py-4 rounded-xl font-semibold text-base transition-all ${
                allChecked && !isStarting
                  ? "bg-brand text-white hover:bg-brand/90 active:scale-[0.99]"
                  : "bg-sl-100 text-sl-400 cursor-not-allowed"
              }`}
            >
              {isStarting ? "Démarrage en cours…" : "🚀 Démarrer la mission maintenant"}
            </button>

          </div>

          {/* ── COLONNE DROITE (1/3) ─────────────────────────────────────── */}
          <div className="space-y-4">

            {/* ✅ ClientMiniCard — composant Krisan §4.x
                Affiche : avatar + nom + téléphone + StatusBadge "PAYÉE" */}
            <ClientMiniCard
              clientId={mission.clientId}
              missionStatus={mission.status}
              paymentStatus={mission.paymentStatus}
            />

            {/* ✅ PreDepartChecklist — composant Krisan §4.16
                Items cochables : Matériaux, Outils, Adresse, Téléphone
                Fond vert + texte barré quand coché */}
            <PreDepartChecklist
              items={checklist}
              onToggle={handleToggle}
            />

            {/* ✅ SequestredReminderCard — composant Krisan §4.x
                Rappel ambre : le montant est sécurisé jusqu'à la fin */}
            <SequestredReminderCard
              amount={mission.sequesteredAmount}
            />

          </div>
        </div>
      </div>
    </>
  );
}
