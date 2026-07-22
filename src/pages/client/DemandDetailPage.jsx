// src/pages/client/DemandDetailPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import {
  PageHeader,
  StatusBadge,
  SkeletonLoader,
  EmptyState,
  AlertBanner,
  Button,
  Card,
  MapEmbed,
  AmountDisplay,
  ArrowLeft,
  MapPin,
  Clock,
  AlertTriangle,
} from '../../components/commons';

import ApplicationCard from '../../components/client/demandes/ApplicationCard';
import { getDemandDetail, getDemandApplications } from '../../services/clientService';
import { formatDate } from '../../utils/formatters';

/**
 * Page de détail d'une demande client.
 * Affiche les informations complètes de la demande + la liste des postulants.
 */
export default function DemandDetailPage() {
  const { id: demandId } = useParams();
  const navigate = useNavigate();

  const [demand, setDemand] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!demandId) {
      setError('Aucune demande spécifiée.');
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function loadData() {
      setLoading(true);
      setError(null);

      try {
        const [demandData, appsData] = await Promise.all([
          getDemandDetail(demandId),
          getDemandApplications(demandId),
        ]);

        if (cancelled) return;

        if (!demandData) {
          setError('Demande introuvable.');
          return;
        }

        setDemand(demandData);
        setApplications(appsData);
      } catch (err) {
        if (cancelled) return;
        console.error('[DemandDetailPage] Erreur chargement:', err);
        setError(err?.message || 'Impossible de charger les détails de la demande.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadData();
    return () => { cancelled = true; };
  }, [demandId]);

  // ── États : loading ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <SkeletonLoader variant="text" className="w-48 h-6" />
        <SkeletonLoader variant="card" count={2} />
        <SkeletonLoader variant="card" count={3} />
      </div>
    );
  }

  // ── États : error ────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <AlertBanner variant="error" message={error} />
        <Button
          variant="secondary"
          className="mt-4"
          onClick={() => navigate('/client/demandes')}
        >
          <ArrowLeft size={16} className="mr-1" />
          Retour à mes demandes
        </Button>
      </div>
    );
  }

  // ── États : empty (ne devrait pas arriver si error géré) ─────────────────
  if (!demand) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <EmptyState
          icon="FileText"
          title="Demande introuvable"
          description="Cette demande n'existe pas ou a été supprimée."
          action={
            <Button variant="primary" onClick={() => navigate('/client/demandes')}>
              Mes demandes
            </Button>
          }
        />
      </div>
    );
  }

  // ── Statut ───────────────────────────────────────────────────────────────
  const statusVariant = demand.status === 'ouverte' ? 'ouvert'
    : demand.status === 'en_cours' ? 'en_cours'
    : demand.status === 'terminee' ? 'terminee'
    : demand.status === 'annulee' ? 'annulee'
    : 'en_attente';

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <PageHeader
        title={
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/client/demandes')}
              className="shrink-0"
            >
              <ArrowLeft size={18} />
            </Button>
            <span className="truncate">Détail de la demande</span>
          </div>
        }
        subtitle={
          <div className="flex items-center gap-2 mt-1">
            <StatusBadge label={demand.status} variant={statusVariant} />
            {demand.urgent && (
              <StatusBadge label="Urgent" variant="urgent" />
            )}
          </div>
        }
        className="mb-6"
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 items-start">
        {/* ── Colonne principale ──────────────────────────────────────────── */}
        <div className="space-y-6 min-w-0">
          {/* Description */}
          <Card title="Description" className="p-4">
            <p className="text-sm leading-relaxed"
              style={{ color: 'var(--color-sl-700)', fontFamily: 'var(--font-body)' }}>
              {demand.description}
            </p>
          </Card>

          {/* Photos */}
          {demand.photos && demand.photos.length > 0 && (
            <Card title="Photos" className="p-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {demand.photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="relative aspect-video rounded-lg overflow-hidden bg-sl-100"
                  >
                    <img
                      src={photo.url}
                      alt={photo.name || 'Photo de la demande'}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Localisation */}
          {demand.location && (
            <Card title="Localisation" className="p-4">
              <div className="flex items-start gap-2 mb-3">
                <MapPin size={16} className="shrink-0 mt-0.5"
                  style={{ color: 'var(--color-sl-400)' }} />
                <p className="text-sm"
                  style={{ color: 'var(--color-sl-700)', fontFamily: 'var(--font-body)' }}>
                  {demand.location.address}
                </p>
              </div>
              <MapEmbed
                address={demand.location.address}
                interactive={false}
                height="180px"
              />
            </Card>
          )}

          {/* Postulants */}
          <div>
            <h3 className="text-base font-semibold mb-3"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--color-sl-900)' }}>
              Prestataires intéressés ({applications.length})
            </h3>

            {applications.length === 0 ? (
              <EmptyState
                icon="User"
                title="Aucun prestataire pour le moment"
                description="Les prestataires intéressés apparaîtront ici."
              />
            ) : (
              <div className="space-y-3">
                {applications.map((app) => (
                  <ApplicationCard
                    key={app.id}
                    application={app}
                    demandId={demandId}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Colonne latérale ────────────────────────────────────────────── */}
        <aside className="space-y-4">
          {/* Budget estimé */}
          {demand.estimatedBudget && (
            <Card title="Budget estimé" className="p-4">
              <div className="flex items-center gap-2">
                <AmountDisplay
                  amount={demand.estimatedBudget.min}
                  size="sm"
                />
                <span className="text-sm"
                  style={{ color: 'var(--color-sl-400)' }}>—</span>
                <AmountDisplay
                  amount={demand.estimatedBudget.max}
                  size="sm"
                />
              </div>
            </Card>
          )}

          {/* Catégorie */}
          {demand.category && (
            <Card title="Catégorie" className="p-4">
              <p className="text-sm font-medium"
                style={{ color: 'var(--color-sl-700)', fontFamily: 'var(--font-body)' }}>
                {demand.category.label}
              </p>
            </Card>
          )}

          {/* Dates */}
          <Card title="Informations" className="p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm"
              style={{ color: 'var(--color-sl-600)', fontFamily: 'var(--font-body)' }}>
              <Clock size={14} className="shrink-0" />
              <span>Créée le {formatDate(demand.createdAt)}</span>
            </div>

            {demand.urgent && (
              <div className="flex items-center gap-2 text-sm"
                style={{ color: 'var(--color-urgent)', fontFamily: 'var(--font-body)' }}>
                <AlertTriangle size={14} className="shrink-0" />
                <span>Demande urgente</span>
              </div>
            )}
          </Card>
        </aside>
      </div>
    </div>
  );
}