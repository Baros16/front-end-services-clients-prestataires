import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../../components/commons/Card";
import { Button } from "../../components/commons/Button";
import { StatCard } from "../../components/commons/StatCard";
import { StatusBadge } from "../../components/commons/StatusBadge";
import { RatingStars } from "../../components/commons/RatingStars";
import { AmountDisplay } from "../../components/commons/AmountDisplay";
import { Avatar } from "../../components/commons/Avatar";
import { EmptyState } from "../../components/commons/EmptyState";
import { AvailabilityToggle } from "../../components/provider/AvailabilityToggle";
import mockData from "../../data/provider/mock_dashboard.json";

const { profile, metrics, recentMissions, availability } = mockData.data;

const JOURS = [
  { key: "monday",    label: "Lundi – Vendredi" },
  { key: "saturday",  label: "Samedi" },
  { key: "sunday",    label: "Dimanche" },
];

const FILTRES = [
  { key: "tous",        label: "Toutes" },
  { key: "en_cours",   label: "En cours" },
  { key: "terminee",   label: "Terminées" },
  { key: "en_attente", label: "En attente" },
];

export default function ProviderDashboard() {
  const navigate = useNavigate();
  const [filtre, setFiltre] = useState("tous");

  const missionsFiltrees = filtre === "tous"
    ? recentMissions
    : recentMissions.filter((m) => m.status === filtre);

  return (
    <div className="flex flex-col gap-6 p-6 bg-sl-50 min-h-screen">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-[20px] font-bold text-sl-900 m-0">
            Tableau de bord
          </h1>
          <p className="text-[13px] text-sl-500 m-0 mt-1">
            {new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
        <AvailabilityToggle isAvailable={profile.isAvailable} />
      </div>

      <div className="grid grid-cols-4 gap-4">
        <StatCard
          label="Missions ce mois"
          value={metrics.missionsThisMonth}
          trend={metrics.trends.missions.subtext}
          trendDir="up"
        />
        <StatCard
          label="Gains nets"
          value={`${(metrics.netEarnings / 1000).toFixed(0)}k XAF`}
          trend={metrics.trends.earnings.subtext}
          trendDir="up"
        />
        <StatCard
          label="Note moyenne"
          value={`${metrics.averageRating} / 5`}
          trend={metrics.trends.rating.subtext}
          trendDir="up"
        />
        <StatCard
          label="Demandes dispo"
          value={metrics.availableDemandsCount}
        />
      </div>

      <div className="grid grid-cols-[1fr_360px] gap-6 items-start">

        <Card
          title="Missions récentes"
          actions={
            <Button variant="ghost" size="sm" onClick={() => navigate("/provider/missions")}>
              Tout voir
            </Button>
          }
        >
          <div className="flex gap-2 mb-4">
            {FILTRES.map((f) => (
              <button
                key={f.key}
                onClick={() => setFiltre(f.key)}
                className={`px-3 py-1 rounded-full text-[12px] font-semibold transition-all duration-150 cursor-pointer border-none
                  ${filtre === f.key
                    ? "bg-brand text-white"
                    : "bg-sl-100 text-sl-500 hover:bg-sl-200"
                  }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {missionsFiltrees.length === 0 ? (
            <EmptyState
              icon="📭"
              title="Aucune mission"
              subtitle="Aucune mission dans cette catégorie pour le moment."
            />
          ) : (
            <div className="flex flex-col gap-2">
              {missionsFiltrees.map((mission) => (
                <div
                  key={mission.id}
                  className="flex items-center gap-3 p-3 rounded-[var(--radius-md)] bg-sl-50 hover:bg-sl-100 transition-colors duration-150 cursor-pointer"
                >
                  <Avatar
                    initial={mission.title.charAt(0)}
                    size="md"
                    bgClass="bg-brand-xlight"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[14px] text-sl-900 m-0 truncate">
                      {mission.title}
                    </p>
                    <div className="flex items-center gap-2 mt-[2px]">
                      <span className="text-[12px] text-sl-400">{mission.category}</span>
                      {mission.rating && (
                        <RatingStars value={mission.rating} size="sm" />
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <AmountDisplay
                      amount={mission.totalAmount}
                      size="sm"
                      variant="positive"
                      showSign
                    />
                    <StatusBadge variant={mission.status} size="sm" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <div className="flex flex-col gap-4">

          <Card title="Disponibilité">
            <div className="flex flex-col gap-3">
              {JOURS.map(({ key, label }) => {
                const jour = availability[key];
                return (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-[13px] text-sl-700 font-medium">{label}</span>
                    {jour.available ? (
                      <StatusBadge variant="disponible" size="sm">
                        {jour.start}–{jour.end}
                      </StatusBadge>
                    ) : (
                      <StatusBadge variant="indisponible" size="sm" />
                    )}
                  </div>
                );
              })}
            </div>
          </Card>

          <Card title="Gains du mois">
            <div className="flex flex-col gap-1">
              <AmountDisplay
                amount={metrics.netEarnings}
                size="xl"
                variant="positive"
              />
              <p className="text-[12px] text-sl-400 m-0">Revenus nets ce mois-ci</p>
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
}
