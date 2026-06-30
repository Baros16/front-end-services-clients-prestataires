import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  PageHeader, StatusBadge, Button,
  SkeletonLoader, AlertBanner,
} from '../../components/commons';
import { X, CheckCircle } from '../../components/commons';
import QuoteTable            from '../../components/client/quote/QuoteTable';
import ProviderSummaryCard   from '../../components/client/quote/ProviderSummaryCard';
import PaymentMethodSelector from '../../components/client/quote/PaymentMethodSelector';
import PaymentMethodPanel from '../../components/client/quote/PaymentMethodPanel';
import ProviderAvatarReveal from '../../components/client/quote/ProviderAvatarReveal';
import { getQuoteDetail, acceptQuote, rejectQuote } from '../../services/clientService';
import { formatXAF } from '../../utils/formatters';

// Toggle temporaire pour comparer les 2 variantes paiement — à retirer une fois choisie
const PAYMENT_DISPLAY_MODE = 'inline'; // 'inline' | 'panel'

const STATUS_VARIANT = {
  en_attente: 'en_attente',
  accepte:    'disponible',
  refuse:     'annulee',
  expire:     'annulee',
};

export default function QuoteDetailPage() {
  const { id }   = useParams();
  const navigate = useNavigate();

  const [quote,          setQuote]          = useState(null);
  const [loading,        setLoading]        = useState(true);
  const [error,          setError]          = useState(null);
  const [selectedMethod, setSelectedMethod] = useState('orange_money');
  const [panelOpen,      setPanelOpen]      = useState(false);
  const [accepting,      setAccepting]      = useState(false);
  const [rejecting,      setRejecting]      = useState(false);

  useEffect(() => {
    getQuoteDetail(id)
      .then(setQuote)
      .catch(() => setError('Impossible de charger le devis. Veuillez réessayer.'))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleAccept() {
    if (!selectedMethod) return;
    setAccepting(true);
    setError(null);
    try {
      await acceptQuote(quote.demandId, selectedMethod);
      navigate(`/client/suivi/${quote.demandId}`);
    } catch {
      setError("Erreur lors de l'acceptation. Veuillez réessayer.");
      setAccepting(false);
    }
  }

  async function handleReject() {
    if (!window.confirm('Confirmer le refus de ce devis ?')) return;
    setRejecting(true);
    setError(null);
    try {
      await rejectQuote(quote.demandId);
      navigate('/client/demandes');
    } catch {
      setError('Erreur lors du refus. Veuillez réessayer.');
      setRejecting(false);
    }
  }

  if (loading) {
    return (
      <div className="p-4 sm:p-6 md:p-8 space-y-5 max-w-[1200px]">
        <SkeletonLoader variant="text"   count={2} />
        <SkeletonLoader variant="card"   count={1} />
        <SkeletonLoader variant="metric" count={2} />
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="p-4 sm:p-6 md:p-8 max-w-[1200px]">
        <AlertBanner message={error ?? 'Devis introuvable.'} variant="error" />
      </div>
    );
  }

  const busy = accepting || rejecting;

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-[1200px] w-full overflow-x-hidden">
      {error && (
        <div className="mb-6">
          <AlertBanner message={error} variant="error" onDismiss={() => setError(null)} />
        </div>
      )}

      <PageHeader
        title="Devis reçu"
        subtitle={`Pour votre demande ${quote.demand?.category}`}
        actions={
          <StatusBadge
            label="En attente de validation"
            variant={STATUS_VARIANT[quote.status] ?? 'en_attente'}
          />
        }
      />

      <div className="mt-8 grid lg:grid-cols-[1fr_340px] gap-6 xl:gap-8 items-start min-w-0">

        {/* ── COLONNE GAUCHE ─────────────────────────────────────── */}
        <div className="space-y-5 sl-animate-fade-in min-w-0" style={{ animationFillMode: 'both' }}>

          <div className="bg-[var(--color-sl-100)] border border-[var(--color-sl-200)] rounded-[var(--radius-xl)] p-1.5">
            <div className="bg-white rounded-[var(--radius-lg)] overflow-hidden shadow-[var(--shadow-card)]">

              <div className="flex flex-wrap items-start justify-between gap-3 px-6 pt-6 pb-5 border-b border-[var(--color-sl-100)]">
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[var(--color-sl-400)]">
                    Devis N° {quote.reference}
                  </p>
                  <h2 className="text-xl font-display font-bold text-[var(--color-sl-900)] mt-1 tracking-tight">
                    {quote.demand?.category} — {quote.demand?.description}
                  </h2>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <StatusBadge label="En attente" variant="en_attente" />
                  {/* Avatar prestataire — mobile/tablette uniquement, remplace la card complète */}
                  <div className="lg:hidden">
                    <ProviderAvatarReveal provider={quote.provider} />
                  </div>
                </div>
              </div>

              <QuoteTable
                laborDescription={quote.laborDescription}
                laborAmount={quote.laborAmount}
                materials={quote.materials}
                totalAmount={quote.totalAmount}
              />

              <div className="grid grid-cols-2 border-t border-[var(--color-sl-100)]">
                <div className="bg-[var(--color-sl-50)] px-6 py-4 border-r border-[var(--color-sl-100)]">
                  <p className="text-[10px] font-semibold tracking-[0.14em] uppercase text-[var(--color-sl-400)]">
                    Délai estimé
                  </p>
                  <p className="text-[var(--color-sl-800)] font-semibold font-display text-base mt-1">
                    {quote.estimatedDurationHours} heure{quote.estimatedDurationHours > 1 ? 's' : ''}
                  </p>
                </div>
                <div className="bg-[var(--color-sl-50)] px-6 py-4">
                  <p className="text-[10px] font-semibold tracking-[0.14em] uppercase text-[var(--color-sl-400)]">
                    Validité devis
                  </p>
                  <p className="text-[var(--color-sl-800)] font-semibold font-display text-base mt-1">
                    {quote.validityDays} jour{quote.validityDays > 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Mode paiement inline — visible si PAYMENT_DISPLAY_MODE === 'inline' */}
          {PAYMENT_DISPLAY_MODE === 'inline' && (
            <div className="lg:hidden">
              <PaymentMethodSelector value={selectedMethod} onChange={setSelectedMethod} />
            </div>
          )}

          {/* Boutons — toujours sur une ligne, mêmes en mobile */}
          <div
            className="grid grid-cols-2 gap-2 sm:gap-3 sl-animate-fade-in"
            style={{ animationDelay: '180ms', animationFillMode: 'both' }}
          >
            <Button
              variant="ghost"
              size="lg"
              onClick={handleReject}
              disabled={busy}
              className="w-full !bg-[var(--color-danger)]/10 !text-[var(--color-danger)] !border-[var(--color-danger)]/30 hover:!bg-[var(--color-danger)]/15 text-[13px] sm:text-[15px] px-3 sm:px-7"
            >
              <X size={14} className="shrink-0" />
              <span className="truncate">{rejecting ? 'Refus...' : 'Refuser'}</span>
            </Button>

            <Button
              variant="primary"
              size="lg"
              onClick={PAYMENT_DISPLAY_MODE === 'panel' ? () => setPanelOpen(true) : handleAccept}
              disabled={busy}
              className="w-full group !bg-[var(--color-sl-900)] hover:!bg-[var(--color-sl-800)] text-[13px] sm:text-[15px] px-3 sm:px-7"
            >
              <span className="truncate">
                {accepting
                  ? 'Traitement...'
                  : `Payer ${formatXAF(quote.totalAmount)}`}
              </span>
              <span className="hidden sm:flex w-7 h-7 rounded-full bg-white/10 items-center justify-center shrink-0 ml-2 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-110 group-hover:translate-x-0.5">
                <CheckCircle size={14} className="text-white" />
              </span>
            </Button>
          </div>
        </div>

        {/* ── COLONNE DROITE — desktop uniquement ─────────────────── */}
        <div
          className="hidden lg:block space-y-4 sl-animate-fade-in"
          style={{ animationDelay: '90ms', animationFillMode: 'both' }}
        >
          <ProviderSummaryCard provider={quote.provider} />
          {PAYMENT_DISPLAY_MODE === 'inline' && (
            <PaymentMethodSelector value={selectedMethod} onChange={setSelectedMethod} />
          )}
        </div>
      </div>

      {/* Panel paiement détaché — actif si PAYMENT_DISPLAY_MODE === 'panel' */}
      {PAYMENT_DISPLAY_MODE === 'panel' && (
        <PaymentMethodPanel
          open={panelOpen}
          value={selectedMethod}
          onChange={setSelectedMethod}
          onClose={() => setPanelOpen(false)}
        />
      )}
    </div>
  );
}