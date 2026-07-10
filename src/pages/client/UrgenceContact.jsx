// src/pages/client/UrgenceContact.jsx
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  PageHeader, Card, Avatar, RatingStars, Button,
  StatusBadge, SkeletonLoader, AlertBanner, EmptyState
} from "../../components/commons";
import { Wrench, MapPin, MessageCircle, Clock, Info } from "lucide-react";
import { getUrgencyProviders, getUrgencyContext } from "../../services/clientService";

const SUGGESTIONS = [
  "Bonjour, j'ai une fuite d'eau urgente, pouvez-vous intervenir ?",
  "J'ai un probleme de siphon casse, etes-vous disponible maintenant ?",
  "Mon robinet fuit, besoin d'une intervention rapide.",
];

export default function UrgenceContact() {
  const [searchParams] = useSearchParams();
  const providerId = searchParams.get("providerId");

  const [provider, setProvider] = useState(null);
  const [urgencyContext, setUrgencyContext] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    Promise.all([getUrgencyProviders(), getUrgencyContext()])
      .then(([providersResult, contextResult]) => {
        const list = providersResult.data ?? providersResult;
        const found = list.find((p) => p.id === providerId) ?? list[0];
        setProvider(found);
        setUrgencyContext(contextResult);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [providerId]);

  const handleSend = () => {
    if (!message.trim()) return;
    console.log("Message envoye :", message);
    setSent(true);
  };

  if (loading) return <SkeletonLoader variant="card" count={3} />;
  if (error) return <AlertBanner variant="error" message={error} />;
  if (!provider) return (
    <EmptyState
      title="Prestataire introuvable"
      description="Ce prestataire n'est plus disponible."
    />
  );

  return (
    <div style={{ backgroundColor: "var(--color-sl-100)", minHeight: "100vh" }}>
      <PageHeader
        title={`Contacter ${provider.fullName}`}
        subtitle={`${provider.specialty} · Mode urgence`}
        actions={
          <div className="flex items-center gap-3">
            <StatusBadge variant="disponible" withDot />
            <div className="flex items-center gap-1">
              <RatingStars value={Math.floor(provider.rating)} size="sm" />
              <span className="text-sm font-semibold text-sl-900">{provider.rating}</span>
            </div>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
        <div className="lg:col-span-2 flex flex-col gap-4">
          <Card title="Resume de l'urgence">
            <div className="bg-danger-light border border-danger rounded-[var(--radius-md)] p-3">
              <p className="font-bold text-danger flex items-center gap-2">
                <Wrench size={16} />
                {urgencyContext?.description} — {urgencyContext?.category}
              </p>
              <p className="text-sm text-sl-500 mt-1 flex items-center gap-1">
                <MapPin size={16} />
                {urgencyContext?.location}
              </p>
            </div>
          </Card>

          <Card title="Envoyer un premier message">
            {sent ? (
              <div className="bg-success-light border border-success rounded-[var(--radius-md)] p-4 text-success font-medium">
                Message envoye ! En attente de reponse de {provider.fullName}.
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {SUGGESTIONS.map((s, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setMessage(s)}
                    className="flex items-center gap-2 text-left px-4 py-3 border border-sl-200 rounded-[var(--radius-md)] text-sm text-sl-700 hover:bg-sl-50 transition-colors"
                  >
                    <MessageCircle size={16} className="text-sl-400 shrink-0" />
                    {s}
                  </button>
                ))}

                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ou redigez votre propre message..."
                  rows={3}
                  className="w-full border border-sl-200 rounded-[var(--radius-md)] px-4 py-3 text-sm outline-none focus:border-brand resize-none"
                />

                <div className="flex justify-end">
                  <Button
                    variant="primary"
                    onClick={handleSend}
                    disabled={!message.trim()}
                    className="bg-sl-900 hover:bg-sl-800"
                  >
                    Envoyer
                  </Button>
                </div>

                <div className="flex items-start gap-2 bg-warning-light border border-warning rounded-[var(--radius-md)] px-4 py-3 text-xs text-warning">
                  <Clock size={16} className="shrink-0 mt-[1px]" />
                  <span>Si le prestataire ne repond pas dans 10 minutes, une suggestion d'autres prestataires vous sera envoyee.</span>
                </div>
              </div>
            )}
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <Card title={provider.fullName.toUpperCase()}>
            <div className="flex flex-col items-center gap-3 text-center">
              <Avatar
                initial={provider.avatarInitial}
                name={provider.fullName}
                size="xl"
                bgClass="bg-success-light"
                className="text-success"
              />
              <div>
                <p className="font-bold text-lg text-sl-900">{provider.fullName}</p>
                <div className="flex items-center justify-center gap-1 my-1">
                  <RatingStars value={Math.floor(provider.rating)} size="sm" />
                  <span className="text-sm text-sl-500">{provider.rating}</span>
                </div>
                <p className="text-sm text-sl-500">
                  {provider.completedMissions} missions · {provider.specialty}
                </p>
              </div>
              <div className="w-full bg-success-light border border-success rounded-[var(--radius-md)] px-3 py-2 text-sm text-success font-medium flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-success" />
                Disponible maintenant · {provider.distanceKm} km
              </div>
            </div>
          </Card>

          <Card>
            <div className="bg-info-light rounded-[var(--radius-md)] p-3">
              <p className="text-sm font-bold text-info mb-1 flex items-center gap-1">
                <Info size={16} />
                Mode urgence
              </p>
              <p className="text-xs text-info">
                Aucune demande formelle n'est creee. La mise en relation se fait directement par chat.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
