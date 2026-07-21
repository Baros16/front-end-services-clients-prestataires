// src/pages/client/NouvelleDemande.jsx
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { PageHeader } from '../../components/commons/PageHeader';
import { PhotoUploader } from '../../components/commons/PhotoUploader';
import { Card } from '../../components/commons/Card.jsx';

import { StepIndicator } from '../../components/client/clients/demandes/StepIndicator.jsx';
import CategorySelector from '../../components/client/clients/demandes/CategorySelector';
import DemandDescriptionField from '../../components/client/clients/demandes/DemandDescriptionField';
import LocationSidePanel from '../../components/client/clients/demandes/LocationSidePanel';
import RecapSidePanel from '../../components/client/clients/demandes/RecapSidePanel';

import { createDemand } from '../../services/clientService';
import { uploadPhotos } from '../../services/uploadService';
import { getCategories } from '../../services/sharedService.js';

const STEPS = [
  { number: 1, label: 'Catégorie' },
  { number: 2, label: 'Description' },
  { number: 3, label: 'Photos' },
  { number: 4, label: 'Localisation' },
  { number: 5, label: 'Confirmation' },
];

const DEFAULT_ADDRESS = 'Bafoussam, Quartier Commercial';
const DEFAULT_LAT = 5.4764;
const DEFAULT_LNG = 10.4207;
const DESCRIPTION_MIN_LENGTH = 30;

export default function NouvelleDemande() {
  const navigate = useNavigate();

  // ── Données distantes ──
  const [categories, setCategories] = useState([]);
  const [loadingCats, setLoadingCats] = useState(true);

  // ── État du brouillon de demande ──
  const [selectedCatId, setSelectedCatId] = useState(null);
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState([]);
  const [address, setAddress] = useState(DEFAULT_ADDRESS);
  const [addressLat, setAddressLat] = useState(DEFAULT_LAT);
  const [addressLng, setAddressLng] = useState(DEFAULT_LNG);
  const [addressConfirmed, setAddressConfirmed] = useState(false);

  // ── UI states ──
  const [descError, setDescError] = useState('');
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
    location: address,
    photoCount: photos.length,
    status: 'Ouverte',
  };

  const completedSteps = useMemo(() => {
    const set = new Set();
    if (selectedCatId) set.add(1);
    if (description.trim().length >= DESCRIPTION_MIN_LENGTH) set.add(2);
    if (photos.length > 0) set.add(3);
    if (addressConfirmed) set.add(4);
    if (published) set.add(5);
    return set;
  }, [selectedCatId, description, photos, addressConfirmed, published]);

  const currentStep = useMemo(() => {
    const firstIncomplete = STEPS.find((s) => !completedSteps.has(s.number));
    return firstIncomplete ? firstIncomplete.number : STEPS[STEPS.length - 1].number;
  }, [completedSteps]);

  const handleSelectCategory = useCallback((id) => {
    setSelectedCatId(id);
  }, []);

  // ── Ajout d'une photo ──
  // Fix 1 : uploadPhotos attend un tableau de fichiers, pas un fichier seul.
  // Fix 2 : la réponse (mock ET API) a la forme { data: { uploads: [{ id, url, name }] } },
  //         donc on va chercher uploads[0], pas des clés plates photoId/url.
  const handleAddPhoto = useCallback(async (file) => {
    try {
      const uploaded = await uploadPhotos([file], "demand");
      const payload = uploaded?.data ?? uploaded;
      const first = payload?.uploads?.[0];

      if (!first) {
        throw new Error("Réponse d'upload invalide");
      }

      setPhotos((prev) => [...prev, { id: first.id, url: first.url, name: first.name }]);
    } catch (err) {
      setFeedback({ type: 'error', message: "Erreur lors de l'upload de la photo." });
    }
  }, []);

  const handleRemovePhoto = useCallback((id) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const handleModifyLocation = useCallback(() => {
    const newAddr = window.prompt('Entrez votre adresse :', address);
    if (newAddr && newAddr.trim()) {
      setAddress(newAddr.trim());
      setAddressConfirmed(true);
      // Pas de géocodage disponible : lat/lng restent sur la valeur par défaut
      // tant qu'aucun service de géocodage n'est branché (cf. audit — suggestion
      // de prop `address` de confort sur MapEmbed, à trancher avec M1).
    }
  }, [address]);

  const validate = () => {
    let valid = true;
    if (!description || description.trim().length < 10) {
      setDescError('La description doit contenir au moins 10 caractères.');
      valid = false;
    } else {
      setDescError('');
    }
    if (!selectedCatId) {
      setFeedback({ type: 'error', message: 'Veuillez sélectionner une catégorie.' });
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
        location: { address, lat: addressLat, lng: addressLng },
        isUrgent: false,
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

            <PhotoUploader
              label="Photos (optionnel)"
              maxPhotos={4}
              photos={photos}
              onAdd={handleAddPhoto}
              onRemove={handleRemovePhoto}
            />
          </div>
        </Card>

        <div className="space-y-4">
          <LocationSidePanel
            address={address}
            lat={addressLat}
            lng={addressLng}
            onModify={handleModifyLocation}
          />
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