// src/services/clientService.js
import { getMock, getMockList, USE_MOCK } from "./mockSwitch.js";
import apiClient from "./apiClient.js";
import mockClientDashboard from "../data/client/mock_dashboard.json";
import mockDemands from "../data/client/mock_demands.json";
import mockQuote from "../data/client/mock_quote.json";
import mockMission from "../data/client/mock_mission.json";
import mockProvidersSearch from "../data/client/mock_providers_search.json";
import mockApplications from "../data/client/mock_demand_applications.json";

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
  let data = result.data.map(normalizeStatus);
  // Appliquer le filtre par statut en mode mock
  if (params.status) {
    data = data.filter((d) => d.status === params.status);
  }
  return { ...result, data };
}

/**
 * Détail complet d'une demande du client.
 * GET /client/demands/:demandId renvoie un objet <Demand> unique (pas une liste).
 */
export async function getDemandDetail(demandId) {
  const result = await getMock(
    { data: mockDemands.data.find((d) => d.id === demandId) ?? null },
    () => apiClient.get(`/client/demands/${demandId}`),
  );
  return result ? normalizeStatus(result) : null;
}

/**
 * Liste des postulants (prestataires ayant postulé) pour une demande donnée.
 * L'endpoint réel est déjà scopé par demandId dans l'URL ; le filtre par
 * demandId n'est appliqué qu'en mode mock, car le mock local mélange
 * plusieurs demandes dans un seul fichier.
 */
/**
 * Liste des postulants (prestataires ayant postulé) pour une demande donnée.
 */
export async function getDemandApplications(demandId) {
  const result = await getMockList(
    mockApplications,
    () => apiClient.get(`/client/demands/${demandId}/applications`),
  );

  if (USE_MOCK) {
    return result.data.filter((app) => app.demandId === demandId);
  }

  // En API réelle, 'result' est directement la réponse de l'apiClient
  // (ou result.data si ton interceptor Axios déballe déjà les données)
  return result?.data ?? result ?? [];
}
export async function createDemand(payload) {
  return getMock(
    { data: { success: true, data: payload } },
    () => apiClient.post(`/client/demands`, payload),
  );
}

/**
 * Détail d'un devis reçu.
 * ⚠️ Le backend ne renvoie que providerId / demandId (pas d'objets imbriqués).
 * En mode mock, on enrichit avec provider{} et demand{} pour faciliter le dev
 * UI sans dépendre d'appels supplémentaires. En mode API réelle, provider et
 * demand sont normalisés à null si absents — le composant consommateur doit
 * gérer ce cas (ex : aller chercher les infos via un autre endpoint, ou
 * afficher un fallback tant que le backend n'enrichit pas la réponse).
 */
export async function getQuoteDetail(quoteId) {
  const enrichedMock = {
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

  const result = await getMock(
    enrichedMock,
    () => apiClient.get(`/client/devis/${quoteId}`),
  );

  return {
    ...result,
    provider: result.provider ?? null,
    demand: result.demand ?? null,
  };
}

/**
 * Accepter un devis et déclencher le paiement.
 * Le backend renvoie un ApiResponseVoid (data vide) : cette requête initie
 * seulement le push USSD, elle ne confirme pas le paiement. La confirmation
 * doit être vérifiée séparément via polling sur getDemandDetail().
 */
export async function acceptQuote(demandId, quoteId, paymentMethod, phoneNumber) {
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

/**
 * Liste des missions du client.
 * params : { page, limit, status }
 */
export async function getClientMissions(params = {}) {
  const result = await getMockList(
    mockMission,
    () => apiClient.get(`/client/missions`, { params }),
  );
  let data = result.data.map(normalizeStatus);
  if (params.status) {
    data = data.filter((m) => m.status === params.status);
  }
  return { ...result, data };
}

/**
 * Détail d'une mission en cours.
 * GET /client/missions/:missionId renvoie un objet <Mission> unique (pas une liste).
 */
export async function getMission(missionId) {
  const result = await getMock(
    { data: mockMission.data.find((m) => m.id === missionId) ?? null },
    () => apiClient.get(`/client/missions/${missionId}`),
  );
  return result ? normalizeStatus(result) : null;
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

/**
 * Rechercher des prestataires (mode urgence).
 * ⚠️ v2.1 : endpoint temporaire en mock — route API à définir avec le backend.
 * params : { query, category, page, limit }
 */
export async function searchProviders(params = {}) {
  return getMockList(
    mockProvidersSearch,
    () => apiClient.get(`/client/providers/search`, { params }),
  );
}