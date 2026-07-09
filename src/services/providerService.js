import { getMock, getMockList } from "./mockSwitch.js";
import apiClient from "./apiClient.js";
import mock_dashboard from "../data/provider/mock_dashboard.json";
import mock_avilable_demands from "../data/provider/mock_available_demands.json";

export async function getProviderDashboard() {
  return getMock(
    mock_dashboard,
    () => apiClient.get(`/provider/dashboard`).then(r => r.data.data),
  );
}

export async function getAvailableDemands(params = {}) {
  // params : { page, limit, category }
  return getMockList(
    mock_avilable_demands,
    () => apiClient.get(`/provider/demands/available`, { params }).then(r => r.data.data),
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
export async function updateAvailability(isAvailable) {
  return getMock(
    { success: true, data: { isAvailable } },
    () => apiClient.patch(`/provider/availability`, { isAvailable }).then(r => r.data.data),
  );
}