// src/pages/provider/CreerDevis.jsx
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import {
  PageHeader,
  AlertBanner,
  Button,
  SkeletonLoader,
  ChevronRight,
} from '../../components/commons';

import { MainDoeuvreSection } from '../../components/provider/devis/MainDoeuvreSection';
import {
  MaterialsSection,
  createEmptyMaterial,
} from '../../components/provider/devis/MaterialsSection';
import { DelaiSection } from '../../components/provider/devis/DelaiSection';
import { QuoteTotalPreview } from '../../components/provider/devis/QuoteTotalPreview';
import { ClientSummaryCard } from '../../components/provider/devis/ClientSummaryCard';

import { getAvailableDemands, submitQuote } from '../../services/providerService';
import { formatXAF } from '../../utils/formatters';

// ── Fonctions utilitaires extraites ──
import { buildClientFallback, extractDemandsArray } from '../../components/provider/devis/creerDevis.helpers';

export default function CreerDevis() {

  const navigate = useNavigate();
  const location = useLocation();
  const { demandeId } = useParams(); // matche la route "devis/nouveau/:demandeId"
  const demandFromState = location.state?.demand ?? null;

  const [demand, setDemand] = useState(demandFromState);
  const [isLoadingDemand, setIsLoadingDemand] = useState(!demandFromState);
  const [loadError, setLoadError] = useState(null);

  const [laborDescription, setLaborDescription] = useState('');
  const [laborAmount, setLaborAmount] = useState(0);
  const [materials, setMaterials] = useState([createEmptyMaterial()]);
  const [estimatedDurationHours, setEstimatedDurationHours] = useState(1);
  const [validityDays, setValidityDays] = useState(5); // 👈 Correctif : Durée de validité du devis (en jours)

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
    // FIX #8 — validation durée manquante
    if (!estimatedDurationHours || estimatedDurationHours <= 0) {
      next.estimatedDurationHours = 'La durée estimée doit être supérieure à 0.';
    }
    // 👈 Correctif : Validation validityDays
    if (!validityDays || validityDays <= 0) {
      next.validityDays = 'La durée de validité doit être supérieure à 0.';
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
        validityDays: Number(validityDays), // 👈 Correctif : transmis dans le DTO
      });
      navigate('/provider/demandes', {
        state: { successMessage: 'Devis envoyé au client avec succès.' },
      });
    } catch (err) {
      setSubmitError(
        err?.message || "Impossible d'envoyer le devis pour le moment. Veuillez réessayer."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  // ── États de chargement / erreur de la demande ──
  if (isLoadingDemand) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <SkeletonLoader variant="text" className="mb-6" />
        <SkeletonLoader variant="card" className="mb-4" />
        <SkeletonLoader variant="card" />
      </div>
    );
  }

  if (loadError || !demand) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <AlertBanner variant="error" message={loadError || 'Demande introuvable.'} />
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
      />

      <div className="px-4 sm:px-6 lg:px-8 py-6 pb-28 lg:pb-8">
        {submitError && (
          <AlertBanner variant="error" message={submitError} className="mb-6" />
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
              validityDays={validityDays}
              onValidityChange={setValidityDays}
              error={errors.estimatedDurationHours || errors.validityDays}
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
                variant="primary"
                className="flex-1 justify-center"
                onClick={handleSubmit}
                loading={isSubmitting}
              >
                Envoyer le devis au client
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* ── Colonne latérale : client + total (desktop uniquement) ── */}
          <aside className="hidden lg:flex lg:flex-col gap-6">
            <div className="lg:sticky lg:top-6">
              <ClientSummaryCard client={client} />
            </div>
            <div className="lg:sticky lg:top-[7.5rem]">
              <QuoteTotalPreview
                laborAmount={laborAmount}
                materialsTotal={materialsTotal}
                totalAmount={totalAmount}
              />
            </div>
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
          variant="primary"
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