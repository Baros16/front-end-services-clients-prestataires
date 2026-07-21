// src/pages/client/UrgenceContact.jsx
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  PageHeader, Card, Avatar, RatingStars, Button, Badge,
  SkeletonLoader, AlertBanner, EmptyState, Wrench, MapPin, Info
} from "../../components/commons";
import { getUrgencyProviders, getUrgencyContext } from "../../services/clientService";
import { openConversation, sendMessage } from "../../services/chatService";

const SUGGESTIONS = [
  "Bonjour, j'ai une fuite d'eau urgente, pouvez-vous intervenir ?",
  "J'ai un probleme de siphon casse, etes-vous disponible maintenant ?",
  "Mon robinet fuit, besoin d'une intervention rapide.",
];

export default function UrgenceContact() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const providerId = searchParams.get("providerId");

  const [provider, setProvider] = useState(null);
  const [urgencyContext, setUrgencyContext] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([getUrgencyProviders(), getUrgencyContext()])
      .then(([providersResult, contextResult]) => {
        const list = providersResult.data ?? providersResult;
        const found = list.find((p) => p.id === providerId) ?? list[0];
        setProvider(found);
        setUrgencyContext(contextResult);
      })
      .catch((err) => {
        console.error('[UrgenceContact]', err);
        setError('Impossible de charger les informations. Vérifiez votre connexion.');
      })
      .finally(() => setLoading(false));
  }, [providerId]);

  const handleSend = async () => {
    if (!message.trim() || isSending) return;
    setIsSending(true);
    setSendError(null);
    try {
      const conversation = await openConversation(provider.id);
      await sendMessage(conversation.id, message);
      navigate(`/client/chat/${conversation.id}`);
    } catch (err) {
      console.error('[UrgenceContact] envoi message', err);
      setSendError("Le message n'a pas pu etre envoye. Reessayez.");
      setIsSending(false);
    }
  };

  if (loading) return <SkeletonLoader variant="card" count={2} />;
  if (error) return <AlertBanner variant="error" message={error} />;
  if (!provider) return (
    <EmptyState
      title="Prestataire introuvable"
      description="Ce prestataire n'est plus disponible."
    />
  );

  return (
    <div>
      <PageHeader
        title={`Contacter ${provider.fullName}`}
        subtitle={`${provider.specialty} · Mode urgence`}
        actions={
          <div className="flex items-center gap-2">
            <Badge label="DISPONIBLE" variant="success" withDot />
            <span className="flex items-center gap-1 text-sm font-semibold text-sl-700">
              ★ {provider.rating}
            </span>
          </div>
        }
      />

      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 flex flex-col gap-4">
          <Card title="Resume de l'urgence">
            <div className="bg-danger-light border border-danger rounded-[var(--radius-md)] p-3">
              <p className="font-bold text-danger flex items-center gap-2">
                <Wrench size={16} />
                {urgencyContext?.description}
              </p>
              <p className="text-sm text-sl-500 mt-1 flex items-center gap-1">
                <MapPin size={16} />
                {urgencyContext?.location}
              </p>
            </div>
          </Card>

          <Card title="Envoyer un premier message">
            {sendError && (
              <div className="bg-danger-light border border-danger rounded-[var(--radius-md)] p-3 text-sm text-danger mb-3">
                {sendError}
              </div>
            )}

            <div className="flex flex-col gap-2 mb-3">
              {SUGGESTIONS.map((s) => (
                <Button
                  key={s}
                  variant="ghost"
                  onClick={() => setMessage(s)}
                  disabled={isSending}
                  className="w-full justify-start bg-white border border-sl-200 text-sl-700 font-normal"
                >
                  {s}
                </Button>
              ))}
            </div>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ou redigez votre propre message..."
              rows={3}
              disabled={isSending}
              className="w-full border border-sl-200 rounded-[var(--radius-md)] px-3 py-2 text-sm outline-none focus:border-brand resize-none mb-3 disabled:bg-sl-100"
            />

            <Button
              variant="primary"
              onClick={handleSend}
              disabled={!message.trim() || isSending}
              className="w-full bg-sl-900 hover:bg-sl-800 disabled:opacity-50 mb-3"
            >
              {isSending ? "Envoi en cours..." : "Envoyer"}
            </Button>

            <div className="bg-warning-light border border-warning rounded-[var(--radius-md)] p-3 text-sm text-warning">
              Si le prestataire ne repond pas dans 10 minutes, une suggestion d'autres prestataires vous sera envoyee.
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <Card>
            <div className="flex flex-col items-center text-center gap-2 mb-3">
              <Avatar initial={provider.avatarInitial} name={provider.fullName} size="xl" bgClass="bg-sl-200" className="text-sl-600" />
              <p className="font-bold text-sl-900">{provider.fullName}</p>
              <div className="flex items-center gap-1">
                <RatingStars value={Math.floor(provider.rating)} size="sm" />
                <span className="text-xs text-sl-500">{provider.rating}</span>
              </div>
              <p className="text-xs text-sl-500">{provider.specialty}</p>
            </div>
            <Badge
              label={`Disponible maintenant · ${provider.distanceKm} km`}
              variant="success"
              withDot
              className="w-full justify-center py-2"
            />
          </Card>

          <div className="bg-info-light border border-info rounded-[var(--radius-md)] p-3 text-sm text-info flex gap-2">
            <Info size={16} className="shrink-0 mt-[2px]" />
            <span>
              <strong>Mode urgence</strong> — Aucune demande formelle n'est creee. La mise en relation se fait directement par chat.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
