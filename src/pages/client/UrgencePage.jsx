// src/pages/client/UrgencePage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PageHeader, Card, Button, AlertBanner, SkeletonLoader, MapEmbed,
} from '../../components/commons';
import { Phone, Navigation, AlertTriangle, Wrench, Zap, Key, Brush } from '../../components/commons';

const URGENCY_TYPES = [
  { id: 'plomberie', label: 'Plomberie', icon: <Wrench size={24} />, color: 'var(--color-cat-plomberie)' },
  { id: 'electricite', label: 'Électricité', icon: <Zap size={24} />, color: 'var(--color-cat-electricite)' },
  { id: 'serrurerie', label: 'Serrurerie', icon: <Key size={24} />, color: 'var(--color-cat-serrurerie)' },
  { id: 'autre', label: 'Autre urgence', icon: <AlertTriangle size={24} />, color: 'var(--color-cat-autre)' },
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

  return (
    <div className="p-6 flex flex-col gap-6">
      <PageHeader title="Mode Urgence" subtitle="Besoin d'un intervenant immédiat ?" />

      {/* Bouton d'urgence principal */}
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
              className="flex flex-col items-center gap-2 p-4 rounded-xl transition-all"
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
        <Button
          variant="danger"
          size="lg"
          className="w-full"
          onClick={handleSearch}
          disabled={searching}
        >
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
        <Card title="Prestataire trouvé !">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4 p-4 rounded-lg" style={{ background: 'var(--color-success-light)' }}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'var(--color-success)' }}>
                <span className="text-white font-bold text-lg">J</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold" style={{ color: 'var(--color-sl-800)' }}>Jean Plombier</p>
                <p className="text-xs" style={{ color: 'var(--color-sl-500)' }}>À 1.2 km • Intervention en 15 min</p>
              </div>
              <Button variant="primary" size="sm" onClick={() => alert('Appel en cours...')}>
                <Phone size={16} /> Appeler
              </Button>
            </div>
            <div className="h-40 rounded-lg overflow-hidden">
              <MapEmbed address="Douala, Cameroun" height="100%" />
            </div>
          </div>
        </Card>
      )}

      <div className="text-center">
        <button
          onClick={() => navigate('/client/urgence/contact')}
          className="text-sm font-medium hover:underline"
          style={{ color: 'var(--color-brand)' }}
        >
          Gérer mes contacts d'urgence →
        </button>
      </div>
    </div>
  );
}