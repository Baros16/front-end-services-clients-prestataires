// src/pages/client/UrgenceContact.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PageHeader, Card, Button, AlertBanner, Avatar,
} from '../../components/commons';
import { Send, Info, Phone } from '../../components/commons';
import { ProviderInfoCard } from '../../components/client/urgency/ProviderInfoCard';

const PRESET_MESSAGES = [
  "Bonjour, j'ai besoin d'une intervention urgente",
  "Je suis a l'adresse indiquee, pouvez-vous venir rapidement ?",
  "Merci de me rappeler d'urgence au plus vite",
];

const MOCK_PROVIDER = {
  avatarInitial: 'J',
  fullName: 'Jean-Claude M.',
  rating: 4.8,
  missionsCount: 127,
  specialty: 'Plombier agree',
  distance: '0.8 km',
};

export default function UrgenceContact() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sent, setSent] = useState(false);

  const handleSendPreset = (text) => {
    setMessages((prev) => [...prev, { text, isOwn: true }]);
    setSent(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, { text: "Je suis en route, arrivee prevue dans 10 min", isOwn: false }]);
    }, 1200);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { text: input, isOwn: true }]);
    setInput('');
  };

  return (
    <div className="p-6 flex flex-col gap-6">
      <PageHeader title="Contacter un prestataire" subtitle="Intervention urgente" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {!sent && (
            <Card title="Messages pre-rediges">
              <div className="flex flex-col gap-2">
                {PRESET_MESSAGES.map((msg, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendPreset(msg)}
                    className="text-left w-full p-4 rounded-lg text-sm transition-all active:scale-95"
                    style={{ border: '1px solid var(--color-sl-200)', background: 'var(--color-surface-subtle)' }}
                  >
                    "{msg}"
                  </button>
                ))}
              </div>
            </Card>
          )}

          <AlertBanner
            message="Intervention d'urgence - Le prestataire a ete alerte"
            type="warning"
          />

          <AlertBanner
            message="Temps d'intervention estime : 10 minutes"
            type="info"
          />

          {/* Messages */}
          <Card>
            <div className="flex flex-col gap-3 min-h-[200px]">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className="max-w-[75%] px-4 py-3 text-sm leading-relaxed"
                    style={{
                      background: msg.isOwn ? 'var(--color-sl-900)' : 'var(--color-sl-50)',
                      color: msg.isOwn ? 'var(--color-sl-50)' : 'var(--color-sl-800)',
                      borderRadius: msg.isOwn
                        ? 'var(--radius-lg) var(--radius-sm) var(--radius-lg) var(--radius-lg)'
                        : 'var(--radius-sm) var(--radius-lg) var(--radius-lg) var(--radius-lg)',
                      border: msg.isOwn ? 'none' : '1px solid var(--color-sl-200)',
                      fontFamily: 'var(--font-body)',
                    }}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Input */}
          <div className="flex gap-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tapez un message..."
              className="flex-1 px-4 py-3 rounded-lg text-sm outline-none"
              style={{ border: '1px solid var(--color-sl-300)', background: 'var(--color-surface)' }}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <Button variant="primary" size="sm" onClick={handleSend} disabled={!input.trim()}>
              <Send size={16} />
            </Button>
          </div>
        </div>

        {/* Sidebar prestataire */}
        <div className="flex flex-col gap-4">
          <ProviderInfoCard provider={MOCK_PROVIDER} />
          <Card>
            <div className="flex flex-col gap-2">
              <Button variant="secondary" size="sm" className="w-full">
                <Phone size={16} /> Appeler maintenant
              </Button>
              <Button variant="secondary" size="sm" className="w-full">
                <Info size={16} /> Partager ma position
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}