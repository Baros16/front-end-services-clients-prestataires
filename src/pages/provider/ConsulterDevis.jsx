// src/pages/provider/ConsulterDevis.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import {
  PageHeader,
  StatusBadge,
  Button,
  SkeletonLoader,
  AlertBanner,
  ArrowLeft,
  Clock,
  CheckCircle,
} from '../../components/commons';

import { formatXAF } from '../../utils/formatters';
import { getMock } from '../../services/mockSwitch';
import apiClient from '../../services/apiClient';
import mockQuote from '../../data/client/mock_quote.json';

const STATUS_VARIANT = {
  en_attente: 'en_attente',
  accepte:    'disponible',
  refuse:     'annulee',
  expire:     'annulee',
};

export default function ConsulterDevis() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getMock(
      mockQuote,
      () => apiClient.get(`/provider/quotes/${id}`),
    )
      .then((res) => {
        const data = res?.data ?? res ?? mockQuote.data;
        setQuote(data);
      })
      .catch(() => setError('Impossible de charger le devis.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="p-4 sm:p-6 md:p-8 space-y-5 max-w-[900px]">
        <SkeletonLoader variant="text" count={2} />
        <SkeletonLoader variant="card" count={1} />
        <SkeletonLoader variant="metric" count={2} />
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="p-4 sm:p-6 md:p-8 max-w-[900px]">
        <AlertBanner message={error ?? 'Devis introuvable.'} variant="error" />
        <Button variant="secondary" className="mt-4" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} className="mr-1" /> Retour
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-[900px] w-full overflow-x-hidden">
      <PageHeader
        title={
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="shrink-0">
              <ArrowLeft size={18} />
            </Button>
            <span className="truncate">Devis envoyé</span>
          </div>
        }
        subtitle={`Devis N° ${quote.reference}`}
        actions={
          <StatusBadge
            label={quote.status === 'en_attente' ? 'En attente' : quote.status === 'accepte' ? 'Accepté' : 'Refusé'}
            variant={STATUS_VARIANT[quote.status] ?? 'en_attente'}
          />
        }
      />

      <div className="mt-8 bg-[var(--color-sl-100)] border border-[var(--color-sl-200)] rounded-[var(--radius-xl)] p-1.5">
        <div className="bg-white rounded-[var(--radius-lg)] overflow-hidden shadow-[var(--shadow-card)]">
          {/* En-tête du devis */}
          <div className="flex flex-wrap items-start justify-between gap-3 px-6 pt-6 pb-5 border-b border-[var(--color-sl-100)]">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[var(--color-sl-400)]">
                Réf. {quote.reference}
              </p>
              <h2 className="text-xl font-display font-bold text-[var(--color-sl-900)] mt-1 tracking-tight">
                Devis de prestation
              </h2>
            </div>
          </div>

          {/* Description main-d'œuvre */}
          <div className="px-6 py-5 border-b border-[var(--color-sl-100)]">
            <p className="text-[10px] font-semibold tracking-[0.14em] uppercase text-[var(--color-sl-400)] mb-2">
              Description des travaux
            </p>
            <p className="text-sm text-[var(--color-sl-700)] font-[family-name:var(--font-body)]">
              {quote.laborDescription}
            </p>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--color-sl-100)]">
              <span className="text-sm text-[var(--color-sl-500)]">Main-d'œuvre</span>
              <span className="text-sm font-semibold text-[var(--color-sl-900)]">
                {formatXAF(quote.laborAmount)}
              </span>
            </div>
          </div>

          {/* Matériaux */}
          {quote.materials && quote.materials.length > 0 && (
            <div className="px-6 py-5 border-b border-[var(--color-sl-100)]">
              <p className="text-[10px] font-semibold tracking-[0.14em] uppercase text-[var(--color-sl-400)] mb-3">
                Matériaux ({quote.materials.length})
              </p>
              <div className="space-y-2">
                {quote.materials.map((mat) => (
                  <div key={mat.id} className="flex items-center justify-between text-sm">
                    <div className="min-w-0 flex-1">
                      <p className="text-[var(--color-sl-700)] truncate">{mat.designation}</p>
                      <p className="text-[11px] text-[var(--color-sl-400)]">
                        x{mat.quantity} · {formatXAF(mat.unitPrice)}/u
                      </p>
                    </div>
                    <span className="text-sm font-medium text-[var(--color-sl-900)] ml-4 shrink-0">
                      {formatXAF(mat.subtotal)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--color-sl-100)]">
                <span className="text-sm text-[var(--color-sl-500)]">Total matériaux</span>
                <span className="text-sm font-semibold text-[var(--color-sl-900)]">
                  {formatXAF(quote.materialsTotal)}
                </span>
              </div>
            </div>
          )}

          {/* Total général */}
          <div className="px-6 py-5 bg-[var(--color-sl-50)] flex items-center justify-between">
            <span className="text-base font-semibold text-[var(--color-sl-900)] font-display">
              Total devis
            </span>
            <span className="text-xl font-bold text-[var(--color-sl-900)] font-display">
              {formatXAF(quote.totalAmount)}
            </span>
          </div>

          {/* Infos complémentaires */}
          <div className="grid grid-cols-2 border-t border-[var(--color-sl-100)]">
            <div className="px-6 py-4 border-r border-[var(--color-sl-100)]">
              <p className="text-[10px] font-semibold tracking-[0.14em] uppercase text-[var(--color-sl-400)]">
                Délai estimé
              </p>
              <p className="text-[var(--color-sl-800)] font-semibold font-display text-base mt-1 flex items-center gap-1.5">
                <Clock size={14} className="text-[var(--color-sl-400)]" />
                {quote.estimatedDurationHours} heure{quote.estimatedDurationHours > 1 ? 's' : ''}
              </p>
            </div>
            <div className="px-6 py-4">
              <p className="text-[10px] font-semibold tracking-[0.14em] uppercase text-[var(--color-sl-400)]">
                Validité
              </p>
              <p className="text-[var(--color-sl-800)] font-semibold font-display text-base mt-1">
                {quote.validityDays} jour{quote.validityDays > 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Statut du devis */}
      <div className="mt-6 flex items-center justify-center gap-2 p-4 rounded-[var(--radius-lg)]"
        style={{
          background: quote.status === 'accepte'
            ? 'var(--color-success-bg, #ECFDF5)'
            : quote.status === 'refuse'
            ? 'var(--color-danger-bg, #FEF2F2)'
            : 'var(--color-sl-50)',
          color: quote.status === 'accepte'
            ? 'var(--color-success)'
            : quote.status === 'refuse'
            ? 'var(--color-danger)'
            : 'var(--color-sl-500)',
        }}
      >
        {quote.status === 'accepte' && <CheckCircle size={18} />}
        <span className="text-sm font-semibold">
          {quote.status === 'en_attente' && 'En attente de la réponse du client'}
          {quote.status === 'accepte' && 'Devis accepté par le client'}
          {quote.status === 'refuse' && 'Devis refusé par le client'}
          {quote.status === 'expire' && 'Devis expiré'}
        </span>
      </div>
    </div>
  );
}