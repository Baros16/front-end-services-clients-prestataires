// src/componnents/provider/devis/creerDevis.helpers.js
// Fonctions utilitaires extraites de CreerDevis.jsx pour alléger le composant
// et permettre leur réutilisation/leur test isolément.

// ── Fallback client tant qu'il n'existe pas de getClientProfile(clientId) ──
// ServiceDemand (API_CONTRACT.md §4.4) ne contient que `clientId`, pas de
// fullName/rating/completedMissions : ces champs viendront d'un futur endpoint
// GET /provider/clients/:clientId (à ajouter au contrat avec le backend).
export function buildClientFallback(demand) {
  if (!demand) return null;
  return {
    id: demand.clientId,
    fullName: demand.clientName  || 'Client',
    avatarInitial: demand.clientName?.charAt(0).toUpperCase() || '?',
    rating: demand.clientRating ?? null,
    completedMissions: demand.clientCompletedMissions ?? null,
  };
}

// ── Extraction défensive du tableau de demandes ──
// getAvailableDemands() peut renvoyer soit un tableau brut, soit une
// enveloppe { success, data, meta } (pattern utilisé ailleurs dans le
// projet, cf. clentService.getCategories). On gère les deux cas ici pour
// éviter un crash "demands.find is not a function".
export function extractDemandsArray(result) {
  if (Array.isArray(result)) return result;
  if (Array.isArray(result?.data)) return result.data;
  if (Array.isArray(result?.demands)) return result.demands;
  return [];
}