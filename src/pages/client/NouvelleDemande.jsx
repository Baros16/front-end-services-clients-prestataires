// src/pages/client/NewDemandePage.jsx
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

// Composants communs
import { PageHeader } from '../../components/commons/PageHeader';
import { PhotoUploader } from '../../components/commons/PhotoUploader';
import { AlertBanner } from '../../components/commons/AlertBanner';
import SectionCard from "../../components/commons/SectionCard.jsx";

// Composants spécifiques à cet écran
import { StepIndicator } from '../../components/client/clients/demandes/StepIndicator.jsx';
import CategorySelector from '../../components/client/clients/demandes/CategorySelector';
import DemandDescriptionField from '../../components/client/clients/demandes/DemandDescriptionField';
import LocationSidePanel from '../../components/client/clients/demandes/LocationSidePanel';
import RecapSidePanel from '../../components/client/clients/demandes/RecapSidePanel';

// Service API / mock
import { getCategories, uploadPhoto, createDemand } from '../../services/clentService';

// ─── Constantes ──────────────────────────────────────────────────────────────

const STEPS = [
  { number: 1, label: 'Catégorie' },
  { number: 2, label: 'Description' },
  { number: 3, label: 'Photos' },
  { number: 4, label: 'Localisation' },
  { number: 5, label: 'Confirmation' },
];

const DEFAULT_ADDRESS = 'Bafoussam, Quartier Commercial';
const DESCRIPTION_MIN_LENGTH = 30;

// ─── Page principale ─────────────────────────────────────────────────────────

export default function NouvelleDemande() {
  const navigate = useNavigate();

  // ── Données distantes ──
  const [categories, setCategories] = useState([]);
  const [loadingCats, setLoadingCats] = useState(true);

  // ── État du brouillon de demande ──
  const [selectedCatId, setSelectedCatId] = useState(null); // ⚠️ null au départ : rien n'est encore "réalisé"
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState([]);
  const [address, setAddress] = useState(DEFAULT_ADDRESS);
  const [addressConfirmed, setAddressConfirmed] = useState(false); // ✅ devient true seulement après une action utilisateur

  // ── UI states ──
  const [descError, setDescError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // ── Charger les catégories au montage ──
  useEffect(() => {
    let cancelled = false;
    setLoadingCats(true);
    getCategories()
      .then((data) => {
        if (!cancelled) setCategories(Array.isArray(data) ? data : (data?.data ?? []));
      })
      .catch(() => { if (!cancelled) setErrorMsg('Impossible de charger les catégories.'); })
      .finally(() => { if (!cancelled) setLoadingCats(false); });
    return () => { cancelled = true; };
  }, []);

  // ── Calcul du récap ──
  const selectedCatLabel = categories.find((c) => c.id === selectedCatId)?.label || '—';

  const recap = {
    category: selectedCatLabel,
    location: address,
    photoCount: photos.length,
    status: 'Ouverte',
  };

  // ─────────────────────────────────────────────────────────────────────────
  // 🔑 PATTERN "COCHAGE AUTOMATIQUE" — dérivé de l'état réel du formulaire.
  // Chaque étape est cochée dès que l'action correspondante a réellement
  // été réalisée par l'utilisateur (pas juste parce qu'un champ a une valeur
  // par défaut).
  // ─────────────────────────────────────────────────────────────────────────
  const completedSteps = useMemo(() => {
    const set = new Set();

    // Étape 1 — Catégorie sélectionnée explicitement
    if (selectedCatId) set.add(1);

    // Étape 2 — Description qui respecte la longueur minimale
    if (description.trim().length >= DESCRIPTION_MIN_LENGTH) set.add(2);

    // Étape 3 — Au moins une photo ajoutée (étape optionnelle,
    // donc on ne bloque jamais dessus, mais on la coche si utilisée)
    if (photos.length > 0) set.add(3);

    // Étape 4 — Localisation confirmée par une action utilisateur
    if (addressConfirmed) set.add(4);

    // Étape 5 — Demande publiée avec succès
    if (successMsg) set.add(5);

    return set;
  }, [selectedCatId, description, photos, addressConfirmed, successMsg]);

  // currentStep = première étape non complétée (ou la dernière si tout est fait)
  const currentStep = useMemo(() => {
    const firstIncomplete = STEPS.find((s) => !completedSteps.has(s.number));
    return firstIncomplete ? firstIncomplete.number : STEPS[STEPS.length - 1].number;
  }, [completedSteps]);

  // ── Gestion catégorie ──
  const handleSelectCategory = useCallback((id) => {
    setSelectedCatId(id); // ✅ coche automatiquement l'étape 1 via completedSteps
  }, []);

  // ── Gestion photos ──
  const handleAddPhoto = useCallback(async (file) => {
    try {
      const uploaded = await uploadPhoto(file);
      const { photoId, url } = uploaded?.data ?? uploaded;
      setPhotos((prev) => [...prev, { id: photoId, url, name: file.name }]); // ✅ coche l'étape 3
    } catch (err) {
      setErrorMsg("Erreur lors de l'upload de la photo.");
    }
  }, []);

  const handleRemovePhoto = useCallback((id) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
    // Si c'était la dernière photo, l'étape 3 se décoche automatiquement
    // (comportement voulu : la coche reflète l'état réel, pas un historique figé)
  }, []);

  // ── Modifier la localisation ──
  const handleModifyLocation = useCallback(() => {
    // TODO S3 : ouvrir un sélecteur de localisation
    const newAddr = window.prompt('Entrez votre adresse :', address);
    if (newAddr && newAddr.trim()) {
      setAddress(newAddr.trim());
      setAddressConfirmed(true); // ✅ coche l'étape 4 uniquement après une action réelle
    }
  }, [address]);

  // ── Validation + soumission ──
  const validate = () => {
    let valid = true;
    if (!description || description.trim().length < 10) {
      setDescError('La description doit contenir au moins 10 caractères.');
      valid = false;
    } else {
      setDescError('');
    }
    if (!selectedCatId) {
      setErrorMsg('Veuillez sélectionner une catégorie.');
      valid = false;
    }
    return valid;
  };

  const handleSubmit = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await createDemand({
        categoryId: selectedCatId,
        description: description.trim(),
        photoIds: photos.map((p) => p.id),
        location: { address, lat: 5.4764, lng: 10.4207 },
        isUrgent: false,
      });
      setSuccessMsg('Votre demande a été publiée avec succès !'); // ✅ coche l'étape 5
      setTimeout(() => navigate('/client/demands'), 1800);
    } catch (err) {
      setErrorMsg(err?.response?.data?.error?.message || 'Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => navigate(-1);

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="sl-animate-fade-in space-y-5 pb-10">

      {/* En-tête de page (collé, pas de padding horizontal) */}
      <PageHeader
        title="Nouvelle demande de service"
        subtitle="Remplissez les informations ci-dessous"
      />

      {/* Bandeaux de retour */}
      {successMsg && (
        <div className="px-4 sm:px-6 lg:px-8">
          <AlertBanner
            variant="success"
            message={successMsg}
            onDismiss={() => setSuccessMsg('')}
             size="sm" 
            className="max-w-sm"
          />
        </div>
      )}
      {errorMsg && (
        <div className="px-4 sm:px-6 lg:px-8">
          <AlertBanner
            variant="error"
            message={errorMsg}
            onDismiss={() => setErrorMsg('')}
          />
        </div>
      )}

      {/* Stepper */}
      <div className="px-4 sm:px-6 lg:px-8">
        <SectionCard>
          <StepIndicator
            steps={STEPS}
            currentStep={currentStep}
            completedSteps={completedSteps}
          />
        </SectionCard>
      </div>

      {/* Contenu principal — 2 colonnes sur desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5 items-start px-4 sm:px-6 lg:px-8">

        {/* ── Colonne gauche : formulaire ── */}
        <SectionCard>
          <div className="space-y-6">

            {/* 1. Sélecteur de catégorie */}
            {loadingCats ? (
              <div className="h-20 sl-animate-shimmer rounded-[var(--radius-md)]" />
            ) : (
              <CategorySelector
                categories={categories}
                selectedId={selectedCatId}
                onSelect={handleSelectCategory}
              />
            )}

            {/* 2. Description */}
            <DemandDescriptionField
              value={description}
              onChange={(v) => { setDescription(v); if (descError) setDescError(''); }}
              error={descError}
              minLength={DESCRIPTION_MIN_LENGTH}
            />

            {/* 3. Photos */}
            <PhotoUploader
              label="Photos (optionnel)"
              maxPhotos={4}
              photos={photos}
              onAdd={handleAddPhoto}
              onRemove={handleRemovePhoto}
            />
          </div>
        </SectionCard>

        {/* ── Colonne droite : carte + récap ── */}
        <div className="space-y-4">
          <LocationSidePanel
            address={address}
            onModify={handleModifyLocation}
          />
          <RecapSidePanel
            recap={recap}
            onCancel={handleCancel}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </div>

      </div>
    </div>
  );
}