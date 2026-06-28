// src/services/clientService.js
// Exemple complet d'utilisation du switch mock/API pour le client

import axios from "axios";
import { getMock, getMockList } from "./mockSwitch.js";
import mockClientDashboard from "../data/client/mock_dashboard.json";
import mockDemands from "../data/client/mock_demands.json";
import mockQuote from "../data/client/mock_quote.json";
import mockMission from "../data/client/mock_mission.json";


const BASE = "/client";

export async function getClientDashboard() {
  return getMock(mockClientDashboard, () => axios.get(`${BASE}/dashboard`));
}

export async function getClientDemands(params = {}) {
  // params : { page, limit, status }
  return getMockList(mockDemands, () =>
    axios.get(`${BASE}/demands`, { params })
  );
}

export async function createDemand(payload) {
  // payload : { categoryId, description, location, isUrgent, estimatedBudget, photoIds }
  return getMock({ success: true, data: payload }, () =>
    axios.post(`${BASE}/demands`, payload)
  );
}

export async function acceptQuote(demandId) {
  return getMock(
    { success: true, data: { demandId, status: "en_cours" } },
    () => axios.post(`${BASE}/demands/${demandId}/quote/accept`)
  );
}

export async function rejectQuote(demandId) {
  return getMock(
    { success: true, data: { demandId, status: "ouverte" } },
    () => axios.post(`${BASE}/demands/${demandId}/quote/reject`)
  );
}

export async function getMission(missionId) {
  return getMock(mockMission, () =>
    axios.get(`${BASE}/missions/${missionId}`)
  );
}

export async function validateMission(missionId) {
  return getMock(
    { success: true, data: { missionId, status: "terminee" } },
    () => axios.post(`${BASE}/missions/${missionId}/validate`)
  );
}

export async function rateMission(missionId, payload) {
  // payload : { rating: 1-5, comment }
  return getMock(
    { success: true, data: { missionId, ...payload } },
    () => axios.post(`${BASE}/missions/${missionId}/rate`, payload)
  );
}

export async function createLitige(missionId, payload) {
  // payload : { motifId, description, evidencePhotoIds }
  return getMock(
    { success: true, data: { missionId, status: "ouvert" } },
    () => axios.post(`${BASE}/missions/${missionId}/litige`, payload)
  );
}
