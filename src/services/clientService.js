// src/services/clientService.js
import { getMock, getMockList } from "./mockSwitch.js";
import apiClient from "./apiClient.js";
import mockClientDashboard from "../data/client/mock_dashboard.json";
import mockDemands from "../data/client/mock_demands.json";
import mockQuote from "../data/client/mock_quote.json";
import mockMission from "../data/client/mock_mission.json";

// ─── En-tête du fichier — ajout ────────────────────────────────────────────
function normalizeStatus(obj) {
  if (!obj) return obj;
  return {
    ...obj,
    status: typeof obj.status === "string" ? obj.status.toLowerCase() : obj.status,
  };
}

/**
 * Tableau de bord client.
 */
export async function getClientDashboard() {
  return getMock(
    mockClientDashboard,
    () => apiClient.get(`/client/dashboard`),
  );
}

/**
 * Liste des demandes du client.
 * params : { page, limit, status }
 */
export async function getClientDemands(params = {}) {
  const result = await getMockList(
    mockDemands,
    () => apiClient.get(`/client/demands`, { params }),
  );
  return { ...result, data: result.data.map(normalizeStatus) };
}

/**
 * Créer une nouvelle demande.
 * payload : { categoryId, description, location, isUrgent, estimatedBudget, photoIds }
 */
/**
 * Détail complet d'une demande du client.
 */
export async function getDemandDetail(demandId) {
  const result = await getMock(
    mockDemands,
    () => apiClient.get(`/client/demands/${demandId}`),
  );
  // mockDemands est une liste → on filtre par id
  const list = Array.isArray(result) ? result : (result?.data ?? []);
  const found = list.find((d) => d.id === demandId) ?? null;
  return found ? normalizeStatus(found) : null;
}

/**
 * Liste des postulants (prestataires ayant postulé) pour une demande donnée.
 */
export async function getDemandApplications(demandId) {
  // Import dynamique pour éviter les imports circulaires
  const mockApplications = await import('../data/client/mock_demand_applications.json');
  const result = await getMock(
    mockApplications,
    () => apiClient.get(`/client/demands/${demandId}/applications`),
  );
  const list = Array.isArray(result) ? result : (result?.data ?? []);
  return list.filter((app) => app.demandId === demandId);
}

export async function createDemand(payload) {
  return getMock(
    { data: { success: true, data: payload } },
    () => apiClient.post(`/client/demands`, payload),
  );
}

/**
 * Détail d'un devis reçu, enrichi des infos prestataire + demande.
 * En S2 : ignore quoteId, retourne toujours le mock enrichi.
 * En S3 : GET /client/devis/:quoteId
 */
export function getQuoteDetail(quoteId) {
  const enriched = {
    data: {
      ...mockQuote.data,
      provider: {
        id: 'usr_jcm456',
        fullName: 'Jean-Claude Mbarga',
        avatarInitial: 'J',
        rating: 4.8,
        missionsCount: 47,
      },
      demand: { category: 'Plomberie', description: 'Fuite cuisine' },
    },
  };
  return getMock(
    enriched,
    () => apiClient.get(`/client/devis/${quoteId}`),
  );
}

/**
 * Accepter un devis et déclencher le paiement.
 */
export async function acceptQuote(demandId, quoteId, paymentMethod, phoneNumber) {
  // AcceptQuoteRequest réel exige { quoteId, paymentMethod, phoneNumber } — les 3 requis.
  return getMock(
    { data: { success: true, data: { demandId, status: "en_cours", paymentMethod } } },
    () => apiClient.post(`/client/demands/${demandId}/quote/accept`, { quoteId, paymentMethod, phoneNumber }),
  );
}

/**
 * Refuser un devis reçu.
 */
export async function rejectQuote(demandId) {
  return getMock(
    { data: { success: true, data: { demandId, status: "ouverte" } } },
    () => apiClient.post(`/client/demands/${demandId}/quote/reject`),
  );
}


export async function getClientMissions() {
  const result = await getMock(
    mockMission,
    () => apiClient.get(`/client/missions`),
  );
  return Array.isArray(result) ? result.map(normalizeStatus) : [];
}

/**
 * Détail d'une mission en cours.
 */
export async function getMission(missionId) {
  const result = await getMock(
    mockMission,
    () => apiClient.get(`/client/missions/${missionId}`),
  );
  return normalizeStatus(result);
}

export async function getMissionDetails(missionId) {
  const result = await getMock(
    mockMission.data,
    () => apiClient.get(`/client/missions/${missionId}`), // laisser getMock déballer
  );
  return normalizeStatus(result);
}



/**
 * Valider une mission terminée.
 */
export async function validateMission(missionId) {
  return getMock(
    { data: { success: true, data: { missionId, status: "terminee" } } },
    () => apiClient.post(`/client/missions/${missionId}/validate`),
  );
}

/**
 * Noter une mission.
 * payload : { rating: 1-5, comment }
 */
export async function rateMission(missionId, payload) {
  return getMock(
    { data: { success: true, data: { missionId, ...payload } } },
    () => apiClient.post(`/client/missions/${missionId}/rate`, payload),
  );
}

/**
 * Ouvrir un litige sur une mission.
 * payload : { motifId, description, evidencePhotoIds }
 */
export async function createLitige(missionId, payload) {
  return getMock(
    { data: { success: true, data: { missionId, status: "ouvert" } } },
    () => apiClient.post(`/client/missions/${missionId}/litige`, payload),
  );
}
