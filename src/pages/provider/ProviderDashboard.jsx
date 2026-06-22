// src/pages/provider/ProviderDashboard.jsx
// M4 Kenfack — Semaine 2 — Écran 14 : Dashboard Prestataire

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Composants commons
import {
  PageHeader,
  StatCard,
  Card,
  StatusBadge,
  AmountDisplay,
  DataTable,
  EmptyState,
  SkeletonLoader,
} from '../../components/commons';

// Composant spécifique prestataire
import { AvailabilityToggle } from '../../components/provider/AvailabilityToggle';

// Données mock
import mockDashboard from '../../data/provider/mock_dashboard.json';

// Service
import { getProviderDashboard } from '../../services/providerService';

// ─── COLONNES DU DATATABLE ──────────────────────────────────────────────────
const MISSIONS_COLUMNS = [
  {
    key: 'title',
    header: 'Mission',
    render: (row) => (
      <span className="font-medium text-sl-900">{row.title}</span>
    ),
  },
  {
    key: 'status',
    header: 'Statut',
    render: (row) => {
      return (
        <StatusBadge
          variant={row.status || 'default'}
          size="sm"
        />
      );
    },
  },
  {
    key: 'totalAmount',
    header: 'Montant',
    render: (row) => (
      <AmountDisplay amount={row.totalAmount} currency="XAF" size="sm" />
    ),
  },
  {
    key: 'paymentStatus',
    header: 'Paiement',
    render: (row) => {
      return (
        <StatusBadge
          variant={row.paymentStatus || 'default'}
          size="sm"
        />
      );
    },
  },
];

// =============================================================================
// PAGE PRINCIPALE
// =============================================================================
export default function DashboardPage() {
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAvailable, setIsAvailable] = useState(true);

  // ── CHARGEMENT DES DONNÉES ──────────────────────────────────────────────
  useEffect(() => {
    getProviderDashboard()
      .then((response) => {
        const dashboardData = response?.data ?? response;
        setData(dashboardData);
        setIsAvailable(dashboardData?.profile?.isAvailable ?? false);
      })
      .catch(() => {
        const mockData = mockDashboard.data;
        setData(mockData);
        setIsAvailable(mockData.profile.isAvailable);
      })
      .finally(() => setIsLoading(false));
  }, []);

  // ── ÉTAT CHARGEMENT ──────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <>
        <PageHeader title="Tableau de bord" />
        <div className="p-6 space-y-4">
          <SkeletonLoader variant="metric" count={4} />
          <SkeletonLoader variant="row" count={3} />
        </div>
      </>
    );
  }

  // ✅ Extraction des données
  const { profile, metrics, recentMissions, availability } = data;

  // ─── HELPERS POUR LA DISPONIBILITÉ ──────────────────────────────────────

  /**
   * Convertit un nom de jour en français
   */
  const getDayLabel = (day) => {
    const labels = {
      monday: 'Lundi',
      tuesday: 'Mardi',
      wednesday: 'Mercredi',
      thursday: 'Jeudi',
      friday: 'Vendredi',
      saturday: 'Samedi',
      sunday: 'Dimanche',
    };
    return labels[day] || day;
  };

  /**
   * 🔥 FONCTION CORRIGÉE : Retourne le statut d'un jour
   * 
   * ATTENTION : dayData doit être un objet avec { start, end, available }
   * 
   * @param {Object} dayData - Données du jour
   * @returns {Object} { label, variant }
   */
  const getDayStatus = (dayData) => {
    if (!dayData) {
      return { label: 'EN ATTENTE', variant: 'default' };
    }

    if (dayData.available === false) {
      return { label: 'INDISPONIBLE', variant: 'danger' };
    }

    if (!dayData.start || !dayData.end) {
      return { label: 'EN ATTENTE', variant: 'default' };
    }

    return {
      label: `${dayData.start} - ${dayData.end}`,
      variant: 'success',
    };
  };

  /**
   * Regroupe les jours consécutifs avec les mêmes horaires
   */
  const getAvailabilityGroups = () => {
    const days = [
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
      'sunday',
    ];

    if (!availability) {
      return [];
    }

    const groups = [];
    let currentGroup = [];

    days.forEach((day) => {
      // 🔥 Récupérer les données du jour depuis availability
      const dayData = availability[day];
      const status = getDayStatus(dayData);

      if (currentGroup.length === 0) {
        currentGroup.push({ day, ...status });
      } else {
        const lastStatus = getDayStatus(
          availability[currentGroup[currentGroup.length - 1].day]
        );
        if (status.label === lastStatus.label && status.variant === lastStatus.variant) {
          currentGroup.push({ day, ...status });
        } else {
          groups.push([...currentGroup]);
          currentGroup = [{ day, ...status }];
        }
      }
    });

    if (currentGroup.length > 0) {
      groups.push([...currentGroup]);
    }

    return groups;
  };

  /**
   * Vérifie si TOUS les jours ont des horaires définis
   */
  const isAvailabilityComplete = () => {
    if (!availability) return false;
    const days = [
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
      'sunday',
    ];
    return days.every((day) => {
      const dayData = availability[day];
      return dayData && dayData.available === true && dayData.start && dayData.end;
    });
  };

  // ─── RENDU ──────────────────────────────────────────────────────────────────

  return (
    <>
      {/* En-tête */}
      <PageHeader
        title="Tableau de bord"
        subtitle={`${profile.specialty} • ${profile.completedMissions} missions terminées`}
        actions={
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-[12px] font-semibold ${isAvailable ? 'bg-success-light text-success' : 'bg-danger-light text-danger'}`}>
              {isAvailable ? '✓ Disponible' : '✗ Indisponible'}
            </span>
            <AvailabilityToggle
              isAvailable={isAvailable}
              onChange={setIsAvailable}
            />
          </div>
        }
      />

      <div className="p-6 space-y-6">
        {/* ── MÉTRIQUES ────────────────────────────────────────────────────── */}
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <StatCard
              label="MISSIONS CE MOIS"
              value={metrics.missionsThisMonth}
              trend={metrics.trends.missions}
              trendSubtext={metrics.trends.missions.subtext}
            />

            <StatCard
              label="GAINS NETS"
              value={
                <AmountDisplay
                  amount={metrics.netEarnings}
                  currency="XAF"
                  size="lg"
                />
              }
              trend={metrics.trends.earnings}
              trendSubtext={metrics.trends.earnings.subtext}
            />

            <StatCard
              label="NOTE MOYENNE"
              value={
                <div className="flex items-center gap-1">
                  <span className="text-2xl font-bold text-sl-900">
                    {metrics.averageRating.toFixed(1)}
                  </span>
                  <span className="text-sm text-sl-400">/ 5</span>
                </div>
              }
              trend={metrics.trends.rating}
              trendSubtext={metrics.trends.rating.subtext}
            />

            <StatCard
              label="DEMANDES DISPO"
              value={metrics.availableDemandsCount}
            />
          </div>
        </section>

        {/* ── DISPONIBILITÉ (HORAIRES) ────────────────────────────────────── */}
        <section>
          <Card
            title="⏰ DISPONIBILITÉ"
            actions={
              <div className="flex items-center gap-2">
                {isAvailabilityComplete() ? (
                  <span className="inline-flex items-center gap-2 rounded-full bg-success-light px-3 py-2 text-[12px] font-semibold text-success">
                    ✅ COMPLET
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 rounded-full bg-sl-100 px-3 py-2 text-[12px] font-semibold text-sl-500">
                    ⏳ EN ATTENTE
                  </span>
                )}
              </div>
            }
          >
            <div className="divide-y divide-sl-100">
              {getAvailabilityGroups().length > 0 ? (
                getAvailabilityGroups().map((group, index) => {
                  // Construire le libellé des jours
                  let dayLabel = '';
                  if (group.length === 1) {
                    dayLabel = getDayLabel(group[0].day);
                  } else {
                    const firstDay = getDayLabel(group[0].day);
                    const lastDay = getDayLabel(group[group.length - 1].day);
                    dayLabel = `${firstDay} - ${lastDay}`;
                  }

                  const isPending = group[0].variant === 'default' && group[0].label === 'EN ATTENTE';
                  const badgeClass =
                    group[0].variant === 'success'
                      ? 'bg-success-light text-success'
                      : group[0].variant === 'danger'
                      ? 'bg-danger-light text-danger'
                      : 'bg-sl-100 text-sl-500';

                  return (
                    <div
                      key={index}
                      className={`flex justify-between items-center py-3 px-4 ${
                        isPending ? 'opacity-60' : ''
                      }`}
                    >
                      <span className="font-medium text-sl-700">{dayLabel}</span>
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-[12px] font-semibold ${badgeClass}`}
                      >
                        {group[0].label}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="p-4 text-center text-sl-500">
                  Aucune donnée de disponibilité
                </div>
              )}
            </div>

            {!isAvailabilityComplete() && (
              <div className="mt-4 px-4 py-2 bg-sl-50 rounded text-xs text-sl-500 flex items-center gap-2">
                <span>💡</span>
                <span>
                  Certains horaires ne sont pas encore définis. Mettez à jour
                  vos disponibilités dans votre profil.
                </span>
              </div>
            )}
          </Card>
        </section>

        {/* ── MISSIONS RÉCENTES ────────────────────────────────────────────── */}
        <Card
          title="Missions récentes"
          actions={
            <button
              onClick={() => navigate('/provider/missions')}
              className="text-xs text-blue-600 hover:underline font-medium"
            >
              Voir tout →
            </button>
          }
          noPadding
        >
          <DataTable
            columns={MISSIONS_COLUMNS}
            data={recentMissions.slice(0, 5)}
            keyExtractor={(row) => row.id}
            isLoading={false}
            emptyState={
              <EmptyState
                icon="briefcase"
                title="Aucune mission récente"
                description="Vos missions terminées apparaîtront ici."
              />
            }
          />
        </Card>
      </div>
    </>
  );
}