// src/pages/provider/CreerDevis.jsx
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

// Pas de wrapper de layout ici : cette page est rendue à l'intérieur de
// <ProviderLayout /> via l'<Outlet /> défini dans AppRouter.jsx
// (route "/provider" -> AuthGuard -> ProviderLayout -> devis/nouveau/:demandeId).
import { PageHeader } from '../../components/commons/PageHeader';
import { AlertBanner } from '../../components/commons/AlertBanner';
import { Button } from '../../components/commons/Button';
import { SkeletonLoader } from '../../components/commons/SkeletonLoader';
import { ChevronRight } from '../../components/commons/Icons';

import { MainDoeuvreSection } from '../../components/provider/devis/MainDoeuvreSection';
import {
  MaterialsSection,
  createEmptyMaterial,
} from '../../components/provider/devis/MaterialsSection';
import { DelaiSection } from '../../components/provider/devis/DelaiSection';
import { QuoteTotalPreview } from '../../components/provider/devis/QuoteTotalPreview';
import { ClientSummaryCard } from '../../components/provider/devis/ClientSummaryCard';
import { formatXAF } from '../../components/provider/devis/formatXAF';

// ── Appels API ──
// submitQuote() suit le pattern getMock/apiClient du projet et correspond
// exactement à POST /provider/demands/:demandId/quote (API_CONTRACT.md §7).
// getAvailableDemands() renvoie la liste des ServiceDemand (mock_available_demands.json
// tant que le backend n'a pas livré GET /provider/demands/available — voir §10).
import { getAvailableDemands, submitQuote } from '../../services/providerService';

// ── Fonctions utilitaires extraites (voir creerDevis.helpers.js) ──
import { buildClientFallback, extractDemandsArray } from '../../components/provider/devis/creerDevis.helpers';

export function CreerDevis() {
  const navigate = useNavigate();
  const location = useLocation();
  const { demandeId } = useParams(); // matche la route "devis/nouveau/:demandeId"

  // La demande peut arriver via l'état de navigation (déjà chargée sur
  // DemandesDisponibles / DemandDetailModal) pour éviter un re-fetch inutile.
  // Sinon (accès direct à l'URL, refresh), on la retrouve dans la liste des
  // demandes disponibles.
  const demandFromState = location.state?.demand ?? null;

  const [demand, setDemand] = useState(demandFromState);
  const [isLoadingDemand, setIsLoadingDemand] = useState(!demandFromState);
  const [loadError, setLoadError] = useState(null);

  const [laborDescription, setLaborDescription] = useState('');
  const [laborAmount, setLaborAmount] = useState(0);
  const [materials, setMaterials] = useState([createEmptyMaterial()]);
  const [estimatedDurationHours, setEstimatedDurationHours] = useState(1);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    if (demandFromState) return; // déjà présente, rien à charger

    let isMounted = true;
    setIsLoadingDemand(true);
    setLoadError(null);

    getAvailableDemands()
      .then((result) => {
        if (!isMounted) return;
        const demandsList = extractDemandsArray(result);
        const found = demandsList.find((d) => d.id === demandeId);
        if (!found) {
          setLoadError("Cette demande n'existe plus ou n'est plus disponible.");
          return;
        }
        setDemand(found);
      })
      .catch((err) => {
        if (!isMounted) return;
        setLoadError(err?.message || 'Impossible de charger la demande.');
      })
      .finally(() => {
        if (isMounted) setIsLoadingDemand(false);
      });

    return () => {
      isMounted = false;
    };
  }, [demandeId, demandFromState]);

  const client = useMemo(() => buildClientFallback(demand), [demand]);
  const categoryLabel = demand?.category?.label ?? '';

  const materialsTotal = useMemo(
    () =>
      materials.reduce(
        (sum, m) => sum + (Number(m.quantity) || 0) * (Number(m.unitPrice) || 0),
        0
      ),
    [materials]
  );
  const totalAmount = laborAmount + materialsTotal;

  function validate() {
    const next = {};
    if (!laborDescription.trim()) {
      next.laborDescription = 'La description des travaux est requise.';
    }
    if (!laborAmount || laborAmount <= 0) {
      next.laborAmount = 'Le montant doit être supérieur à 0.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;

    setSubmitError(null);
    setIsSubmitting(true);
    try {
      await submitQuote(demandeId, {
        laborDescription,
        laborAmount,
        materials: materials
          .filter((m) => m.designation.trim())
          .map(({ designation, quantity, unitPrice }) => ({ designation, quantity, unitPrice })),
        estimatedDurationHours,
      });
      navigate('/provider/demandes', {
        state: { successMessage: 'Devis envoyé au client avec succès.' },
      });
    } catch (err) {
      setSubmitError(
        err?.message || 'Impossible d\u2019envoyer le devis pour le moment. Veuillez réessayer.'
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  // ── États de chargement / erreur de la demande ──
  if (isLoadingDemand) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <SkeletonLoader className="h-8 w-64 mb-6" />
        <SkeletonLoader className="h-40 w-full mb-4" />
        <SkeletonLoader className="h-40 w-full" />
      </div>
    );
  }

  if (loadError || !demand) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <AlertBanner type="danger" message={loadError || 'Demande introuvable.'} />
        <Button variant="secondary" className="mt-4" onClick={() => navigate(-1)}>
          Retour
        </Button>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="Créer un devis"
        subtitle={`Pour ${client.fullName} · Mission ${categoryLabel}`}
        onBack={() => navigate(-1)}
      />

      <div className="px-4 sm:px-6 lg:px-8 py-6 pb-28 lg:pb-8">
        {submitError && (
          <AlertBanner type="danger" message={submitError} className="mb-6" />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-6 items-start">
          {/* ── Colonne principale : formulaire ── */}
          <div className="flex flex-col gap-6 min-w-0">
            {/* Contexte client visible dès le départ sur mobile */}
            <div className="lg:hidden">
              <ClientSummaryCard client={client} />
            </div>

            <MainDoeuvreSection
              laborDescription={laborDescription}
              laborAmount={laborAmount}
              onDescriptionChange={setLaborDescription}
              onAmountChange={setLaborAmount}
              errors={errors}
            />

            <MaterialsSection materials={materials} onChange={setMaterials} />

            <DelaiSection
              estimatedDurationHours={estimatedDurationHours}
              onChange={setEstimatedDurationHours}
            />

            {/* Récap total visible avant les boutons sur mobile */}
            <div className="lg:hidden">
              <QuoteTotalPreview
                laborAmount={laborAmount}
                materialsTotal={materialsTotal}
                totalAmount={totalAmount}
              />
            </div>

            {/* Actions — visibles en ligne dès le breakpoint lg (desktop) */}
            <div className="hidden lg:flex gap-3">
              <Button variant="secondary" onClick={() => navigate(-1)} disabled={isSubmitting}>
                Annuler
              </Button>
              <Button
                variant="dark"
                className="flex-1 justify-center"
                onClick={handleSubmit}
                loading={isSubmitting}
              >
                Envoyer le devis au client
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* ── Colonne latérale : total + client (desktop uniquement) ── */}
          <aside className="hidden lg:flex lg:flex-col gap-6">
            <QuoteTotalPreview
              laborAmount={laborAmount}
              materialsTotal={materialsTotal}
              totalAmount={totalAmount}
            />
            <ClientSummaryCard client={client} />
          </aside>
        </div>
      </div>

      {/* ── Barre d'action fixe (mobile / tablette) ── */}
      <div
        className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-surface/95 backdrop-blur
          border-t border-sl-200 px-4 py-3 flex items-center gap-3 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]"
      >
        <div className="shrink-0">
          <p className="text-[10px] font-semibold tracking-wide text-sl-400 uppercase">Total</p>
          <p className="font-display font-bold text-sl-900 leading-tight">
            {formatXAF(totalAmount)}
          </p>
        </div>
        <Button
          variant="dark"
          className="flex-1 justify-center"
          onClick={handleSubmit}
          loading={isSubmitting}
        >
          Envoyer
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </>
  );
}

// Export par défaut requis par React.lazy() dans AppRouter.jsx
// (les pages routées ont besoin d'un default export ; l'export nommé
// ci-dessus reste disponible pour les tests/imports directs).
export default CreerDevis;