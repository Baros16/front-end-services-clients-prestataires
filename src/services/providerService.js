// src/services/providerService.js

import axios from "./apiClient.js";
import { getMock, getMockList } from "./mockSwitch.js";

// ✅ Import depuis les vrais fichiers JSON existants
import mockDashboard       from "../data/provider/mock_dashboard.json";
import mockAvailableDemands from "../data/provider/mock_available_demands.json";
import mockLitigeMotifs    from "../data/shared/mock_litige_motifs.json";

const BASE = "/provider";

export async function getProviderDashboard() {
  return getMock(mockDashboard, () =>
    axios.get(`${BASE}/dashboard`).then((r) => r.data.data)
  );
}

export async function getAvailableDemands(params = {}) {
  return getMockList(mockAvailableDemands, () =>
    axios.get(`${BASE}/demands/available`, { params })
  );
}

export async function getLitigeMotifs() {
  return getMock(mockLitigeMotifs, () =>
    axios.get(`/shared/litige-motifs`).then((r) => r.data.data)
  );
}

export async function applyToDemand(demandId) {
  return getMock(
    { data: { demandId, status: "applied" } },
    () => axios.post(`${BASE}/demands/${demandId}/apply`).then((r) => r.data.data)
  );
}

export async function submitQuote(demandId, payload) {
  return getMock(
    { data: { demandId, ...payload } },
    () => axios.post(`${BASE}/demands/${demandId}/quote`, payload).then((r) => r.data.data)
  );
}

export async function startMission(missionId) {
  return getMock(
    { data: { missionId, status: "en_cours" } },
    () => axios.post(`${BASE}/missions/${missionId}/start`).then((r) => r.data.data)
  );
}

export async function updateStep(missionId, stepId, completed) {
  return getMock(
    { data: { missionId, stepId, completed } },
    () => axios.patch(`${BASE}/missions/${missionId}/steps/${stepId}`, { completed }).then((r) => r.data.data)
  );
}

export async function completeMission(missionId) {
  return getMock(
    { data: { missionId, status: "terminee" } },
    () => axios.post(`${BASE}/missions/${missionId}/complete`).then((r) => r.data.data)
  );
}

export async function reportLitige(missionId, payload) {
  // payload : { motifId, description }
  return getMock(
    { data: { missionId, status: "ouvert" } },
    () => axios.post(`${BASE}/missions/${missionId}/litige`, payload).then((r) => r.data.data)
  );
}