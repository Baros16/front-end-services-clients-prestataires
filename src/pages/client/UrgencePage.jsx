// src/pages/client/UrgencePage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PageHeader, Card, Button, SkeletonLoader,
} from '../../components/commons';
import { Phone, AlertTriangle, Wrench, Zap, Key } from '../../components/commons';
import { UrgentProviderCard } from '../../components/client/urgency/UrgentProviderCard';

const URGENCY_TYPES = [
  { id: 'plomberie', label: 'Plomberie', icon: <Wrench size={24} />, color: 'var(--color-cat-plomberie)' },
  { id: 'electricite', label: 'Electricite', icon: <Zap size={24} />, color: 'var(--color-cat-electricite)' },
  { id: 'serrurerie', label: 'Serrurerie', icon: <Key size={24} />, color: 'var(--color-cat-serrurerie)' },
  { id: 'autre', label: 'Autre urgence', icon: <AlertTriangle size={24} />, color: 'var(--color-cat-autre)' },
];

const MOCK_PROVIDERS = [
  { id: '1', initial: 'J', name: 'Jean-Claude M.', specialty: 'Plombier', distance: '0.8 km', rate: 3500, status: 'disponible' },
  { id: '2', initial: 'P', name: 'Pierre Fomba', specialty: 'Plombier', distance: '1.2 km', rate: 3000, status: 'disponible' },
  { id: '3', initial: 'G', name: 'Gaetan Nguema', specialty: 'Plombier', distance: '2.5 km', rate: 2800, status: 'sous_30_min' },
];

export default function UrgencePage() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState(null);
  const [searching, setSearching] = useState(false);
  const [found, setFound] = useState(false);

  const handleSearch = async () => {
    if (!selectedType) return;
    setSearching(true);
    await new Promise((r) => setTimeout(r, 1500));
    setFound(true);
    setSearching(false);
  };

  const handleContact = (providerId) => {
    navigate('/client/urgence/contact');
  };

  return (
    <div className="p-6 flex flex-col gap-6">
      <PageHeader title="Mode Urgence" subtitle="Besoin d'un intervenant immediat ?" />

      {/* Bouton d'urgence */}
      <div className="flex justify-center">
        <button
          onClick={() => navigate('/client/urgence/contact')}
          className="w-32 h-32 rounded-full flex flex-col items-center justify-center gap-2 shadow-lg animate-pulse transition-transform active:scale-95"
          style={{ background: 'var(--color-urgent)' }}
        >
          <Phone size={36} className="text-white" />
          <span className="text-white text-sm font-bold">URGENCE</span>
        </button>
      </div>

      <Card title="Type d'urgence">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {URGENCY_TYPES.map((type) => (
            <button
              key={type.id}
              onClick={() => { setSelectedType(type.id); setFound(false); }}
              className="flex flex-col items-center gap-2 p-4 rounded-xl transition-all active:scale-95"
              style={{
                border: `2px solid ${selectedType === type.id ? type.color : 'var(--color-sl-200)'}`,
                background: selectedType === type.id ? `${type.color}15` : 'var(--color-surface)',
              }}
            >
              <span style={{ color: type.color }}>{type.icon}</span>
              <span className="text-xs font-semibold text-center" style={{ color: 'var(--color-sl-700)' }}>
                {type.label}
              </span>
            </button>
          ))}
        </div>
      </Card>

      {selectedType && !found && (
        <Button variant="danger" size="lg" className="w-full" onClick={handleSearch} disabled={searching}>
          {searching ? 'Recherche de prestataires disponibles...' : 'Trouver un prestataire disponible'}
        </Button>
      )}

      {searching && (
        <Card>
          <div className="flex items-center justify-center py-8">
            <SkeletonLoader variant="card" count={1} />
          </div>
        </Card>
      )}

      {found && (
        <>
          <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--color-sl-400)' }}>
            Prestataires disponibles a proximite
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_PROVIDERS.map((provider) => (
              <UrgentProviderCard key={provider.id} provider={provider} onContact={handleContact} />
            ))}
          </div>
        </>
      )}

      <div className="text-center">
        <button
          onClick={() => navigate('/client/urgence/contact')}
          className="text-sm font-medium hover:underline"
          style={{ color: 'var(--color-brand)' }}
        >
          Gerer mes contacts d'urgence →
        </button>
      </div>
    </div>
  );
}