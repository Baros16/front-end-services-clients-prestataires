// src/components/client/demandes/ApplicationCard.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Avatar,
  Button,
  Card,
  RatingStars,
  Badge,
  MessageCircle,
  Phone,
  CheckCircle,
  Loader2,
} from '../../commons';

import { getOrCreateConversation } from '../../../services/chatService';

/**
 * Carte prestataire postulant sur une demande.
 *
 * Props :
 * - application : objet { id, demandId, provider, conversationId, appliedAt }
 * - demandId     : string — ID de la demande parente
 */
export default function ApplicationCard({ application, demandId }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { provider, conversationId } = application;
  const alreadyHasConversation = Boolean(conversationId);

  async function handleContact() {
    if (alreadyHasConversation) {
      // Conversation déjà existante → navigation directe
      navigate(`/client/chat/${conversationId}`);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const conv = await getOrCreateConversation(provider.id, demandId);
      const newConvId = conv?.id ?? conv?.conversationId ?? null;

      if (!newConvId) {
        throw new Error("Impossible d'ouvrir la conversation.");
      }

      navigate(`/client/chat/${newConvId}`);
    } catch (err) {
      console.error('[ApplicationCard] Erreur contact:', err);
      setError(err?.message || "Une erreur s'est produite. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="p-4">
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <Avatar
          initial={provider.avatarInitial}
          size="md"
          className="shrink-0"
        />

        {/* Infos prestataire */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-sm font-semibold truncate"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--color-sl-900)' }}>
              {provider.fullName}
            </h4>
            {alreadyHasConversation && (
              <Badge variant="info" className="text-[10px]">
                <CheckCircle size={10} className="mr-0.5" />
                Contacté
              </Badge>
            )}
          </div>

          <p className="text-xs mt-0.5"
            style={{ color: 'var(--color-sl-500)', fontFamily: 'var(--font-body)' }}>
            {provider.specialty}
          </p>

          {/* Note et nombre de missions */}
          <div className="flex items-center gap-3 mt-1.5">
            <div className="flex items-center gap-1">
              <RatingStars value={provider.rating} readonly size="sm" showValue />
            </div>
            <span className="text-[11px]"
              style={{ color: 'var(--color-sl-400)' }}>
              {provider.missionCount} missions
            </span>
          </div>
        </div>

        {/* Bouton Contacter */}
        <div className="shrink-0">
          <Button
            variant={alreadyHasConversation ? 'secondary' : 'primary'}
            size="sm"
            onClick={handleContact}
            disabled={loading}
            className="whitespace-nowrap"
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin mr-1" />
                Ouverture...
              </>
            ) : alreadyHasConversation ? (
              <>
                <MessageCircle size={14} className="mr-1" />
                Voir le chat
              </>
            ) : (
              <>
                <MessageCircle size={14} className="mr-1" />
                Contacter
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Erreur */}
      {error && (
        <p className="text-xs mt-2"
          style={{ color: 'var(--color-danger)', fontFamily: 'var(--font-body)' }}>
          {error}
        </p>
      )}

      {/* Téléphone (affiché si déjà en contact) */}
      {alreadyHasConversation && provider.phone && (
        <div className="mt-2 pt-2 border-t"
          style={{ borderColor: 'var(--color-sl-100)' }}>
          <a
            href={`tel:${provider.phone}`}
            className="inline-flex items-center gap-1 text-xs"
            style={{ color: 'var(--color-info)', fontFamily: 'var(--font-body)' }}
          >
            <Phone size={12} />
            {provider.phone}
          </a>
        </div>
      )}
    </Card>
  );
}