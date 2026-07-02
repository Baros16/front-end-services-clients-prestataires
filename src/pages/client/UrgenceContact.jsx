// src/pages/client/UrgenceContact.jsx
import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { PageHeader } from "../../components/commons/PageHeader";
import { Card } from "../../components/commons/Card";
import { Avatar } from "../../components/commons/Avatar";
import { RatingStars } from "../../components/commons/RatingStars";
import { Button } from "../../components/commons/Button";
import { StatusBadge } from "../../components/commons/StatusBadge";
import providersData from "../../data/client/mock_providers_search.json";
import { mockUrgencyContext } from "../../data/client/mockNearbyProviders";

const SUGGESTIONS = [
  "Bonjour, j'ai une fuite d'eau urgente, pouvez-vous intervenir ?",
  "J'ai un probleme de siphon casse, etes-vous disponible maintenant ?",
  "Mon robinet fuit, besoin d'une intervention rapide.",
];

export default function UrgenceContact() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const providerId = searchParams.get("providerId");

  const provider = providersData.data.find((p) => p.id === providerId)
    || providersData.data[0];

  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSuggestion = (text) => {
    setMessage(text);
  };

  const handleSend = () => {
    if (!message.trim()) return;
    console.log("Message envoye a", provider.fullName, ":", message);
    setSent(true);
  };

  return (
    <div style={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <PageHeader
        title={`Contacter ${provider.fullName}`}
        subtitle={`${provider.specialty} · Mode urgence`}
        actions={
          <div className="flex items-center gap-3">
            <StatusBadge variant="disponible" withDot />
            <div className="flex items-center gap-1">
              <RatingStars value={Math.floor(provider.rating)} size="sm" />
              <span className="text-sm font-semibold">{provider.rating}</span>
            </div>
          </div>
        }
      />

      <div className="grid grid-cols-3 gap-4 p-6">
        <div className="col-span-2 flex flex-col gap-4">
          <Card title="Resume de l'urgence">
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="font-bold text-red-600">
                🔧 {mockUrgencyContext.description} — {mockUrgencyContext.category}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                📍 {mockUrgencyContext.location}
              </p>
            </div>
          </Card>

          <Card title="Envoyer un premier message">
            {sent ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700 font-medium">
                Message envoye ! En attente de reponse de {provider.fullName}.
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {SUGGESTIONS.map((s, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSuggestion(s)}
                    className="flex items-center gap-2 text-left px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-gray-400">💬</span>
                    {s}
                  </button>
                ))}

                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ou redigez votre propre message..."
                  rows={3}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-brand resize-none"
                />

                <div className="flex justify-end">
                  <Button
                    variant="primary"
                    onClick={handleSend}
                    disabled={!message.trim()}
                    className="!bg-black hover:!bg-gray-900"
                  >
                    Envoyer →
                  </Button>
                </div>

                <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-xs text-amber-700">
                  <span>⏰</span>
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
                bgClass="bg-emerald-100"
                className="!text-emerald-700"
              />
              <div>
                <p className="font-bold text-lg">{provider.fullName}</p>
                <div className="flex items-center justify-center gap-1 my-1">
                  <RatingStars value={Math.floor(provider.rating)} size="sm" />
                  <span className="text-sm text-gray-500">{provider.rating}</span>
                </div>
                <p className="text-sm text-gray-500">
                  {provider.completedMissions} missions · {provider.specialty}
                </p>
              </div>
              <div className="w-full bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-sm text-green-700 font-medium flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400" />
                Disponible maintenant · {provider.distanceKm} km
              </div>
            </div>
          </Card>

          <Card>
            <div className="bg-blue-50 rounded-lg p-3">
              <p className="text-sm font-bold text-blue-700 mb-1">ℹ️ Mode urgence</p>
              <p className="text-xs text-blue-600">
                Aucune demande formelle n'est creee. La mise en relation se fait directement par chat.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
