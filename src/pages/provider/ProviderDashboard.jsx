import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Button,
  StatCard,
  StatusBadge,
  RatingStars,
  AmountDisplay,
  Avatar,
  EmptyState,
<<<<<<< Updated upstream
=======
  AvailabilityToggle,
  AlertBanner,
  SkeletonLoader,
>>>>>>> Stashed changes
  Inbox,
  FileX,
  PageHeader,
} from "../../components/commons";
<<<<<<< Updated upstream
import { AvailabilityToggle } from "../../components/provider/AvailabilityToggle";
=======
import TabBar from "../../components/provider/TabBar";
>>>>>>> Stashed changes
import { getProviderDashboard } from "../../services/providerService";

const DISPONIBILITE = [
  { key: "monday",   label: "Lundi – Vendredi" },
  { key: "saturday", label: "Samedi"           },
  { key: "sunday",   label: "Dimanche"         },
];

const FILTRES = [
  { key: "tous",       label: "Toutes"     },
  { key: "en_cours",   label: "En cours"   },
  { key: "terminee",   label: "Terminées"  },
  { key: "en_attente", label: "En attente" },
];

export default function ProviderDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
const [filtre, setFiltre] = useState("tous");
const [dispo, setDispo] = useState(false);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

 useEffect(() => {
  getProviderDashboard()
    .then((d) => {
      setData(d);
      setDispo(d.profile.isAvailable);
    })
    .catch((err) => {
      console.error(err);
      setError("Impossible de charger le tableau de bord.");
    })
    .finally(() => {
      setLoading(false);
    });
}, []);
  if (loading) {
  return <SkeletonLoader variant="card" count={2} />;
}

if (error) {
  return (
    <AlertBanner
      type="danger"
      title="Erreur"
      message={error}
    />
  );
}

if (!data) {
  return (
    <EmptyState
      icon={<FileX size={40} />}
      title="Aucune donnée disponible"
      subtitle="Le tableau de bord est vide."
    />
  );
}

  const { profile, metrics, recentMissions, availability } = data;

  const missionsFiltrees = filtre === "tous"
    ? recentMissions
    : recentMissions.filter((m) => m.status === filtre);

  return (
    <div className="flex flex-col gap-0 min-h-screen bg-sl-50">

<<<<<<< Updated upstream
      <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-sl-200 bg-white">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-[20px] font-bold text-sl-900 m-0">
            Tableau de bord
          </h1>
          <p className="text-[13px] text-sl-500 m-0 mt-1">{profile.fullName}</p>
        </div>
        <AvailabilityToggle isAvailable={dispo} onChange={setDispo} />
      </div>
=======
      <PageHeader
  title="Tableau de bord"
  subtitle={profile.fullName}
  badge={
    <AvailabilityToggle
      isAvailable={dispo}
      onChange={setDispo}
    />
  }
/>
>>>>>>> Stashed changes

      <div className="flex flex-col gap-6 p-6">

        <div className="grid grid-cols-4 gap-4">
          <StatCard
            label="Missions ce mois"
            value={metrics.missionsThisMonth}
            trend={{ direction: "up", value: metrics.trends.missions.value }}
            trendSubtext={metrics.trends.missions.subtext}
          />
          <StatCard
            label="Gains nets"
            value={`${(metrics.netEarnings / 1000).toFixed(0)}k XAF`}
            trend={{ direction: "up", value: metrics.trends.earnings.value }}
            trendSubtext={metrics.trends.earnings.subtext}
          />
          <StatCard
            label="Note moyenne"
            value={`${metrics.averageRating} / 5`}
            trend={{ direction: "up", value: metrics.trends.rating.value }}
            trendSubtext={metrics.trends.rating.subtext}
          />
          <StatCard
            label="Demandes dispo"
            value={metrics.availableDemandsCount}
          />
        </div>

        <div className="grid grid-cols-[1fr_340px] gap-6 items-start">

          <Card
            title="Missions récentes"
            actions={
              <Button variant="ghost" size="sm" onClick={() => navigate("/provider/missions")}>
                Tout voir
              </Button>
            }
          >
            <TabBar
  tabs={FILTRES}
  activeKey={filtre}
  onChange={setFiltre}
/>

            {missionsFiltrees.length === 0 ? (
              <EmptyState
                icon={<Inbox size={40} strokeWidth={1.5} />}
                title="Aucune mission"
                subtitle="Aucune mission dans cette catégorie pour le moment."
              />
            ) : (
              <div className="flex flex-col gap-2">
                {missionsFiltrees.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center gap-3 p-3 rounded-[var(--radius-md)] bg-sl-50 hover:bg-sl-100 transition-colors duration-150 cursor-pointer"
                  >
                    <Avatar initial={m.title.charAt(0)} size="md" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[14px] text-sl-900 m-0 truncate">{m.title}</p>
                      <div className="flex items-center gap-2 mt-[2px]">
                        <span className="text-[12px] text-sl-400">{m.category}</span>
                        {m.rating && <RatingStars value={m.rating} size="sm" />}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <AmountDisplay amount={m.totalAmount} size="sm" variant="positive" showSign />
                      <StatusBadge variant={m.status} size="sm" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <div className="flex flex-col gap-4">

            <Card title="Disponibilité">
              <div className="flex flex-col gap-3">
                {DISPONIBILITE.map(({ key, label }) => {
                  const jour = availability[key];
                  return (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-[13px] text-sl-700 font-medium">{label}</span>
                      {jour.available
                        ? <StatusBadge variant="disponible" size="sm" >{jour.start}-{jour.end}</StatusBadge>
                        : <StatusBadge variant="indisponible" size="sm" />
                      }
                    </div>
                  );
                })}
              </div>
            </Card>

            <Card title="Gains du mois">
              <div className="flex flex-col gap-1">
                <AmountDisplay amount={metrics.netEarnings} size="xl" variant="positive" />
                <p className="text-[12px] text-sl-400 m-0">Revenus nets ce mois-ci</p>
              </div>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
}
