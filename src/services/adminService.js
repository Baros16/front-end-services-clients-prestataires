// src/services/adminService.js
import { getMock, getMockList } from "./mockSwitch.js";
import apiClient from "./apiClient.js";

import mock_dashboard      from "../data/admin/mock_dashboard.json";
import mockProviderDossier from "../data/admin/mock_provider_dossier.json";
import mockManagedUsers    from "../data/admin/mock_users.json";
import mockLitiges         from "../data/admin/mock_litiges.json";

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
      status:       t.status,
    })),
  };
}

// ─── Dashboard ──────────────────────────────────────────────────────────────

export async function getAdminDashboard() {
  const raw = await getMock(
    mock_dashboard,
    () => apiClient.get(`/admin/dashboard`),
  );
  return toDashboard(raw);
}

export async function getPendingProviders(params = {}) {
  const mockList = mock_dashboard.data.pendingValidations.map((p) => ({
    id:            p.id,
    name:          p.fullName,
    specialty:     p.specialty,
    submittedAt:   new Date(p.createdAt).toLocaleDateString("fr-FR"),
    dossierStatus: p.estCertifie ? "ok" : "missing_docs",
  }));
  return getMockList(
    { data: mockList, meta: { page: 1, limit: 20, total: mockList.length, totalPages: 1 } },
    () => apiClient.get(`/admin/providers`, { params: { status: "pending", ...params } }),
  );
}

// ─── Validation Prestataire (ex validationService.js) ───────────────────────

export async function getDossiers() {
  const raw = await getMock(
    mockProviderDossier,
    () => apiClient.get(`/admin/providers`, { params: { status: 'pending_verification' } }),
  );
  return Array.isArray(raw) ? raw : [raw];
}

export async function getDossier(providerId) {
  const raw = await getMock(
    mockProviderDossier,
    () => apiClient.get(`/admin/providers/${providerId}`),
  );
  if (Array.isArray(raw)) {
    return raw.find(d => d.provider.id === providerId) ?? raw[0];
  }
  return raw;
}

export async function validerPrestataire(providerId) {
  return getMock(
    { data: { success: true, message: 'Prestataire validé avec succès.' } },
    () => apiClient.post(`/admin/providers/${providerId}/validate`),
  );
}

export async function refuserDossier(providerId, reason = '') {
  return getMock(
    { data: { success: true, message: 'Dossier refusé.' } },
    () => apiClient.post(`/admin/providers/${providerId}/reject`, { reason }),
  );
}

// ─── Nouveau helper, à ajouter avant envoyerRappelSMS ──────────────────────
function buildReminderMessage(documents = []) {
  const problematic = documents.filter((d) => d.status !== 'valide');

  if (problematic.length === 0) {
    return 'Votre dossier ServiLoc est en cours de vérification. Merci de votre patience.';
  }

  const labels = problematic.map((d) => d.label ?? d.type).join(', ');
  return `Votre dossier ServiLoc est incomplet : ${labels}. Merci de le mettre à jour pour finaliser votre inscription.`;
}

export async function envoyerRappelSMS(providerId, documents = []) {
  const message = buildReminderMessage(documents);

  return getMock(
    { data: { success: true, message: 'SMS de rappel envoyé.' } },
    () => apiClient.post(`/admin/providers/${providerId}/notify`, { message }),
  );
}

// ─── Gestion utilisateurs ────────────────────────────────────────────────────
// ⚠️ Écran existant mais ne consomme pas encore ces fonctions — à corriger.

export async function getManagedUsers(params = {}) {
  return getMockList(
    mockManagedUsers,
    () => apiClient.get(`/admin/users`, { params }),
  );
}

export async function suspendUser(userId, reason) {
  return getMock(
    { data: { success: true, data: { userId, status: "suspended" } } },
    () => apiClient.patch(`/admin/users/${userId}/suspend`, { reason }),
  );
}

export async function reactivateUser(userId) {
  return getMock(
    { data: { success: true, data: { userId, status: "active" } } },
    () => apiClient.patch(`/admin/users/${userId}/reactivate`),
  );
}

// ─── Litiges ──────────────────────────────────────────────────────────────
// Shape mock_litiges.json: { data: { metrics, litiges } } — objet, pas un tableau.

export async function getLitiges(params = {}) {
  return getMock(
    mockLitiges,
    () => apiClient.get(`/admin/litiges`, { params }),
  );
}

export async function resolveLitige(litigeId, payload) {
  return getMock(
    { data: { success: true, litigeId, status: "resolu", ...payload } },
    () => apiClient.post(`/admin/litiges/${litigeId}/resolve`, payload),
  );
}

export async function assignLitige(litigeId, agentId) {
  return getMock(
    { data: { success: true, litigeId, agentId, status: "assigne" } },
    () => apiClient.post(`/admin/litiges/${litigeId}/assign`, { agentId }),
  );
}

/**
 * Stats globales pour les pages Commissions et Paiements.
 * Retourne les commissions et transactions mockées.
 */
export async function getAdminStats() {
  return getMock(
    {
      data: {
        commissions: [
          { id: "c1", reference: "TRX-001", providerName: "Jean Kamga", amount: 50000, commissionRate: 10, commissionAmount: 5000, date: "2026-05-15" },
          { id: "c2", reference: "TRX-002", providerName: "Marie Tagne", amount: 75000, commissionRate: 10, commissionAmount: 7500, date: "2026-05-16" },
          { id: "c3", reference: "TRX-003", providerName: "Paul Biya", amount: 120000, commissionRate: 10, commissionAmount: 12000, date: "2026-05-17" },
        ],
        payments: [
          { id: "p1", reference: "PAY-001", type: "paiement", clientName: "Alice", providerName: "Jean Kamga", amount: 50000, status: "debloque", date: "2026-05-15" },
          { id: "p2", reference: "PAY-002", type: "sequestre", clientName: "Bob", providerName: "Marie Tagne", amount: 75000, status: "sequestre", date: "2026-05-16" },
          { id: "p3", reference: "PAY-003", type: "remboursement", clientName: "Charlie", providerName: "Paul Biya", amount: 25000, status: "rembourse", date: "2026-05-17" },
        ],
      },
    },
    () => apiClient.get('/admin/stats'),
  );
}
