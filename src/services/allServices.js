// src/services/authService.js
// Exemple complet d'utilisation du switch mock/API pour l'auth

import axios from "axios";
import { getMock } from "./mockSwitch.js";
import {
  mockLoginResponse,
  mockRegisterResponse,
  mockVerifyOtpResponse,
} from "../data/auth/mockUsers.js";

const BASE = "/auth";

export async function login(email, password) {
  return getMock(mockLoginResponse, () =>
    axios.post(`${BASE}/login`, { email, password })
  );
}

export async function register(payload) {
  // payload : { role, firstName, lastName, phone, email, password }
  return getMock(mockRegisterResponse, () =>
    axios.post(`${BASE}/register`, payload)
  );
}

export async function verifyOtp(userId, otpCode) {
  return getMock(mockVerifyOtpResponse, () =>
    axios.post(`${BASE}/verify-otp`, { userId, otpCode })
  );
}

export async function resendOtp(userId) {
  return getMock(
    { success: true, data: { otpSent: true, cooldownSeconds: 45 } },
    () => axios.post(`${BASE}/resend-otp`, { userId })
  );
}

export async function logout(refreshToken) {
  return getMock({ success: true }, () =>
    axios.post(`${BASE}/logout`, { refreshToken })
  );
}

// ─────────────────────────────────────────────────────────────────────────────

// src/services/clientService.js
// Exemple complet d'utilisation du switch mock/API pour le client

import axios from "axios";
import { getMock, getMockList } from "./mockSwitch.js";
import { mockClientDashboard } from "../data/client/mockDashboard.js";
import { mockDemands } from "../data/client/mockDemands.js";
import { mockQuote } from "../data/client/mockQuote.js";
import { mockMission } from "../data/client/mockMission.js";

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

// ─────────────────────────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────────────────────

// src/services/adminService.js

import axios from "axios";
import { getMock, getMockList } from "./mockSwitch.js";
import { mockAdminDashboard } from "../data/admin/mockDashboard.js";
import { mockProviderDossier } from "../data/admin/mockProviderDossier.js";
import { mockManagedUsers } from "../data/admin/mockUsers.js";
import { mockLitiges } from "../data/admin/mockLitiges.js";

const BASE = "/admin";

export async function getAdminDashboard() {
  return getMock(mockAdminDashboard, () => axios.get(`${BASE}/dashboard`));
}

export async function getPendingProviders(params = {}) {
  return getMockList(
    { data: mockAdminDashboard.data.pendingProviders, meta: { page: 1, limit: 20, total: 5, totalPages: 1 } },
    () => axios.get(`${BASE}/providers`, { params: { status: "pending", ...params } })
  );
}

export async function getProviderDossier(providerId) {
  return getMock(mockProviderDossier, () =>
    axios.get(`${BASE}/providers/${providerId}`)
  );
}

export async function validateProvider(providerId) {
  return getMock(
    { success: true, data: { providerId, status: "active" } },
    () => axios.post(`${BASE}/providers/${providerId}/validate`)
  );
}

export async function rejectProvider(providerId, reason) {
  return getMock(
    { success: true, data: { providerId, status: "rejected" } },
    () => axios.post(`${BASE}/providers/${providerId}/reject`, { reason })
  );
}

export async function getManagedUsers(params = {}) {
  return getMockList(mockManagedUsers, () =>
    axios.get(`${BASE}/users`, { params })
  );
}

export async function suspendUser(userId, reason) {
  return getMock(
    { success: true, data: { userId, status: "suspended" } },
    () => axios.patch(`${BASE}/users/${userId}/suspend`, { reason })
  );
}

export async function reactivateUser(userId) {
  return getMock(
    { success: true, data: { userId, status: "active" } },
    () => axios.patch(`${BASE}/users/${userId}/reactivate`)
  );
}

export async function getLitiges(params = {}) {
  return getMock(mockLitiges, () =>
    axios.get(`${BASE}/litiges`, { params })
  );
}

export async function resolveLitige(litigeId, payload) {
  // payload : { resolution, note }
  return getMock(
    { success: true, data: { litigeId, status: "resolu", ...payload } },
    () => axios.post(`${BASE}/litiges/${litigeId}/resolve`, payload)
  );
}

// ─────────────────────────────────────────────────────────────────────────────

// src/services/sharedService.js

import axios from "axios";
import { getMock } from "./mockSwitch.js";
import { mockCategories } from "../data/shared/mockCategories.js";
import { mockLitigeMotifs } from "../data/shared/mockLitigeMotifs.js";

export async function getCategories() {
  return getMock(mockCategories, () => axios.get("/client/categories"));
}

export async function getLitigeMotifs() {
  return getMock(mockLitigeMotifs, () => axios.get("/shared/litige-motifs"));
}
