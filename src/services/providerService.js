// src/services/providerService.js

import axios from "axios";
import { getMock, getMockList } from "./mockSwitch.js";
import { mockProviderDashboard } from "../data/provider/mockDashboard.js";
import { mockAvailableDemands } from "../data/provider/mockAvailableDemands.js";

const BASE = "/provider";

export async function getProviderDashboard() {
  return getMock(mockProviderDashboard, () => axios.get(`${BASE}/dashboard`));
}

export async function getAvailableDemands(params = {}) {
  // params : { page, limit, category }
  return getMockList(mockAvailableDemands, () =>
    axios.get(`${BASE}/demands/available`, { params })
  );
}

export async function applyToDemand(demandId) {
  return getMock(
    { success: true, data: { demandId, status: "applied" } },
    () => axios.post(`${BASE}/demands/${demandId}/apply`)
  );
}

export async function submitQuote(demandId, payload) {
  // payload : { laborDescription, laborAmount, materials[], estimatedDurationHours, validityDays }
  return getMock(
    { success: true, data: { demandId, ...payload } },
    () => axios.post(`${BASE}/demands/${demandId}/quote`, payload)
  );
}

export async function startMission(missionId) {
  return getMock(
    { success: true, data: { missionId, status: "en_cours" } },
    () => axios.post(`${BASE}/missions/${missionId}/start`)
  );
}

export async function updateStep(missionId, stepId, completed) {
  return getMock(
    { success: true, data: { missionId, stepId, completed } },
    () =>
      axios.patch(`${BASE}/missions/${missionId}/steps/${stepId}`, {
        completed,
      })
  );
}

export async function completeMission(missionId) {
  return getMock(
    { success: true, data: { missionId, status: "terminee" } },
    () => axios.post(`${BASE}/missions/${missionId}/complete`)
  );
}
