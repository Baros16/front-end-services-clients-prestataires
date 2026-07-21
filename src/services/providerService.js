// src/services/providerService.js
import { getMock, getMockList } from "./mockSwitch.js";
import apiClient from "./apiClient.js";
import mock_dashboard from "../data/provider/mock_dashboard.json";
import mock_avilable_demands from "../data/provider/mock_available_demands.json";
import mock_profile     from "../data/provider/mock_profile.json"
import mock_missions from "../data/provider/mock_mission.json"
import mock_quote from "../data/client/mock_quote.json"

function normalizeMissionStatus(mission) {
  if (!mission) return mission;
  return {
    ...mission,
    status: typeof mission.status === "string" ? mission.status.toLowerCase() : mission.status,
  };
}

export async function getProviderDashboard() {
  return getMock(
    mock_dashboard,
    () => apiClient.get(`/provider/dashboard`).then(r => r.data.data),
  );
}

export async function getAvailableDemands(params = {}) {
  // params : { categoryId } — l'API réelle ne supporte que categoryId, pas de pagination
  return getMockList(
    mock_avilable_demands,
    () => apiClient.get(`/provider/demands`, { params }).then(r => r.data.data),
  );
}

export async function getProviderMissions(params = {}) {
  // params : { status, page, limit }
  const filtered = params.status
    ? mock_missions.data.filter(m => m.status === params.status)
    : mock_missions.data;

  return getMock(
    filtered,
    () => apiClient
      .get('/provider/missions', { params })
      .then(r => r.data.data),
  );
}

export async function getMissionById(missionId) {
  const found = mock_missions.data.find(m => m.id === missionId) ?? null;

  const result = await getMock(
    { data: found },
    () => apiClient.get(`/provider/missions/${missionId}`).then(r => r.data.data),
  );

  return normalizeMissionStatus(result);
}


export async function addMissionSteps(missionId, payload) {
  const mockSteps = payload.steps.map((s, i) => ({
    id: `step_${String(i + 1).padStart(3, "0")}`,
    label: s.label,
    order: s.order ?? i + 1,
    completed: false,
  }));

  return getMock(
    {
      success: true,
      data: {
        missionId,
        estimatedDurationHours: payload.estimatedDurationHours,
        steps: mockSteps,
      },
    },
    () => apiClient.post(`/provider/missions/${missionId}/steps`, payload).then(r => r.data.data),
  );
}

export async function applyToDemand(demandId) {
  return getMock(
    { success: true, data: { demandId, status: "applied" } },
    () => apiClient.post(`/provider/demands/${demandId}/apply`).then(r => r.data.data),
  );
}

export async function submitQuote(demandId, payload) {
  // payload : { laborDescription, laborAmount, materials[], estimatedDurationHours, validityDays }
  return getMock(
    { success: true, data: { demandId, ...payload } },
    () => apiClient.post(`/provider/demands/${demandId}/quote`, payload).then(r => r.data.data),
  );
}

export async function getQuoteById(quoteId) {
  return getMock(
    { data: mock_quote.data },
    () => apiClient.get(`/provider/quotes/${quoteId}`).then(r => r.data.data),
  );
}

export async function updateQuote(quoteId, payload) {
  return getMock(
    { success: true, data: { id: quoteId, ...payload } },
    () => apiClient.patch(`/provider/quotes/${quoteId}`, payload).then(r => r.data.data),
  );
}



export async function startMission(missionId) {
  return getMock(
    { success: true, data: { missionId, status: "en_cours" } },
    () => apiClient.post(`/provider/missions/${missionId}/start`).then(r => r.data.data),
  );
}

export async function updateStep(missionId, stepId, completed) {
  return getMock(
    { success: true, data: { missionId, stepId, completed } },
    () => apiClient
      .patch(`/provider/missions/${missionId}/steps/${stepId}`, { completed })
      .then(r => r.data.data),
  );
}

export async function completeMission(missionId) {
  return getMock(
    { success: true, data: { missionId, status: "terminee" } },
    () => apiClient.post(`/provider/missions/${missionId}/complete`).then(r => r.data.data),
  );
}

// ─── Nouveau — API_CONTRACT v2.1 (S2/S4, livré et testé) ───────────────────

/**
 * Mise à jour du profil professionnel (spécialité, tarif, zone de service).
 * v2.1 : payload enrichi avec latitude / longitude / serviceZoneCity / radiusKm.
 */

export async function getProviderProfile() {
  return getMock(
    mock_profile,
    () => apiClient.get(`/provider/me`).then(r => r.data.data),
  );
}

export async function updateProfile(payload) {
  // payload : { firstName, lastName, phone, specialty, hourlyRate,
  //             serviceZoneCity, latitude, longitude, radiusKm,
  //             estCertifie, certifications[], documentIds[] }
  // ⚠️ Champs à plat — UpdateProfileRequest réel n'accepte pas de serviceZone imbriqué.
  return getMock(
    {
      success: true,
      data: { providerId: "usr_2f19902b", message: "Profil mis à jour avec succès" },
    },
    () => apiClient.patch(`/provider/profile`, payload).then(r => r.data.data),
  );
}

/**
 * Bascule disponible / indisponible.
 */
export async function updateAvailability(isAvailable) {
  return getMock(
    {
      success: true,
      data: { providerId: "usr_2f19902b", isAvailable, message: "Disponibilité mise à jour" },
    },
    () => apiClient.patch(`/provider/availability`, { isAvailable }).then(r => r.data.data),
  );
}

/**
 * Mise à jour des horaires hebdomadaires.
 * ⚠️ v2.1 : body À PLAT (les jours à la racine) — plus de clé `schedule` qui enveloppe.
 */
export async function updateSchedule(schedule) {
  // schedule : { monday: { start, end, available }, tuesday: {...}, ..., sunday: {...} }
  return getMock(
    {
      success: true,
      data: { providerId: "usr_2f19902b", message: "Horaires mis à jour avec succès" },
    },
    () => apiClient.patch(`/provider/schedule`, schedule).then(r => r.data.data),
  );
}

/**
 * Historique des gains du prestataire.
 * ⚠️ v2.1 : réponse simplifiée — { monthlyTotal, payouts[] }. PAS de missions[]
 * pour l'instant (implémentation backend future). Écran 21 (M5) : ne pas
 * construire de section "missions liées" tant que ce n'est pas livré.
 */
export async function getEarnings(params = {}) {
  // params : { page, month } — ex. month: "2026-05"
  return getMock(
    mock_earnings.data,
    () => apiClient.get(`/provider/earnings`, { params }).then(r => r.data.data),
  );
}


/**
 * Mise à jour de la position GPS du prestataire pendant une mission.
 * Endpoint à ajouter au contrat : PATCH /provider/missions/:id/location
 *
 * @param {string} missionId
 * @param {number} lat
 * @param {number} lng
 */
export async function updateMissionLocation(missionId, lat, lng) {
  return getMock(
    {
      missionId,
      lat,
      lng,
      updatedAt: new Date().toISOString(),
    },
    () => apiClient
      .patch(`/provider/missions/${missionId}/location`, { lat, lng })
      .then(r => r.data.data),
  );
}