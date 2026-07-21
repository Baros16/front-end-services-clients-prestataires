
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SectionCard from '../../components/common/SectionCard';
import PrimaryButton from '../../components/common/PrimaryButton';
import SecondaryButton from '../../components/common/SecondaryButton';
import AlertBanner from '../../components/common/AlertBanner';
import QuoteTable from '../../components/client/QuoteTable';
import PaymentMethodSelector from '../../components/client/PaymentMethodSelector';
import SecurePaymentInfo from '../../components/client/SecurePaymentInfo';
import { getQuote, acceptQuote, rejectQuote } from '../../services/clientService';

const PAYMENT_METHODS = [
  { id: 'orange_money', label: 'Orange Money', icon: <PaymentDot color="#FF6600" /> },
  { id: 'mtn_momo', label: 'MTN Mobile Money', icon: <PaymentDot color="#FFCC00" /> },
];

export default function QuoteDetailPage() {
  const { demandId } = useParams();
  const navigate = useNavigate();

  // Chargement du devis
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  // Formulaire de paiement (state géré par la page, cf. spec QuoteDetailPage)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isAccepting, setIsAccepting] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLoadError('');

    getQuote(demandId)
      .then((data) => {
        if (!cancelled) setQuote(data);
      })
      .catch((err) => {
        if (cancelled) return;
        if (err?.response?.data?.error?.code === 'NOT_FOUND') {
          setLoadError("Aucun devis n'est encore disponible pour cette demande.");
        } else {
          setLoadError('Impossible de charger le devis. Réessayez plus tard.');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [demandId]);

  const handleAccept = async () => {
    if (!selectedPaymentMethod) {
      setActionError('Sélectionnez un mode de paiement avant de continuer.');
      return;
    }
    if (!phoneNumber.trim()) {
      setActionError('Renseignez le numéro Mobile Money à débiter.');
      return;
    }

    setActionError('');
    setIsAccepting(true);
    try {
      const result = await acceptQuote(demandId, {
        paymentMethod: selectedPaymentMethod,
        phoneNumber: phoneNumber.trim(),
      });
      // Le paiement est séquestré, la mission peut démarrer : on redirige vers son suivi.
      navigate(`/client/missions/${result.missionId}`, { replace: true });
    } catch (err) {
      const code = err?.response?.data?.error?.code;
      if (code === 'PAYMENT_FAILED') {
        setActionError("Le paiement a échoué (solde insuffisant ou refus de l'opérateur).");
      } else if (code === 'ALREADY_VALIDATED') {
        setActionError('Ce devis a déjà été traité ou a expiré.');
      } else if (code === 'SERVICE_UNAVAILABLE') {
        setActionError('Le service de paiement est momentanément indisponible. Réessayez dans quelques instants.');
      } else {
        setActionError("Une erreur est survenue lors de l'acceptation du devis.");
      }
    } finally {
      setIsAccepting(false);
    }
  };

  const handleReject = async () => {
    setActionError('');
    setIsRejecting(true);
    try {
      await rejectQuote(demandId);
      navigate('/client/dashboard', { replace: true });
    } catch {
      setActionError('Impossible de refuser ce devis pour le moment.');
    } finally {
      setIsRejecting(false);
    }
  };

  // ---- États de chargement / erreur ----
  if (loading) {
    return <div className="p-8 text-center text-sl-500">Chargement du devis…</div>;
  }

  if (loadError || !quote) {
    return (
      <div className="max-w-2xl mx-auto p-8">
        <AlertBanner variant="error" message={loadError || 'Aucun devis disponible pour cette demande.'} />
      </div>
    );
  }

  const isAlreadyHandled = quote.status !== 'en_attente';

  // Adaptation Quote (API) -> QuoteData attendu par QuoteTable
  const quoteTableData = {
    reference: quote.reference,
    title: quote.laborDescription,
    status: quote.status,
    lines: [
      {
        designation: quote.laborDescription,
        quantity: 1,
        unitPrice: quote.laborAmount,
        subtotal: quote.laborAmount,
      },
      ...quote.materials.map((m) => ({
        designation: m.designation,
        quantity: m.quantity,
        unitPrice: m.unitPrice,
        subtotal: m.subtotal,
      })),
    ],
    estimatedDuration: `${quote.estimatedDurationHours} h`,
    validityDuration: `${quote.validityDays} jours`,
  };

  return (
    <div className="max-w-5xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Colonne gauche : tableau du devis */}
      <div className="lg:col-span-2">
        <SectionCard title="Devis proposé" noPadding>
          <QuoteTable quote={quoteTableData} />
        </SectionCard>
      </div>

      {/* Colonne droite : paiement + actions */}
      <div className="space-y-6">
        <SectionCard title="Mode de paiement">
          <PaymentMethodSelector
            methods={PAYMENT_METHODS}
            selectedId={selectedPaymentMethod}
            onChange={setSelectedPaymentMethod}
          />

          {selectedPaymentMethod && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-sl-700 mb-1">
                Numéro Mobile Money
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+237 6XX XXX XXX"
                className="w-full rounded-md border border-sl-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-light"
              />
            </div>
          )}
        </SectionCard>

        <SecurePaymentInfo />

        {actionError && <AlertBanner variant="error" message={actionError} />}

        {!isAlreadyHandled ? (
          <div className="flex flex-col gap-3">
            <PrimaryButton
              label="Accepter et payer"
              onClick={handleAccept}
              isLoading={isAccepting}
              disabled={isRejecting}
              fullWidth
            />
            <SecondaryButton
              label="Refuser le devis"
              variant="danger"
              onClick={handleReject}
              disabled={isAccepting || isRejecting}
              fullWidth
            />
          </div>
        ) : (
          <AlertBanner
            variant="info"
            message={
              quote.status === 'expire'
                ? 'Ce devis a expiré.'
                : `Ce devis a déjà été ${quote.status === 'accepte' ? 'accepté' : 'refusé'}.`
            }
          />
        )}
      </div>
    </div>
  );
}

function PaymentDot({ color }) {
  return (
    <span
      className="inline-block w-4 h-4 rounded-full"
      style={{ backgroundColor: color }}
      aria-hidden="true"
    />
  );
}