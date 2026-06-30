// src/services/clientService.js
import { getMock, getMockList } from "./mockSwitch.js";
import apiClient from "./apiClient.js";
import mockClientDashboard from "../data/client/mock_dashboard.json";
import mockDemands from "../data/client/mock_demands.json";
import mockQuote from "../data/client/mock_quote.json";
import mockMission from "../data/client/mock_mission.json";

/**
 * Tableau de bord client.
 */
export async function getClientDashboard() {
  return getMock(
    mockClientDashboard,
    () => apiClient.get(`/client/dashboard`).then(r => r.data.data),
  );
}

/**
 * Liste des demandes du client.
 * params : { page, limit, status }
 */
export async function getClientDemands(params = {}) {
  return getMockList(
    mockDemands,
    () => apiClient.get(`/client/demands`, { params }).then(r => r.data.data),
  );
}

/**
 * Créer une nouvelle demande.
 * payload : { categoryId, description, location, isUrgent, estimatedBudget, photoIds }
 */
export async function createDemand(payload) {
  return getMock(
    { success: true, data: payload },
    () => apiClient.post(`/client/demands`, payload).then(r => r.data.data),
  );
}

/**
 * Détail d'un devis reçu, enrichi des infos prestataire + demande.
 * En S2 : ignore quoteId, retourne toujours le mock enrichi.
 * En S3 : GET /client/devis/:quoteId
 */
export function getQuoteDetail(quoteId) {
  const enriched = {
    ...mockQuote.data,
    provider: {
      id: 'usr_jcm456',
      fullName: 'Jean-Claude Mbarga',
      avatarInitial: 'J',
      rating: 4.8,
      missionsCount: 47,
    },
    demand: { category: 'Plomberie', description: 'Fuite cuisine' },
  };
  return getMock(
    enriched,
    () => apiClient.get(`/client/devis/${quoteId}`).then(r => r.data.data),
  );
}

/**
 * Accepter un devis et déclencher le paiement.
 */
export async function acceptQuote(demandId, paymentMethod) {
  return getMock(
    { success: true, data: { demandId, status: "en_cours", paymentMethod } },
    () => apiClient
      .post(`/client/demands/${demandId}/quote/accept`, { paymentMethod })
      .then(r => r.data.data),
  );
}

/**
 * Refuser un devis reçu.
 */
export async function rejectQuote(demandId) {
  return getMock(
    { success: true, data: { demandId, status: "ouverte" } },
    () => apiClient
      .post(`/client/demands/${demandId}/quote/reject`)
      .then(r => r.data.data),
  );
}

/**
 * Détail d'une mission en cours.
 */
export async function getMission(missionId) {
  return getMock(
    mockMission,
    () => apiClient.get(`/client/missions/${missionId}`).then(r => r.data.data),
  );
}

/**
 * Valider une mission terminée.
 */
export async function validateMission(missionId) {
  return getMock(
    { success: true, data: { missionId, status: "terminee" } },
    () => apiClient.post(`/client/missions/${missionId}/validate`).then(r => r.data.data),
  );
}

/**
 * Noter une mission.
 * payload : { rating: 1-5, comment }
 */
export async function rateMission(missionId, payload) {
  return getMock(
    { success: true, data: { missionId, ...payload } },
    () => apiClient.post(`/client/missions/${missionId}/rate`, payload).then(r => r.data.data),
  );
}

/**
 * Ouvrir un litige sur une mission.
 * payload : { motifId, description, evidencePhotoIds }
 */
export async function createLitige(missionId, payload) {
  return getMock(
    { success: true, data: { missionId, status: "ouvert" } },
    () => apiClient.post(`/client/missions/${missionId}/litige`, payload).then(r => r.data.data),
  );
}