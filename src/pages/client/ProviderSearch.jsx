// src/pages/client/ProviderSearch.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/commons/PageHeader';
import { SearchInput } from '../../components/commons/SearchInput';
import { SkeletonLoader } from '../../components/commons/SkeletonLoader';
import { EmptyState } from '../../components/commons/EmptyState';
import { AlertBanner } from '../../components/commons/AlertBanner';
import { Card } from '../../components/commons/Card';
import { Button } from '../../components/commons/Button';
import { RatingStars } from '../../components/commons/RatingStars';
import { StatusBadge } from '../../components/commons/StatusBadge';
import { MapPin, Star, MessageCircle, Search, ChevronRight } from '../../components/commons/Icons';
import { searchProviders } from '../../services/clientService';
import { openConversation } from '../../services/chatService';

function ProviderCard({ provider, onContact }) {
  return (
    <Card noPadding>
      <div className="flex flex-col gap-3 p-4">
        {/* ── En-tête : Avatar + nom + disponibilité ── */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 shrink-0 rounded-full bg-brand-xlight text-brand flex items-center justify-center font-display font-bold text-lg">
            {provider.avatarInitial}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-display font-semibold text-sl-900 truncate">
                {provider.fullName}
              </h3>
              <StatusBadge
                variant={provider.isAvailable ? 'disponible' : 'indisponible'}
                size="sm"
                withDot
              />
            </div>
            <p className="text-sm text-sl-500 mt-0.5">{provider.specialty}</p>
          </div>
        </div>

        {/* ── Grille d'infos : note, missions, distance ── */}
        <div className="flex items-center justify-between px-3 py-2 bg-[var(--color-sl-50)] rounded-[var(--radius-md)]">
          <div className="flex items-center gap-1">
            <RatingStars value={provider.rating} size="sm" />
            <span className="text-xs font-semibold text-sl-600">{provider.rating}</span>
          </div>
          <span className="text-xs text-sl-400">
            {provider.completedMissions} mission{provider.completedMissions > 1 ? 's' : ''}
          </span>
          <span className="text-xs flex items-center gap-1 text-sl-400">
            <MapPin size={12} />
            {provider.distanceKm} km
          </span>
        </div>

        {/* ── Tarif horaire ── */}
        <div className="flex items-center justify-between px-3 py-2 bg-[var(--color-sl-50)] rounded-[var(--radius-md)]">
          <span className="text-xs text-sl-400">Tarif horaire</span>
          <span className="text-sm font-semibold text-sl-900 font-[family-name:var(--font-display)]">
            {provider.hourlyRate?.toLocaleString()} FCFA/h
          </span>
        </div>

        {/* ── Boutons d'action ── */}
        <div className="flex gap-2 pt-2 mt-auto border-t border-[var(--color-sl-100)]">
          <Button
            variant="ghost"
            size="md"
            onClick={() => {/* Voir profil */}}
            className="flex-1"
          >
            Voir profil
          </Button>
          <Button
            variant="dark"
            size="md"
            onClick={() => onContact(provider)}
            className="flex-1"
          >
            <span className="flex items-center gap-1 justify-center">
              <MessageCircle size={16} />
              Contacter
            </span>
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default function ProviderSearch() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    searchProviders()
      .then((result) => {
        setProviders(result.data ?? []);
      })
      .catch((err) => {
        setError(err?.message || 'Impossible de charger les prestataires.');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleContact = async (provider) => {
    try {
      const conv = await openConversation(provider.id);
      if (conv?.id) {
        navigate(`/client/chat/${conv.id}`);
      }
    } catch (err) {
      console.error('Erreur lors de la création de la conversation:', err);
    }
  };

  const filteredProviders = providers.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.fullName.toLowerCase().includes(q) ||
      p.specialty.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex flex-col h-full bg-sl-50">
      <PageHeader
        title="Rechercher un prestataire"
        subtitle="Trouvez le professionnel qu'il vous faut"
        actions={
          <Button variant="ghost" size="sm" onClick={() => navigate('/client/dashboard')}>
            Retour
          </Button>
        }
        className="mb-4"
      />

      <div className="px-4 sm:px-6 lg:px-8 pb-4">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Rechercher par nom ou spécialité..."
        />
      </div>

      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 pb-6">
        {error && (
          <div className="mb-4">
            <AlertBanner variant="error" message={error} />
          </div>
        )}

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonLoader key={i} variant="card" />
            ))}
          </div>
        )}

        {!loading && filteredProviders.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProviders.map((provider) => (
              <ProviderCard
                key={provider.id}
                provider={provider}
                onContact={handleContact}
              />
            ))}
          </div>
        )}

        {!loading && filteredProviders.length === 0 && !error && (
          <EmptyState
            icon={<Search size={40} strokeWidth={1.5} />}
            title="Aucun prestataire trouvé"
            description={
              searchQuery.trim()
                ? `Aucun résultat pour "${searchQuery}". Essayez un autre terme.`
                : 'Aucun prestataire disponible pour le moment.'
            }
            action={
              <Button variant="primary" size="md" onClick={() => navigate('/client/nouvelle-demande')}>
                Publier une demande
              </Button>
            }
          />
        )}
      </div>
    </div>
  );
}