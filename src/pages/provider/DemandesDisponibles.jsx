// src/pages/provider/DemandesDisponibles.jsx
// TODO Semaine 2 — M3

import { useState } from "react";

// Composants communs (fichiers existants)
import { PageHeader } from "../../components/commons/PageHeader";
import { TabBar }         from "../../components/commons/TabBar";
import { SkeletonLoader }  from "../../components/commons/SkeletonLoader";

// ===================== DONNÉES MOCK =====================

const mockUser = {
  initial: "J",
  name: "Jean-Claude M.",
  subtitle: "Plombier · ★ 4.8",
};

const mockNavItems = [
  { id: "dashboard", label: "Tableau de bord",    icon: "🏠" },
  { id: "demandes",  label: "Demandes dispo",     icon: "🔍", count: 11 },
  { id: "missions",  label: "Mes missions",       icon: "💼" },
  { id: "devis",     label: "Mes devis",          icon: "📄" },
  { id: "gains",     label: "Gains & historique", icon: "📊" },
  { id: "profil",    label: "Mon profil",         icon: "👤" },
];

const mockDemands = [
  {
    id: "1",
    category: { id: "plomberie", label: "Plomberie",   icon: "🔧", color: "#DBEAFE" },
    description: "Fuite sous l'évier de la cuisine, eau qui s'écoule en permanence",
    budgetMin: 20000, budgetMax: 30000,
    distanceKm: 0.8, clientRating: 4.2,
    postedAgo: "Il y a 5 min", isUrgent: true, status: "open",
  },
  {
    id: "2",
    category: { id: "electricite", label: "Électricité", icon: "⚡", color: "#FEF9C3" },
    description: "Remplacement tableau électrique général appartement T3",
    budgetMin: 50000, budgetMax: 80000,
    distanceKm: 1.5, clientRating: 3.9,
    postedAgo: "Il y a 20 min", isUrgent: false, status: "open",
  },
  {
    id: "3",
    category: { id: "menage", label: "Ménage", icon: "🧹", color: "#D1FAE5" },
    description: "Grand ménage complet appartement 3 pièces avant état des lieux",
    budgetMin: 10000, budgetMax: 15000,
    distanceKm: 2.1, clientRating: 4.7,
    postedAgo: "Il y a 1h", isUrgent: false, status: "open",
  },
  {
    id: "4",
    category: { id: "serrurerie", label: "Serrurerie", icon: "🔑", color: "#E0E7FF" },
    description: "Remplacement serrure porte principale, 3 points de fermeture",
    budgetMin: 15000, budgetMax: 25000,
    distanceKm: 2.8, clientRating: 4.5,
    postedAgo: "Il y a 2h", isUrgent: false, status: "open",
  },
  {
    id: "5",
    category: { id: "peinture", label: "Peinture", icon: "🎨", color: "#FCE7F3" },
    description: "Peinture salon 25m², couleur souhaitée : blanc cassé",
    budgetMin: 25000, budgetMax: 40000,
    distanceKm: 3.2, clientRating: 4.0,
    postedAgo: "Il y a 3h", isUrgent: false, status: "open",
  },
  {
    id: "6",
    category: { id: "plomberie", label: "Plomberie", icon: "🔧", color: "#DBEAFE" },
    description: "Robinet cuisine qui goutte, remplacement cartouche",
    budgetMin: 8000, budgetMax: 12000,
    distanceKm: 3.5, clientRating: 4.8,
    postedAgo: "Il y a 4h", isUrgent: false, status: "open",
  },
];

// ===================== COMPOSANTS LOCAUX =====================

// Affiche le badge icône + label d'une catégorie de service
function ServiceCategoryCard({ category }) {
  return (
    <div
      className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-semibold text-gray-800"
      style={{ backgroundColor: category.color }}
    >
      <span>{category.icon}</span>
      <span>{category.label}</span>
    </div>
  );
}

function StatusBadge({ label, variant }) {
  const variants = {
    urgent:       "bg-red-100 text-red-800 border border-red-300",
    open:         "bg-green-100 text-green-800 border border-green-300",
    disponible:   "bg-green-50 text-green-700 border border-green-500",
    indisponible: "bg-red-50 text-red-600 border border-red-400",
  };
  return (
    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide ${variants[variant] ?? variants.open}`}>
      {label}
    </span>
  );
}

function StarRating({ value, maxStars = 5 }) {
  return (
    <span className="flex items-center gap-0.5 text-[12px]">
      {Array.from({ length: maxStars }).map((_, i) => (
        <span key={i} className={i < Math.round(value) ? "text-amber-400" : "text-gray-200"}>★</span>
      ))}
      <span className="ml-1 text-gray-400">{value.toFixed(1)}</span>
    </span>
  );
}

function AvailabilityToggle({ isAvailable, onToggle }) {
  return (
    <button
      onClick={() => onToggle(!isAvailable)}
      className={[
        "flex items-center gap-2 rounded-full border px-3 py-1.5 text-[12px] font-semibold transition-colors sm:px-3.5 sm:text-[13px]",
        isAvailable
          ? "border-green-600 bg-green-50 text-green-700 hover:bg-green-100"
          : "border-red-400 bg-red-50 text-red-600 hover:bg-red-100",
      ].join(" ")}
    >
      <span className={`h-2 w-2 rounded-full ${isAvailable ? "animate-pulse bg-green-500" : "bg-red-400"}`} />
      {isAvailable ? "Disponible" : "Indisponible"}
    </button>
  );
}

function DemandCard({ demand, onViewDetails, onApply }) {
  const formatBudget = (min, max) => {
    const fmt = (n) => (n >= 1000 ? `${n / 1000}k` : n);
    return `~${fmt(min)}-${fmt(max)} XAF`;
  };

  return (
    <div className="flex flex-col gap-2.5 rounded-xl border border-gray-100 bg-white p-4 transition-all hover:border-gray-300 hover:shadow-sm">

      {/* En-tête : catégorie + badges */}
      <div className="flex items-center justify-between">
        <ServiceCategoryCard category={demand.category} />
        <div className="flex flex-wrap justify-end gap-1.5">
          {demand.isUrgent && <StatusBadge label="URGENT" variant="urgent" />}
          <StatusBadge label="OUVERTE" variant="open" />
        </div>
      </div>

      {/* Description */}
      <p className="text-[12.5px] leading-relaxed text-gray-500">{demand.description}</p>

      {/* Budget */}
      <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
        <span className="text-[11px] text-gray-400">Budget estimé</span>
        <span className="text-[12px] font-semibold text-gray-900">
          {formatBudget(demand.budgetMin, demand.budgetMax)}
        </span>
      </div>

      {/* Distance + Rating */}
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1 text-[12px] text-gray-400">
          <span className="text-red-400">📍</span>
          {demand.distanceKm} km
        </span>
        <StarRating value={demand.clientRating} />
      </div>

      {/* Ancienneté */}
      <p className="text-[11px] text-gray-300">{demand.postedAgo}</p>

      {/* Actions */}
      <div className="mt-1 flex gap-2">
        <button
          onClick={() => onViewDetails(demand.id)}
          className="flex-1 rounded-lg border border-gray-200 bg-white py-1.5 text-[12.5px] font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          Voir détails
        </button>
        <button
          onClick={() => onApply(demand.id)}
          className="flex flex-[1.2] items-center justify-center gap-1 rounded-lg bg-gray-900 py-1.5 text-[12.5px] font-semibold text-white transition-colors hover:bg-gray-700"
        >
          Postuler →
        </button>
      </div>
    </div>
  );
}

// ===================== PAGE PRINCIPALE =====================

export default function DemandesDisponibles() {
  const [activeNavItem, setActiveNavItem] = useState("demandes");
  const [activeZone, setActiveZone]       = useState("priority");
  const [isAvailable, setIsAvailable]     = useState(true);
  const [applyingId, setApplyingId]         = useState(null);
  const tabs = [
    { id: "priority", label: "Zone prioritaire", count: 3 },
    { id: "extended", label: "Zones éloignées",  count: 8 },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* Contenu principal */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <PageHeader
          title="Demandes disponibles"
          subtitle="Demandes correspondant à vos compétences"
          actions={
            <>
              <button className="hidden items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3.5 py-1.5 text-[13px] font-medium text-gray-700 hover:bg-gray-50 sm:flex">
                Filtrer
              </button>

              <AvailabilityToggle isAvailable={isAvailable} onToggle={setIsAvailable} />
            </>
          }
        />

        <TabBar tabs={tabs} activeTabId={activeZone} onChange={setActiveZone} />

        <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6">
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-3">
            {mockDemands.map((demand) =>
              applyingId === demand.id ? (
                <SkeletonLoader key={demand.id} variant="card" count={1} />
              ) : (
                <DemandCard
                  key={demand.id}
                  demand={demand}
                  onViewDetails={(id) => alert(`Voir détails #${id}`)}
                  onApply={(id) => {
                    setApplyingId(id);
                    setTimeout(() => setApplyingId(null), 2000);
                  }}
                />
              )
            )}
          </div>
        </div>
      </div>

    </div>
  );
}