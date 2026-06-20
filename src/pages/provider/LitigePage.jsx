// ============================================================
// FICHIER : src/pages/provider/LitigePage.jsx
// ÉCRAN N° : 11 — Signaler Litige (côté Prestataire)
// TÂCHE    : Semaine 3, J4-J5
// AUTEUR   : M4 · Kenfack
//
// CE QUE CETTE PAGE FAIT :
//   Le prestataire signale un problème survenu pendant une mission
//   (ex : client absent, client agressif, conditions dangereuses...).
//   Il doit :
//   1. Choisir un motif parmi une liste de cases
//   2. Écrire une description détaillée
//   3. Ajouter des photos comme preuves (optionnel)
//   4. Voir le montant concerné par la mission
//   5. Soumettre le litige
//
// NOTE : la maquette annotée fournie (08_CLIENT_Signaler_Litige)
// est la version CÔTÉ CLIENT. Le motif de litige côté PRESTATAIRE
// est différent (ce n'est pas le prestataire qui se plaint de son
// propre travail !). On garde la même structure visuelle (mêmes
// composants : LitigeMotifSelector, PhotoUploader, AmountDisplay)
// mais avec des motifs adaptés au point de vue du prestataire.
// ============================================================

import React, { useState } from 'react';

// -------------------------------------------------------
// IMPORTS DES COMPOSANTS COMMUNS (créés par M1 dans common/)
// -------------------------------------------------------
import PageHeader from '../../components/common/PageHeader';
import SectionCard from '../../components/common/SectionCard';
import FormField from '../../components/common/FormField';
import PhotoUploader from '../../components/common/PhotoUploader';
import AmountDisplay from '../../components/common/AmountDisplay';
import PrimaryButton from '../../components/common/PrimaryButton';
import SecondaryButton from '../../components/common/SecondaryButton';
import AlertBanner from '../../components/common/AlertBanner';

// -------------------------------------------------------
// LitigeMotifSelector existe déjà dans l'espace CLIENT
// (src/components/client/litige/LitigeMotifSelector.jsx créé par M3·Archange
// d'après l'arborescence officielle). C'est un composant générique
// (juste une liste de cases sélectionnables), donc on le RÉUTILISE
// au lieu de le dupliquer — bonne pratique DRY (Don't Repeat Yourself).
// Si jamais ce chemin n'existe pas chez toi, signale-le à M3/M1 en PR.
// -------------------------------------------------------
import LitigeMotifSelector from '../../components/client/litige/LitigeMotifSelector';


// ============================================================
// DONNÉES MOCK — Infos de la mission concernée par le litige
// En S3, ces données viendront de l'API réelle :
// GET /provider/missions/:id  (voir API_CONTRACT.md)
// ============================================================
const mockMissionConcernee = {
  id: 'mission-042',
  titre: 'Plomberie',
  client: 'Madeleine Kamdem',
  montant: 25000, // en XAF, nombre brut (AmountDisplay formatera l'affichage)
};

// -------------------------------------------------------
// Les motifs de litige DU POINT DE VUE DU PRESTATAIRE
// (différents des motifs côté client visibles dans la maquette)
// Chaque motif = { id, title, description }
// -------------------------------------------------------
const motifsPrestataire = [
  {
    id: 'client_absent',
    title: 'Client absent',
    description: 'Le client ne s\'est pas présenté au rendez-vous convenu',
  },
  {
    id: 'acces_impossible',
    title: 'Accès impossible',
    description: 'Impossible d\'accéder au lieu de la mission (porte fermée, adresse erronée...)',
  },
  {
    id: 'conditions_dangereuses',
    title: 'Conditions dangereuses',
    description: 'L\'environnement de travail présente un risque pour ma sécurité',
  },
  {
    id: 'demande_hors_devis',
    title: 'Demande hors devis',
    description: 'Le client exige des travaux non prévus dans le devis initial',
  },
  {
    id: 'comportement_inapproprie',
    title: 'Comportement inapproprié',
    description: 'Le client a eu un comportement agressif ou irrespectueux',
  },
];


// ============================================================
// FONCTION D'APPEL API AVEC FALLBACK MOCK
// Pattern obligatoire de l'équipe (planning v2 page 13) :
// on essaie le vrai endpoint, et en cas d'échec on retombe sur le mock
// pour ne jamais bloquer la démo.
// D'après API_CONTRACT.md : POST /provider/missions/:id/litige (UC12)
// ============================================================
async function soumettreLitigeAPI(missionId, payload) {
  // À partir de S3 :
  // return axios.post(`/provider/missions/${missionId}/litige`, payload);
  //
  // Pour l'instant (S1/S2), on simule un appel réseau avec un délai
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // On simule un succès dans 95% des cas (pour pouvoir tester l'erreur aussi)
      if (Math.random() > 0.05) {
        resolve({ success: true, litigeId: 'litige-' + Date.now() });
      } else {
        reject(new Error('Erreur réseau simulée'));
      }
    }, 1000);
  });
}


// ============================================================
// COMPOSANT PRINCIPAL : LitigePage
// "export default" obligatoire pour React Router
// ============================================================
export default function LitigePage() {

  // -------------------------------------------------------
  // ÉTATS — d'après serviloc_composants.md §3.33
  // -------------------------------------------------------

  // Le motif sélectionné (null = aucun motif choisi encore)
  const [selectedMotif, setSelectedMotif] = useState(null);

  // Le texte de description écrit par le prestataire
  const [description, setDescription] = useState('');

  // Les photos ajoutées comme preuves (tableau de { id, url, name })
  const [evidences, setEvidences] = useState([]);

  // true pendant l'envoi du formulaire (pour désactiver le bouton)
  const [isSubmitting, setIsSubmitting] = useState(false);

  // true une fois le litige envoyé avec succès
  const [litigeEnvoye, setLitigeEnvoye] = useState(false);

  // Message d'erreur de validation (champ manquant) ou d'API
  const [erreur, setErreur] = useState(null);


  // -------------------------------------------------------
  // FONCTION : handleAjoutPhoto
  // Appelée par le composant PhotoUploader quand on ajoute un fichier
  // "file" = l'objet File du navigateur (l'image choisie)
  // -------------------------------------------------------
  const handleAjoutPhoto = (file) => {
    // URL.createObjectURL() = crée une URL temporaire pour afficher
    // l'image dans le navigateur SANS l'envoyer au serveur (juste pour la preview)
    const nouvellePhoto = {
      id: 'photo-' + Date.now(), // identifiant unique basé sur l'heure actuelle
      url: URL.createObjectURL(file),
      name: file.name,
    };

    // On ajoute la nouvelle photo à la liste existante
    // "..." (spread) = on garde toutes les anciennes photos + on ajoute la nouvelle
    setEvidences([...evidences, nouvellePhoto]);
  };


  // -------------------------------------------------------
  // FONCTION : handleRetraitPhoto
  // Appelée quand on clique sur "supprimer" sur une miniature
  // -------------------------------------------------------
  const handleRetraitPhoto = (photoId) => {
    // .filter() = on garde toutes les photos SAUF celle dont l'id correspond
    setEvidences(evidences.filter(photo => photo.id !== photoId));
  };


  // -------------------------------------------------------
  // FONCTION : handleSoumettre
  // Appelée quand le prestataire clique sur "Envoyer le signalement"
  // -------------------------------------------------------
  const handleSoumettre = async () => {

    // ---- VALIDATION avant envoi ----
    // On vérifie que les champs obligatoires sont remplis
    if (!selectedMotif) {
      setErreur('Merci de sélectionner un motif de litige.');
      return; // "return" arrête la fonction ici, on n'envoie rien
    }

    if (description.trim().length < 10) {
      // .trim() enlève les espaces inutiles avant/après le texte
      setErreur('Merci de décrire la situation en au moins 10 caractères.');
      return;
    }

    // Si tout est valide, on efface l'erreur et on lance l'envoi
    setErreur(null);
    setIsSubmitting(true);

    try {
      await soumettreLitigeAPI(mockMissionConcernee.id, {
        motif: selectedMotif,
        description: description,
        // Dans une vraie app on uploaderait les fichiers ; ici on envoie juste les noms
        preuves: evidences.map(e => e.name),
      });

      setLitigeEnvoye(true); // Succès → on affiche l'écran de confirmation

    } catch (error) {
      // Fallback : message d'erreur clair pour l'utilisateur, app non bloquée
      setErreur("L'envoi a échoué. Vérifiez votre connexion et réessayez.");

    } finally {
      setIsSubmitting(false);
    }
  };


  // ============================================================
  // ÉCRAN DE CONFIRMATION après envoi réussi
  // ============================================================
  if (litigeEnvoye) {
    return (
      <div style={{ padding: '60px 28px', textAlign: 'center' }}>
        <div style={{ fontSize: '56px', marginBottom: '16px' }}>📨</div>
        <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
          Litige signalé
        </h1>
        <p style={{ color: '#64748B', fontSize: '14px', maxWidth: '420px', margin: '0 auto' }}>
          Votre signalement a été transmis à notre équipe Service Client.
          Vous recevrez une réponse sous 24h.
        </p>
      </div>
    );
  }


  // ============================================================
  // AFFICHAGE PRINCIPAL DU FORMULAIRE
  // ============================================================
  return (
    <div style={{ padding: '24px 28px', maxWidth: '760px' }}>

      {/* ======== EN-TÊTE (composant commun PageHeader) ======== */}
      <PageHeader
        title="Signaler un litige"
        subtitle={`Mission ${mockMissionConcernee.titre} · ${mockMissionConcernee.client}`}
      />

      {/* Bandeau d'erreur (validation ou API), caché par défaut */}
      {erreur && (
        <div style={{ marginTop: '16px' }}>
          <AlertBanner variant="error" title="Attention" message={erreur} />
        </div>
      )}

      <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* ==== SECTION 1 : MOTIF DU LITIGE ==== */}
        <SectionCard title="MOTIF DU LITIGE">
          {/*
            LitigeMotifSelector = composant générique (réutilisé depuis l'espace client)
            Props attendues (§3.34) : motifs, selectedId, onChange
          */}
          <LitigeMotifSelector
            motifs={motifsPrestataire}
            selectedId={selectedMotif}
            onChange={setSelectedMotif}
          />
        </SectionCard>

        {/* ==== SECTION 2 : DESCRIPTION DÉTAILLÉE + PHOTOS ==== */}
        <SectionCard title="DESCRIPTION DÉTAILLÉE">
          {/*
            FormField = composant commun §1.9
            type="textarea" pour une zone de texte multi-lignes
          */}
          <FormField
            label="Décrivez la situation"
            type="textarea"
            placeholder="Expliquez ce qui s'est passé en détail..."
            value={description}
            onChange={setDescription}
            helperText="Minimum 10 caractères. Soyez précis : date, heure, faits observés."
            required
          />

          {/* Zone d'upload de photos, séparée par un peu d'espace */}
          <div style={{ marginTop: '20px' }}>
            {/*
              PhotoUploader = composant commun §1.18
              Props : maxPhotos, photos, onAdd, onRemove, label
            */}
            <PhotoUploader
              label="PHOTOS (OPTIONNEL)"
              maxPhotos={4}
              photos={evidences}
              onAdd={handleAjoutPhoto}
              onRemove={handleRetraitPhoto}
            />
          </div>
        </SectionCard>

        {/* ==== SECTION 3 : MONTANT CONCERNÉ ==== */}
        <SectionCard title="MONTANT CONCERNÉ">
          {/*
            AmountDisplay = composant commun, affiche un montant en gros chiffres
            On lui passe la valeur numérique du montant de la mission
          */}
          <AmountDisplay amount={mockMissionConcernee.montant} currency="XAF" size="lg" />
        </SectionCard>

        {/* ==== BOUTONS D'ACTION EN BAS ==== */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          {/* SecondaryButton = composant commun, bouton "annuler" discret */}
          <SecondaryButton label="Annuler" onClick={() => window.history.back()} />

          {/*
            PrimaryButton = composant commun, bouton principal d'action
            "disabled" pendant l'envoi pour éviter un double-clic accidentel
          */}
          <PrimaryButton
            label={isSubmitting ? 'Envoi en cours...' : 'Envoyer le signalement'}
            onClick={handleSoumettre}
            disabled={isSubmitting}
          />
        </div>

      </div>
    </div>
  );
}
