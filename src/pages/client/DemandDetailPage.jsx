// src/pages/client/DemandDetailPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tag, User, FileText, ExternalLink, FileCheck } from 'lucide-react';

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
  MapPin,
  Clock,
} from '../../components/commons';

import ApplicationCard from '../../components/client/demandes/ApplicationCard';
import { getDemandDetail, getDemandApplications } from '../../services/clientService';
import { formatDate } from '../../utils/formatters';

// ── Correspondance statut → variante du badge ─────────────────────────────────
const STATUS_VARIANT = {
  ouverte:    'ouvert',
  en_cours:   'en_cours',
  terminee:   'terminee',
  annulee:    'annulee',
};

/**
 * Statuts pour lesquels les postulants sont visibles.
 * Une demande "en_cours" a déjà un prestataire sélectionné — on n'affiche plus la liste.
 */
const STATUTS_AVEC_POSTULANTS = ['ouverte', 'en_attente'];

/** Label de section interne. */
function SectionLabel({ children }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-wider mb-1.5
                  text-[var(--color-sl-500)] font-[var(--font-display)]">
      {children}
    </p>
  );
}

/**
 * Page de détail d'une demande client.
 * - Statut ouverte / en_attente → affiche la liste des postulants.
 * - Statut en_cours              → affiche un bouton "Voir le devis".
 * - Statut terminee / annulee    → affiche uniquement les infos de la demande.
 */
export default function DemandDetailPage() {
  const { id: demandId } = useParams();
  const navigate = useNavigate();

  const [demand, setDemand]             = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);

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
        // On charge les postulants uniquement si le statut peut en avoir.
        // getDemandDetail est toujours appelé ; getDemandApplications est conditionnel
        // mais on ne connaît pas encore le statut ici → on charge les deux,
        // l'affichage est ensuite contrôlé côté rendu.
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

  // ── État : chargement ─────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <SkeletonLoader variant="text" className="w-40 h-5" />
        <SkeletonLoader variant="card" />
        <SkeletonLoader variant="list" count={3} />
      </div>
    );
  }

  // ── État : erreur ─────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <AlertBanner variant="error" message={error} />
        <Button
          variant="secondary"
          className="mt-4"
          onClick={() => navigate('/client/demandes')}
        >
          Retour à mes demandes
        </Button>
      </div>
    );
  }

  // ── État : vide ───────────────────────────────────────────────────────────
  if (!demand) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <EmptyState
          icon={<FileText size={24} />}
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

  const statusVariant      = STATUS_VARIANT[demand.status] ?? 'en_attente';
  const showApplicants     = STATUTS_AVEC_POSTULANTS.includes(demand.status);
  const showDevisButton    = demand.status === 'en_cours';

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">

      {/* ── En-tête ──────────────────────────────────────────────────────── */}
      <PageHeader
        title="Détail de la demande"
        subtitle={
          <span className="inline-flex items-center gap-2 mt-1">
            <StatusBadge label={demand.status} variant={statusVariant} />
            {demand.urgent && <StatusBadge label="Urgent" variant="urgent" />}
          </span>
        }
        className="mb-6"
      />

      {/* ── Carte demande ────────────────────────────────────────────────── */}
      <Card noPadding className="mb-6">

        {/* Titre de carte = catégorie */}
        {demand.category && (
          <div className="flex items-center gap-2 px-4 sm:px-6 py-3.5
                          border-b border-[var(--color-sl-100)]">
            <Tag size={14} className="shrink-0 text-[var(--color-sl-400)]" />
            <h2 className="text-sm font-semibold
                           text-[var(--color-sl-900)] font-[var(--font-display)]">
              {demand.category.label}
            </h2>
          </div>
        )}

        <div className="p-4 sm:p-6 space-y-5">

          {/* Description */}
          <div>
            <SectionLabel>Description</SectionLabel>
            <p className="text-sm leading-relaxed
                          text-[var(--color-sl-700)] font-[var(--font-body)]">
              {demand.description}
            </p>
          </div>

          <hr className="border-[var(--color-sl-100)]" />

          {/* Grille : budget · date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {demand.estimatedBudget && (
              <div>
                <SectionLabel>Budget estimé</SectionLabel>
                <div className="flex items-center gap-2">
                  <AmountDisplay amount={demand.estimatedBudget.min} size="sm" />
                  <span className="text-sm text-[var(--color-sl-400)]">—</span>
                  <AmountDisplay amount={demand.estimatedBudget.max} size="sm" />
                </div>
              </div>
            )}

            <div>
              <SectionLabel>Créée le</SectionLabel>
              <div className="flex items-center gap-2 text-sm
                              text-[var(--color-sl-600)] font-[var(--font-body)]">
                <Clock size={14} className="shrink-0" />
                <span>{formatDate(demand.createdAt)}</span>
              </div>
            </div>

          </div>

          {/* Photos */}
          {demand.photos?.length > 0 && (
            <>
              <hr className="border-[var(--color-sl-100)]" />
              <div>
                <SectionLabel>Photos ({demand.photos.length})</SectionLabel>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {demand.photos.map((photo, index) => (
                    <a
                      key={photo.id ?? index}
                      href={photo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative aspect-video rounded-lg overflow-hidden
                                 bg-[var(--color-sl-100)] block"
                    >
                      <img
                        src={photo.url}
                        alt={photo.name || `Photo ${index + 1}`}
                        className="w-full h-full object-cover
                                   transition-opacity group-hover:opacity-80"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 flex items-center justify-center
                                      opacity-0 group-hover:opacity-100 transition-opacity
                                      bg-black/20">
                        <ExternalLink size={18} className="text-white drop-shadow" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Localisation */}
          {demand.location && (
            <>
              <hr className="border-[var(--color-sl-100)]" />
              <div>
                <SectionLabel>Localisation</SectionLabel>
                <div className="flex items-start gap-2 mb-3">
                  <MapPin size={16} className="shrink-0 mt-0.5 text-[var(--color-sl-400)]" />
                  <p className="text-sm text-[var(--color-sl-700)] font-[var(--font-body)]">
                    {demand.location.address}
                  </p>
                </div>
                <MapEmbed
                  address={demand.location.address}
                  interactive={false}
                  className="h-44 rounded-lg"
                />
              </div>
            </>
          )}

        </div>
      </Card>

      {/* ── Section conditionnelle selon le statut ───────────────────────────

          ouverte / en_attente → liste des postulants
          en_cours             → bouton vers le devis
          terminee / annulee   → rien (les infos de la demande suffisent)

      ─────────────────────────────────────────────────────────────────────── */}

      {showApplicants && (
        <div>
          <h2 className="text-base font-semibold mb-3
                         text-[var(--color-sl-900)] font-[var(--font-display)]">
            Prestataires intéressés
            {applications.length > 0 && (
              <span className="ml-2 text-sm font-normal text-[var(--color-sl-400)]">
                ({applications.length})
              </span>
            )}
          </h2>

          {applications.length === 0 ? (
            <EmptyState
              icon={<User size={24} />}
              title="Aucun prestataire pour le moment"
              description="Les prestataires intéressés apparaîtront ici dès qu'ils postuleront."
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
      )}

      {showDevisButton && (
        <div className="flex justify-end">
          <Button
            variant="primary"
            onClick={() => navigate(`/client/devis/${demandId}`)}
          >
            <FileCheck size={16} className="mr-2" />
            Voir le devis
          </Button>
        </div>
      )}

    </div>
  );
}