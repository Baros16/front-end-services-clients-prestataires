import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { PageHeader } from '../../components/commons/PageHeader';
import { PhotoUploader } from '../../components/commons/PhotoUploader';
import { Card } from '../../components/commons/Card.jsx';
import { LocationPicker } from '../../components/commons/LocationPicker';

import { StepIndicator } from '../../components/client/demandes/StepIndicator.jsx';
import CategorySelector from '../../components/client/demandes/CategorySelector.jsx';
import DemandDescriptionField from '../../components/client/demandes/DemandDescriptionField.jsx';
import { BudgetRangeField } from '../../components/client/demandes/BudgetRangeField.jsx';
import RecapSidePanel from '../../components/client/demandes/RecapSidePanel.jsx';

import { getCategories } from '../../services/sharedService';
import { createDemand } from '../../services/clientService';
import { uploadPhotos } from '../../services/uploadService';

const STEPS = [
  { number: 1, label: 'Catégorie' },
  { number: 2, label: 'Description' },
  { number: 3, label: 'Photos' },
  { number: 4, label: 'Localisation' },
  { number: 5, label: 'Confirmation' },
];

const DESCRIPTION_MIN_LENGTH = 30;

export default function NouvelleDemande() {
  const navigate = useNavigate();

  // ── Données distantes ──
  const [categories, setCategories] = useState([]);
  const [loadingCats, setLoadingCats] = useState(true);

  // ── État du brouillon de demande ──
  const [selectedCatId, setSelectedCatId] = useState(null);
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState({ min: '', max: '' });
  const [photos, setPhotos] = useState([]);
  const [location, setLocation] = useState({ lat: null, lng: null, address: '' });

  // ── UI states ──
  const [descError, setDescError] = useState('');
  const [budgetError, setBudgetError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [published, setPublished] = useState(false);

  // ── Charger les catégories au montage ──
  useEffect(() => {
    let cancelled = false;
    setLoadingCats(true);
    getCategories()
      .then((data) => {
        if (!cancelled) setCategories(Array.isArray(data) ? data : (data?.data ?? []));
      })
      .catch(() => { if (!cancelled) setFeedback({ type: 'error', message: 'Impossible de charger les catégories.' }); })
      .finally(() => { if (!cancelled) setLoadingCats(false); });
    return () => { cancelled = true; };
  }, []);

  // ── Calcul du récap ──
  const selectedCatLabel = categories.find((c) => c.id === selectedCatId)?.label || '—';

  const recap = {
    category: selectedCatLabel,
    location: location.address,
    photoCount: photos.length,
    status: 'Ouverte',
  };

  const budgetComplete = budget.min !== '' && budget.max !== '' && Number(budget.max) >= Number(budget.min);
  const hasCoords = location.lat != null && location.lng != null;

  const completedSteps = useMemo(() => {
    const set = new Set();
    if (selectedCatId) set.add(1);
    if (description.trim().length >= DESCRIPTION_MIN_LENGTH && budgetComplete) set.add(2);
    if (photos.length > 0) set.add(3);
    if (hasCoords) set.add(4);
    if (published) set.add(5);
    return set;
  }, [selectedCatId, description, budgetComplete, photos, hasCoords, published]);

  const currentStep = useMemo(() => {
    const firstIncomplete = STEPS.find((s) => !completedSteps.has(s.number));
    return firstIncomplete ? firstIncomplete.number : STEPS[STEPS.length - 1].number;
  }, [completedSteps]);

  const handleSelectCategory = useCallback((id) => {
    setSelectedCatId(id);
  }, []);

  const handleAddPhoto = useCallback(async (file) => {
    try {
      const uploaded = await uploadPhotos([file], 'demand');
      const first = uploaded?.uploads?.[0];
      if (first) {
        setPhotos((prev) => [...prev, { id: first.id, url: first.url, name: first.name }]);
      }
    } catch (err) {
      setFeedback({ type: 'error', message: "Erreur lors de l'upload de la photo." });
    }
  }, []);

  const handleRemovePhoto = useCallback((id) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const handleLocationChange = useCallback((newLocation) => {
    setLocation(newLocation);
  }, []);

  const handleBudgetChange = useCallback((newBudget) => {
    setBudget(newBudget);
    if (budgetError) setBudgetError('');
  }, [budgetError]);

  const validate = () => {
    let valid = true;

    if (!description || description.trim().length < DESCRIPTION_MIN_LENGTH) {
      setDescError(`La description doit contenir au moins ${DESCRIPTION_MIN_LENGTH} caractères.`);
      valid = false;
    } else {
      setDescError('');
    }

    if (!budgetComplete) {
      setBudgetError('Indiquez un budget minimum et maximum cohérents.');
      valid = false;
    } else {
      setBudgetError('');
    }

    if (!selectedCatId) {
      setFeedback({ type: 'error', message: 'Veuillez sélectionner une catégorie.' });
      valid = false;
    }

    if (!hasCoords) {
      setFeedback({ type: 'error', message: 'Veuillez sélectionner une localisation.' });
      valid = false;
    }

    return valid;
  };

  const handleSubmit = async () => {
    setFeedback(null);
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await createDemand({
        categoryId: selectedCatId,
        description: description.trim(),
        photoIds: photos.map((p) => p.id),
        location: { address: location.address, lat: location.lat, lng: location.lng },
        estimatedBudget: { min: Number(budget.min), max: Number(budget.max) },
        urgent: false,
      });
      setPublished(true);
      setFeedback({ type: 'success', message: 'Votre demande a été publiée avec succès !' });
      setTimeout(() => navigate('/client/demands'), 1800);
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err?.response?.data?.error?.message || 'Une erreur est survenue. Veuillez réessayer.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => navigate(-1);

  return (
    <div className="sl-animate-fade-in space-y-5 pb-10">

      <PageHeader
        title="Nouvelle demande de service"
        subtitle="Remplissez les informations ci-dessous"
      />

      <div className="px-4 sm:px-6 lg:px-8">
        <Card>
          <StepIndicator
            steps={STEPS}
            currentStep={currentStep}
            completedSteps={completedSteps}
          />
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5 items-start px-4 sm:px-6 lg:px-8">

        <Card>
          <div className="space-y-6">

            {loadingCats ? (
              <div className="h-20 sl-animate-shimmer rounded-[var(--radius-md)]" />
            ) : (
              <CategorySelector
                categories={categories}
                selectedId={selectedCatId}
                onSelect={handleSelectCategory}
              />
            )}

            <DemandDescriptionField
              value={description}
              onChange={(v) => { setDescription(v); if (descError) setDescError(''); }}
              error={descError}
              minLength={DESCRIPTION_MIN_LENGTH}
            />

            <BudgetRangeField
              value={budget}
              onChange={handleBudgetChange}
              error={budgetError}
              required
            />

            <PhotoUploader
              label="Photos (optionnel)"
              maxPhotos={4}
              photos={photos}
              onAdd={handleAddPhoto}
              onRemove={handleRemovePhoto}
            />

            <LocationPicker
              value={location}
              onChange={handleLocationChange}
              label="Localisation de l'intervention"
              required
            />
          </div>
        </Card>

        <div className="space-y-4">
          <RecapSidePanel
            recap={recap}
            onCancel={handleCancel}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            feedback={feedback}
            onDismissFeedback={() => setFeedback(null)}
          />
        </div>

      </div>
    </div>
  );
}