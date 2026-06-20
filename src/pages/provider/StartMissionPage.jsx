// ============================================================
// FICHIER : src/pages/provider/StartMissionPage.jsx
// ÉCRAN N° : 18 — Démarrer Mission
// TÂCHE    : Semaine 3, J1-J3
// AUTEUR   : M4 · Kenfack
//
// CE QUE CETTE PAGE FAIT :
//   Le prestataire voit ici les détails d'une mission déjà payée
//   par le client (l'argent est "séquestré" = bloqué en attendant
//   la fin de la mission). Il doit :
//   1. Voir le résumé (client, montant, durée)
//   2. Voir l'adresse sur une carte
//   3. Cocher sa petite checklist avant de partir
//   4. Cliquer sur "Démarrer la mission maintenant"
//
// RÈGLE IMPORTANTE DE L'ÉQUIPE :
//   Les composants génériques (PageHeader, StatusBadge, MapEmbed,
//   PrimaryButton, etc.) sont déjà créés par M1·Krisan dans
//   src/components/common/. ON NE LES RECRÉE PAS, ON LES IMPORTE.
//   Si un composant manque, on le signale à Krisan via une PR.
// ============================================================

import React, { useState } from 'react';

// -------------------------------------------------------
// IMPORTS DES COMPOSANTS COMMUNS (créés par M1)
// Si certains n'existent pas encore chez toi exactement à ce chemin,
// regarde dans src/components/common/ et ajuste le chemin.
// -------------------------------------------------------
import PageHeader from '../../components/common/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import SectionCard from '../../components/common/SectionCard';
import MapEmbed from '../../components/common/MapEmbed';
import PrimaryButton from '../../components/common/PrimaryButton';
import UserAvatarCircle from '../../components/common/UserAvatarCircle';
import StarRating from '../../components/common/StarRating';
import AlertBanner from '../../components/common/AlertBanner';

// -------------------------------------------------------
// SOUS-COMPOSANT SPÉCIFIQUE PRESTATAIRE : PreDepartChecklist
// D'après serviloc_composants.md §4.16, ce composant doit vivre dans
// src/components/provider/mission/PreDepartChecklist.jsx
// On l'importe ici en supposant qu'il existe déjà ou qu'on le crée
// nous-même puisqu'il est dans NOTRE périmètre (espace provider/mission).
// -------------------------------------------------------
import PreDepartChecklist from '../../components/provider/mission/PreDepartChecklist';


// ============================================================
// DONNÉES MOCK — Détails de la mission à démarrer
// En S3, ces données viendront de l'API réelle :
// GET /provider/missions/:id  (voir API_CONTRACT.md)
// Pour l'instant : fausses données + fallback mock en cas d'échec API.
// ============================================================
const mockMissionData = {
  id: 'mission-042',
  titre: 'Plomberie — Fuite cuisine',
  statutLabel: 'PAYÉE & SÉQUESTRÉE',
  statutVariant: 'sequestre', // Voir StatusVariant dans serviloc_composants.md §1.4
  client: {
    nom: 'Madeleine Kamdem',
    initiale: 'M',
    note: 4.2,
    nbMissions: 3,
    verifie: true,
  },
  montant: '25 000 XAF',
  duree: '2 heures',
  adresse: 'Quartier Commercial, Bafoussam',
  montantSequestre: '25 000 XAF',
};

// Les items de la checklist avant départ (§4.16 du doc composants)
// "checked: true" au départ pour les 2 premiers = déjà préparés par le prestataire avant d'ouvrir la page
const mockChecklistInitiale = [
  { id: 'materiaux',  label: 'Matériaux préparés',          checked: true },
  { id: 'outils',     label: 'Outils chargés dans le véhicule', checked: true },
  { id: 'adresse',    label: 'Adresse client confirmée',     checked: false },
  { id: 'telephone',  label: 'Téléphone chargé',             checked: false },
];


// ============================================================
// FONCTION D'APPEL API AVEC FALLBACK MOCK
// Pattern obligatoire du planning v2 (page 13 du PDF) :
// on essaie l'API réelle, et si ça échoue (.catch) on retombe sur le mock.
// En S1/S2, VITE_USE_MOCK=true donc on n'appelle jamais vraiment le réseau.
// ============================================================
async function demarrerMissionAPI(missionId) {
  // À partir de S3, ce sera un vrai appel :
  // return axios.post(`/provider/missions/${missionId}/start`);
  //
  // Pour l'instant (S1/S2), on simule un appel réseau avec un délai
  return new Promise((resolve) => {
    setTimeout(() => resolve({ success: true }), 900);
  });
}


// ============================================================
// COMPOSANT PRINCIPAL : StartMissionPage
// "export default" = obligatoire pour que React Router affiche
// ce composant sur la route /provider/missions/:id/start
// ============================================================
export default function StartMissionPage() {

  // -------------------------------------------------------
  // ÉTATS (useState) — d'après serviloc_composants.md §4.15
  // -------------------------------------------------------

  // Les données de la mission (normalement chargées via un hook useMissionDetail)
  // Ici on les initialise directement avec le mock
  const [missionData] = useState(mockMissionData);

  // Les items de la checklist (peuvent changer quand on coche/décoche)
  const [checklistItems, setChecklistItems] = useState(mockChecklistInitiale);

  // true quand on a cliqué sur "Démarrer" et qu'on attend la réponse de l'API
  const [isStarting, setIsStarting] = useState(false);

  // true une fois la mission démarrée avec succès (pour changer l'affichage)
  const [missionDemarree, setMissionDemarree] = useState(false);

  // Message d'erreur si jamais l'API échoue
  const [erreur, setErreur] = useState(null);


  // -------------------------------------------------------
  // CALCUL : tous les items sont-ils cochés ?
  // .every() = méthode JS qui vérifie qu'UNE CONDITION est vraie
  // pour TOUS les éléments d'un tableau (renvoie true/false)
  // -------------------------------------------------------
  const toutEstCoche = checklistItems.every(item => item.checked);


  // -------------------------------------------------------
  // FONCTION : toggleChecklistItem
  // Appelée quand le prestataire clique sur une case de la checklist
  // "itemId" = l'identifiant de l'item cliqué (ex: 'adresse')
  // -------------------------------------------------------
  const toggleChecklistItem = (itemId) => {
    // .map() parcourt le tableau ; pour CHAQUE item :
    //   - si c'est celui qu'on a cliqué (item.id === itemId) → on inverse "checked"
    //   - sinon → on le laisse identique (...item = copie de l'objet)
    setChecklistItems(checklistItems.map(item =>
      item.id === itemId
        ? { ...item, checked: !item.checked } // !item.checked = l'inverse (true devient false, etc.)
        : item
    ));
  };


  // -------------------------------------------------------
  // FONCTION : handleDemarrerMission
  // Appelée quand le prestataire clique sur le gros bouton vert
  // "async" = cette fonction contient des opérations qui prennent du temps
  // (appel réseau), donc on utilise "await" pour attendre le résultat
  // -------------------------------------------------------
  const handleDemarrerMission = async () => {
    setIsStarting(true);  // Affiche un état de chargement sur le bouton
    setErreur(null);       // Réinitialise une éventuelle erreur précédente

    try {
      // "await" = on attend que la fonction se termine avant de continuer
      await demarrerMissionAPI(missionData.id);

      // Si on arrive ici, l'appel a réussi
      setMissionDemarree(true);

    } catch (error) {
      // "catch" = si l'API a renvoyé une erreur, on arrive ici
      // C'est le fallback mock évoqué dans le planning : on informe l'utilisateur
      // plutôt que de planter l'application
      setErreur("Impossible de démarrer la mission. Vérifiez votre connexion et réessayez.");

    } finally {
      // "finally" = ce bloc s'exécute TOUJOURS, que ça ait réussi ou échoué
      setIsStarting(false);
    }
  };


  // ============================================================
  // SI LA MISSION A ÉTÉ DÉMARRÉE AVEC SUCCÈS
  // On affiche un écran de confirmation simple au lieu du formulaire
  // ============================================================
  if (missionDemarree) {
    return (
      <div style={{ padding: '40px 28px', textAlign: 'center' }}>
        <div style={{ fontSize: '56px', marginBottom: '16px' }}>✅</div>
        <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
          Mission démarrée !
        </h1>
        <p style={{ color: '#64748B', fontSize: '14px' }}>
          Le client {missionData.client.nom} a été notifié. Bonne intervention !
        </p>
      </div>
    );
  }


  // ============================================================
  // AFFICHAGE PRINCIPAL DE LA PAGE
  // ============================================================
  return (
    <div style={{ padding: '24px 28px' }}>

      {/* ======== EN-TÊTE DE LA PAGE (composant commun PageHeader) ======== */}
      {/*
        On passe les props attendues par PageHeader (voir serviloc_composants.md §1.3) :
        title, subtitle, et "actions" si on veut un bouton à droite (pas nécessaire ici)
      */}
      <PageHeader
        title="Missions en attente"
        subtitle="Missions payées, prêtes à démarrer"
      />

      {/* Bandeau d'erreur si l'API a échoué (caché par défaut) */}
      {erreur && (
        <div style={{ marginTop: '16px' }}>
          <AlertBanner
            variant="error"
            title="Erreur"
            message={erreur}
          />
        </div>
      )}

      {/* ======== CONTENU EN 2 COLONNES ======== */}
      <div style={{
        display: 'flex',
        gap: '20px',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        marginTop: '20px',
      }}>

        {/* ---- COLONNE GAUCHE : détails mission + carte + bouton CTA ---- */}
        <div style={{ flex: 2, minWidth: '320px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* SectionCard = conteneur blanc standard du design system (§1.8) */}
          <SectionCard title="">
            {/* En-tête de la carte mission */}
            <div style={{ marginBottom: '16px' }}>
              <p style={{ fontSize: '12px', color: '#94A3B8', margin: 0 }}>
                Mission confirmée · Paiement reçu
              </p>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                flexWrap: 'wrap',
                gap: '10px',
                marginTop: '4px',
              }}>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                  {missionData.titre}
                </h2>
                {/* StatusBadge = composant commun §1.4. variant="sequestre" = couleur ambre */}
                <StatusBadge
                  label={missionData.statutLabel}
                  variant={missionData.statutVariant}
                />
              </div>
            </div>

            {/* Triplet d'infos : client / montant / durée (3 MetricCards mini) */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
              {[
                { label: 'CLIENT',         valeur: missionData.client.nom },
                { label: 'MONTANT',        valeur: missionData.montant },
                { label: 'DURÉE ESTIMÉE',  valeur: missionData.duree },
              ].map(info => (
                <div key={info.label} style={{
                  flex: 1,
                  minWidth: '140px',
                  backgroundColor: '#F8FAFC',
                  borderRadius: '10px',
                  padding: '12px 14px',
                }}>
                  <div style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 600, letterSpacing: '0.5px' }}>
                    {info.label}
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', marginTop: '4px' }}>
                    {info.valeur}
                  </div>
                </div>
              ))}
            </div>

            {/* Carte de localisation — composant commun MapEmbed (§1.17) */}
            <div style={{ marginBottom: '4px' }}>
              <p style={{
                fontSize: '11px',
                fontWeight: 600,
                color: '#94A3B8',
                letterSpacing: '0.5px',
                marginBottom: '8px',
              }}>
                LOCALISATION DE LA MISSION
              </p>
              <MapEmbed
                address={missionData.adresse}
                label={`📍 Adresse : ${missionData.adresse}`}
                interactive={false}
                height="220px"
              />
            </div>
          </SectionCard>

          {/* Carte séparée pour le bouton CTA (comme sur la maquette) */}
          <SectionCard title="">
            <p style={{ fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '12px' }}>
              Prêt à commencer l'intervention ?
            </p>

            {/*
              PrimaryButton = composant commun §1.10
              "disabled" = désactivé si la checklist n'est pas complète OU si en cours de chargement
              C'est une bonne pratique UX : on guide le prestataire à finir sa checklist avant de partir
            */}
            <PrimaryButton
              label={isStarting ? 'Démarrage en cours...' : '▶ Démarrer la mission maintenant'}
              onClick={handleDemarrerMission}
              disabled={!toutEstCoche || isStarting}
              fullWidth
            />

            {/* Petit message d'aide sous le bouton */}
            <p style={{ fontSize: '11px', color: '#94A3B8', marginTop: '8px', textAlign: 'center' }}>
              {toutEstCoche
                ? 'Le client sera notifié et l\'heure de début enregistrée'
                : '⚠️ Complétez la checklist à droite avant de démarrer'}
            </p>
          </SectionCard>
        </div>


        {/* ---- COLONNE DROITE : client + checklist + rappel séquestre ---- */}
        <div style={{ flex: 1, minWidth: '260px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Carte mini-profil du client */}
          <SectionCard title="CLIENT">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              {/* UserAvatarCircle = composant commun, avatar rond avec initiale */}
              <UserAvatarCircle initial={missionData.client.initiale} size="md" />
              <div>
                <div style={{ fontWeight: 700, fontSize: '14px', color: '#0F172A' }}>
                  {missionData.client.nom}
                </div>
                {/* StarRating = composant commun, affiche les étoiles + note numérique */}
                <StarRating value={missionData.client.note} size="sm" showValue />
              </div>
            </div>

            <p style={{ fontSize: '12px', color: '#64748B', marginBottom: '14px' }}>
              {missionData.client.nbMissions} missions
              {missionData.client.verifie && ' · Client vérifié'}
            </p>

            {/* Bouton secondaire pour contacter le client (mène vers le chat) */}
            <button style={{
              width: '100%',
              padding: '10px',
              borderRadius: '10px',
              border: '1px solid #E2E8F0',
              backgroundColor: '#FFFFFF',
              color: '#374151',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
            }}>
              💬 Contacter le client
            </button>
          </SectionCard>

          {/*
            Checklist avant départ — composant spécifique à notre périmètre (M4)
            On lui passe les items et la fonction de callback quand on coche
          */}
          <SectionCard title="CHECKLIST AVANT DÉPART">
            <PreDepartChecklist
              items={checklistItems}
              onToggle={toggleChecklistItem}
            />
          </SectionCard>

          {/* Bandeau de rappel séquestre — composant commun AlertBanner (§ variant info) */}
          <AlertBanner
            variant="info"
            title="🔒 Rappel séquestre"
            message={`${missionData.montantSequestre} séquestrés. Libération après double validation.`}
          />
        </div>

      </div>
    </div>
  );
}
