// src/pages/client/NouvelleDemande.jsx
// TODO Semaine 2 — M3
import { useLocation } from "react-router-dom";


// src/pages/client/NewDemandePage.jsx
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// Composants communs
import {PageHeader} from '../../components/commons/PageHeader';

import  { PhotoUploader } from '../../components/commons/PhotoUploader';
import  {AlertBanner}  from '../../components/commons/AlertBanner';
import SectionCard   from "../../components/commons/SectionCard.jsx";

// Composants spécifiques à cet écran

import  StepIndicator          from '../../components/client/clients/demandes/StepIndicator.jsx';
import  CategorySelector    from '../../components/client/clients/demandes/CategorySelector';
import  DemandDescriptionField from '../../components/client/clients/demandes/DemandDescriptionField';
import  LocationSidePanel  from '../../components/client/clients/demandes/LocationSidePanel';
import  RecapSidePanel    from '../../components/client/clients/demandes/RecapSidePanel';

// Service API / mock
import { getCategories, uploadPhoto, createDemand } from  '../../services/clentService';

// ─── Constantes ──────────────────────────────────────────────────────────────

const STEPS = [
  { number: 1, label: 'Catégorie'    },
  { number: 2, label: 'Description'  },
  { number: 3, label: 'Photos'       },
  { number: 4, label: 'Localisation' },
  { number: 5, label: 'Confirmation' },
];

const DEFAULT_ADDRESS = 'Bafoussam, Quartier Commercial';

// ─── Page principale ─────────────────────────────────────────────────────────

export default function NouvelleDemande() {
  const navigate = useNavigate();

  // ── Données distantes ──
  const [categories,      setCategories]      = useState([]);
  const [loadingCats,     setLoadingCats]      = useState(true);

  // ── État du brouillon de demande ──
  const [currentStep,     setCurrentStep]      = useState(2); // Maquette montre étape 2 active
  const [selectedCatId,   setSelectedCatId]    = useState('cat_plomberie');
  const [description,     setDescription]      = useState('');
  const [photos,          setPhotos]           = useState([]);
  const [address,         setAddress]          = useState(DEFAULT_ADDRESS);

  // ── UI states ──
  const [descError,       setDescError]        = useState('');
  const [isSubmitting,    setIsSubmitting]      = useState(false);
  const [successMsg,      setSuccessMsg]        = useState('');
  const [errorMsg,        setErrorMsg]         = useState('');

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
    category:   selectedCatLabel,
    location:   address,
    photoCount: photos.length,
    status:     'Ouverte',
  };

  // ── Gestion catégorie ──
  const handleSelectCategory = useCallback((id) => {
    setSelectedCatId(id);
    setCurrentStep(2);
  }, []);

  // ── Gestion photos ──
  //const handleAddPhoto = useCallback(async (file) => {
   // try {
    //  const uploaded = await uploadPhoto(file);
    //  setPhotos((prev) => [...prev, { id: uploaded.photoId, url: uploaded.url, name: file.name }]);

     // const uploaded = await uploadPhoto(file);
      // const { photoId, url } = uploaded?.data ?? uploaded;
     // setPhotos((prev) => [...prev, { id: photoId, url, name: file.name }]);
   // }
   //  catch {
      //setErrorMsg('Erreur lors de l\'upload de la photo.');
  //  }
 // }, []);
 const handleAddPhoto = useCallback(async (file) => {
  try {
    const uploaded = await uploadPhoto(file);
    console.log('uploadPhoto result:', uploaded);          // ← log temporaire
    const { photoId, url } = uploaded?.data ?? uploaded;
    console.log('photoId:', photoId, 'url:', url);         // ← log temporaire
    setPhotos((prev) => [...prev, { id: photoId, url, name: file.name }]);
  } catch (err) {
    console.error('upload error:', err);                   // ← log temporaire
    setErrorMsg("Erreur lors de l'upload de la photo.");
  }
}, []);


  const handleRemovePhoto = useCallback((id) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  }, []);

  // ── Modifier la localisation (placeholder) ──
  const handleModifyLocation = useCallback(() => {
    // TODO S3 : ouvrir un sélecteur de localisation
    const newAddr = window.prompt('Entrez votre adresse :', address);
    if (newAddr && newAddr.trim()) setAddress(newAddr.trim());
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
      setSuccessMsg('Votre demande a été publiée avec succès !');
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

      {/* En-tête de page */}
      <PageHeader
        title="Nouvelle demande de service"
        subtitle="Remplissez les informations ci-dessous"
      />

      {/* Bandeaux de retour */}
      {successMsg && (
        <AlertBanner
          variant="success"
          message={successMsg}
          onDismiss={() => setSuccessMsg('')}
        />
      )}
      {errorMsg && (
        <AlertBanner
          variant="error"
          message={errorMsg}
          onDismiss={() => setErrorMsg('')}
        />
      )}

      {/* Stepper */}
      <SectionCard>
        <StepIndicator steps={STEPS} currentStep={currentStep} />
      </SectionCard>

      {/* Contenu principal — 2 colonnes sur desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5 items-start">

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
              minLength={30}
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

//export default function NouvelleDemande() {
 // const { pathname } = useLocation();
  
//}
