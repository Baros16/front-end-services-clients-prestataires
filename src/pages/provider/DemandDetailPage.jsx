// src/pages/provider/DemandDetailPage.jsx
import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../components/commons/Button';
import { StatusBadge } from '../../components/commons/StatusBadge';
import { RatingStars } from '../../components/commons/RatingStars';
import { SkeletonLoader } from '../../components/commons/SkeletonLoader';
import { AlertBanner } from '../../components/commons/AlertBanner';
import { PageHeader } from '../../components/commons/PageHeader';
import { Card } from '../../components/commons/Card';
import { MapPin, Clock, ArrowLeft, ChevronRight, Image } from '../../components/commons/Icons';
import { formatBudget } from '../../components/provider/demandedisponible/formatBudget';
import { CATEGORY_DISPLAY } from '../../components/provider/demandedisponible/categoryDisplay';
import { formatRelativeTime } from '../../utils/formatters';
import { getAvailableDemands } from '../../services/providerService';
import { extractDemandsArray } from '../../components/provider/devis/creerDevis.helpers';
import { useAvailableDemands } from '../../hooks/useAvailableDemands';
import { useGeolocation } from '../../hooks/useGeolocation';
import { getDistanceKm } from '../../utils/geo';

// ── Mock clients lookup (en attendant une vraie API) ──
const MOCK_CLIENTS = {
  'usr_cli201': { fullName: 'Marie Kamga', avatarInitial: 'M', rating: 4.5, completedMissions: 12 },
  'usr_cli202': { fullName: 'Paul Tchinda', avatarInitial: 'P', rating: 4.8, completedMissions: 8 },
  'usr_cli203': { fullName: 'Esther Nana', avatarInitial: 'E', rating: 4.2, completedMissions: 5 },
  'usr_cli204': { fullName: 'David Wandji', avatarInitial: 'D', rating: 3.9, completedMissions: 3 },
  'usr_cli205': { fullName: 'Sarah Mbarga', avatarInitial: 'S', rating: 4.6, completedMissions: 15 },
};

function getLocationText(location) {
  if (!location) return null;
  if (typeof location === 'string') return location;
  return location.address ?? location.city ?? JSON.stringify(location);
}

export default function DemandDetailPage() {
  const navigate = useNavigate();
  const { demandeId } = useParams();

  const { lat: providerLat, lng: providerLng } = useGeolocation({ autoRequest: true });
  const { apply, applyingId, toast, dismissToast } = useAvailableDemands(providerLat, providerLng);

  const [demand, setDemand] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Calcul de la distance
  const distanceKm = useMemo(() => {
    if (!demand) return null;
    return getDistanceKm(providerLat, providerLng, demand.location?.lat, demand.location?.lng);
  }, [demand, providerLat, providerLng]);

  // Infos client
  const clientInfo = useMemo(() => {
    if (!demand) return null;
    return MOCK_CLIENTS[demand.clientId] ?? {
      fullName: 'Client',
      avatarInitial: 'C',
      rating: 0,
      completedMissions: 0,
    };
  }, [demand]);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    getAvailableDemands()
      .then((result) => {
        if (!isMounted) return;
        const demandsList = extractDemandsArray(result);
        const found = demandsList.find((d) => d.id === demandeId);
        if (!found) {
          setError("Cette demande n'existe plus ou n'est plus disponible.");
          return;
        }
        setDemand(found);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err?.message || 'Impossible de charger la demande.');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [demandeId]);

  const handleApply = async () => {
    if (!demand) return;
    await apply(demand.id);
  };

  const handleCreateQuote = () => {
    if (demand) {
      navigate(`/provider/devis/nouveau/${demand.id}`, { state: { demand } });
    }
  };

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <SkeletonLoader variant="text" className="mb-6" />
        <SkeletonLoader variant="card" className="mb-4" />
        <SkeletonLoader variant="card" />
      </div>
    );
  }

  if (error || !demand) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <AlertBanner variant="error" message={error || 'Demande introuvable.'} />
        <Button variant="secondary" className="mt-4" onClick={() => navigate('/provider/demandes')}>
          Retour aux demandes
        </Button>
      </div>
    );
  }

  const { Icon, bgVar } =
    CATEGORY_DISPLAY[demand.category?.iconKey] ?? CATEGORY_DISPLAY.default;

  return (
    <div className="flex flex-col h-full bg-sl-50">
      <PageHeader
        title="Détail de la demande"
        subtitle={demand.category?.label}
        actions={
          <Button variant="ghost" size="sm" onClick={() => navigate('/provider/demandes')}>
            <ArrowLeft size={16} className="mr-1" />
            Retour
          </Button>
        }
        className="mb-4"
      />

      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-3xl mx-auto flex flex-col gap-6">
          {/* ── En-tête : Catégorie + badges ── */}
          <div className="flex items-center gap-3 flex-wrap">
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-[var(--radius-sm)]"
              style={{ background: bgVar }}
            >
              <Icon size={20} strokeWidth={1.8} className="text-[var(--color-sl-700)]" />
              <span className="text-sm font-semibold text-[var(--color-sl-900)] font-[family-name:var(--font-body)]">
                {demand.category?.label}
              </span>
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {demand.urgent && <StatusBadge variant="urgent" size="sm" />}
              <StatusBadge variant="ouvert" size="sm" />
            </div>
          </div>

          {/* ── Carte Client ── */}
          <Card className="p-5 sm:p-6">
            <h2 className="font-display text-sm font-semibold tracking-wide text-sl-500 uppercase mb-4">
              Client
            </h2>
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 shrink-0 rounded-full bg-brand-xlight text-brand flex items-center justify-center font-display font-bold text-lg">
                {clientInfo.avatarInitial}
              </div>
              <div className="min-w-0">
                <p className="font-display font-semibold text-sl-900 truncate">{clientInfo.fullName}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <RatingStars value={clientInfo.rating} size="sm" />
                  <span className="text-xs font-semibold text-sl-500">{clientInfo.rating}</span>
                </div>
                <p className="text-xs text-sl-400 mt-0.5">
                  {clientInfo.completedMissions} mission{clientInfo.completedMissions > 1 ? 's' : ''} réalisée{clientInfo.completedMissions > 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </Card>

          {/* ── Description ── */}
          <div className="bg-white rounded-[var(--radius-lg)] p-5 sm:p-6 shadow-sm border border-sl-100">
            <p className="text-xs font-semibold uppercase tracking-widest mb-2 text-sl-400">
              Description
            </p>
            <p className="text-sm leading-relaxed text-sl-700 font-[family-name:var(--font-body)]">
              {demand.description}
            </p>
          </div>

          {/* ── Budget ── */}
          <div className="bg-white rounded-[var(--radius-lg)] p-5 sm:p-6 shadow-sm border border-sl-100">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-widest text-sl-400">
                Budget estimé
              </span>
              <span className="text-2xl font-bold text-sl-900 font-[family-name:var(--font-display)]">
                {formatBudget(demand)}
              </span>
            </div>
          </div>

          {/* ── Grille d'infos ── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-[var(--radius-lg)] p-4 shadow-sm border border-sl-100 flex flex-col items-center gap-2">
              <MapPin size={20} className="text-sl-500" />
              <span className="text-lg font-semibold text-sl-900">
                {distanceKm != null ? `${distanceKm} km` : '—'}
              </span>
              <span className="text-xs text-sl-400">Distance</span>
            </div>

            <div className="bg-white rounded-[var(--radius-lg)] p-4 shadow-sm border border-sl-100 flex flex-col items-center gap-2">
              <RatingStars value={demand.clientRating ?? clientInfo.rating} size="md" />
              <span className="text-lg font-semibold text-sl-900">
                {demand.clientRating ?? clientInfo.rating ?? '—'}
              </span>
              <span className="text-xs text-sl-400">Note client</span>
            </div>

            <div className="bg-white rounded-[var(--radius-lg)] p-4 shadow-sm border border-sl-100 flex flex-col items-center gap-2">
              <Clock size={20} className="text-sl-500" />
              <span className="text-lg font-semibold text-sl-900">
                {formatRelativeTime(demand.createdAt)}
              </span>
              <span className="text-xs text-sl-400">Publié</span>
            </div>
          </div>

          {/* ── Localisation ── */}
          {getLocationText(demand.location) && (
            <div className="bg-white rounded-[var(--radius-lg)] p-5 sm:p-6 shadow-sm border border-sl-100">
              <p className="text-xs font-semibold uppercase tracking-widest mb-2 text-sl-400">
                Localisation
              </p>
              <p className="text-sm flex items-center gap-1.5 text-sl-700">
                <MapPin size={14} className="text-sl-400 shrink-0" />
                {getLocationText(demand.location)}
              </p>
            </div>
          )}

          {/* ── Photos ── */}
          {demand.photos && demand.photos.length > 0 && (
            <div className="bg-white rounded-[var(--radius-lg)] p-5 sm:p-6 shadow-sm border border-sl-100">
              <p className="text-xs font-semibold uppercase tracking-widest mb-3 text-sl-400">
                Photos ({demand.photos.length})
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {demand.photos.map((photo, index) => (
                  <div key={index} className="aspect-square rounded-[var(--radius-md)] overflow-hidden bg-sl-100">
                    {typeof photo === 'string' ? (
                      <img
                        src={photo}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = `<div class="flex items-center justify-center w-full h-full text-sl-400"><svg class="w-8 h-8" stroke="currentColor" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg></div>`;
                        }}
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full text-sl-400">
                        <Image size={32} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Informations supplémentaires ── */}
          {demand.additionalInfo && (
            <div className="bg-white rounded-[var(--radius-lg)] p-5 sm:p-6 shadow-sm border border-sl-100">
              <p className="text-xs font-semibold uppercase tracking-widest mb-2 text-sl-400">
                Informations complémentaires
              </p>
              <p className="text-sm leading-relaxed text-sl-700">
                {demand.additionalInfo}
              </p>
            </div>
          )}

          {/* ── Actions ── */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2 pb-8">
            <Button
              variant="primary"
              size="lg"
              onClick={handleApply}
              disabled={applyingId === demand.id}
              className="flex-1 justify-center"
            >
              {applyingId === demand.id ? 'Envoi en cours...' : 'Postuler à cette demande'}
            </Button>
            <Button
              variant="dark"
              size="lg"
              onClick={handleCreateQuote}
              className="flex-1 justify-center"
            >
              Créer un devis
              <ChevronRight size={18} className="ml-1" />
            </Button>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <div className={`px-4 py-3 rounded-lg shadow-lg text-sm font-medium ${
            toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
          }`}>
            {toast.message}
            <button className="ml-3 text-white/80 hover:text-white" onClick={dismissToast}>×</button>
          </div>
        </div>
      )}
    </div>
  );
}