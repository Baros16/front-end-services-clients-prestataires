// src/services/adminService.js

import axios from "axios";
import { getMock, getMockList } from "./mockSwitch.js";
import mock_dashboard from "../data/admin/mock_dashboard.json";
import { mockProviderDossier } from "../data/admin/mockProviderDossier.js";
import { mockManagedUsers } from "../data/admin/mockUsers.js";
import { mockLitiges } from "../data/admin/mockLitiges.js";

const BASE = "/admin";

// ─── Mapper : payload brut API → shape normalisée pour les composants ──────
function toDashboard(raw) {
  return {
    metrics: {
      activeRequests:  { value: raw.metrics.activeDemands.value,    trend: raw.metrics.activeDemands.trend    },
      ongoingMissions: { value: raw.metrics.ongoingMissions.value,  trend: raw.metrics.ongoingMissions.trend  },
      monthlyRevenue:  { value: raw.metrics.monthlyRevenue.value,   trend: raw.metrics.monthlyRevenue.trend   },
      commission:      { value: raw.metrics.commissionEarned.value, trend: raw.metrics.commissionEarned.trend },
    },
    pendingProviders: raw.pendingValidations.map((p) => ({
      id:            p.id,
      name:          p.fullName,
      specialty:     p.specialty,
      submittedAt:   new Date(p.createdAt).toLocaleDateString("fr-FR"),
      dossierStatus: p.estCertifie ? "ok" : "missing_docs",
    })),
    activeLitiges: raw.activeLitiges.map((l) => ({
      id:        l.id,
      reference: l.reference,
      motif:     l.motif.title,
      amount:    l.amount,
      // "en_traitement" → "traitement" | "en_cours" → "en_cours" (déjà valide)
      status:    l.status.replace(/^en_/, ""),
    })),
    popularCategories: raw.popularCategories.map((c) => ({
      name:       c.label,
      percentage: c.percentageShare,
      color:      c.color,
    })),
    recentTransactions: raw.recentTransactions.map((t) => ({
      id:           t.reference,
      clientName:   t.clientName,
      providerName: t.providerName,
      service:      t.category,
      amount:       t.amount,
      commission:   t.commission,
      status:       t.status, // "sequestre" | "libere" — déjà des StatusVariant valides
    })),
  };
}

// ─── Exports ──────────────────────────────────────────────────────────────

/**
 * BUG CORRIGÉ : toDashboard() était défini mais jamais appliqué.
 * Sans ce fix, la page recevait le payload brut (clés API) au lieu
 * des clés normalisées attendues par les composants.
 */
export async function getAdminDashboard() {
  const raw = await getMock({ data: mock_dashboard.data }, () =>
    axios.get(`${BASE}/dashboard`)
  );
  return toDashboard(raw);
}

export async function getPendingProviders(params = {}) {
  // BUG NOTE : l'ancienne version référençait `mockAdminDashboard` (inexistant).
  // Corrigé : on tire les pendingValidations directement depuis mock_dashboard.
  const mockList = mock_dashboard.data.pendingValidations.map((p) => ({
    id:            p.id,
    name:          p.fullName,
    specialty:     p.specialty,
    submittedAt:   new Date(p.createdAt).toLocaleDateString("fr-FR"),
    dossierStatus: p.estCertifie ? "ok" : "missing_docs",
  }));
  return getMockList(
    { data: mockList, meta: { page: 1, limit: 20, total: mockList.length, totalPages: 1 } },
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
  return getMock(
    { success: true, data: { litigeId, status: "resolu", ...payload } },
    () => axios.post(`${BASE}/litiges/${litigeId}/resolve`, payload)
  );
}
