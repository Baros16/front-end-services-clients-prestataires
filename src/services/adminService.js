
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
