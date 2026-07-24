// src/services/adminService.js
import { getMock, getMockList } from "./mockSwitch.js";
import apiClient from "./apiClient.js";

import mock_dashboard      from "../data/admin/mock_dashboard.json";
import mockProviderDossier from "../data/admin/mock_provider_dossier.json";
import mockManagedUsers    from "../data/admin/mock_users.json";
import mockLitiges         from "../data/admin/mock_litiges.json";

/**
 * Transforme la réponse brute de GET /admin/dashboard en shape UI.
 *
 * FIX : accès défensif sur chaque champ — en cas de champ manquant dans la
 *       réponse (backend partiel, version transitoire), le dashboard affiche
 *       des zéros plutôt que de crasher sur `raw.metrics.activeDemands.value`.
 */
function toDashboard(raw) {
  const metrics = raw?.metrics ?? {};

  return {
    metrics: {
      activeRequests: {
        value: metrics.activeDemands?.value  ?? 0,
        trend: metrics.activeDemands?.trend  ?? 0,
      },
      ongoingMissions: {
        value: metrics.ongoingMissions?.value ?? 0,
        trend: metrics.ongoingMissions?.trend ?? 0,
      },
      monthlyRevenue: {
        value: metrics.monthlyRevenue?.value  ?? 0,
        trend: metrics.monthlyRevenue?.trend  ?? 0,
      },
      commission: {
        value: metrics.commissionEarned?.value ?? 0,
        trend: metrics.commissionEarned?.trend ?? 0,
      },
    },
    pendingProviders: (raw?.pendingValidations ?? []).map(p => ({
      id:            p.id,
      name:          p.fullName,
      specialty:     p.specialty,
      submittedAt:   new Date(p.createdAt).toLocaleDateString('fr-FR'),
      dossierStatus: p.estCertifie ? 'ok' : 'missing_docs',
    })),
    activeLitiges: (raw?.activeLitiges ?? []).map(l => ({
      id:        l.id,
      reference: l.reference,
      motif:     l.motif?.title ?? '',
      amount:    l.amount,
      // FIX: chaînage optionnel sur .replace — status peut être absent ou sans préfixe "en_"
      status:    l.status?.replace(/^en_/, '') ?? l.status ?? '',
    })),
    popularCategories: (raw?.popularCategories ?? []).map(c => ({
      name:       c.label,
      percentage: c.percentageShare,
      color:      c.color,
    })),
    recentTransactions: (raw?.recentTransactions ?? []).map(t => ({
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
    () => apiClient.get('/admin/dashboard'),
  );
  return toDashboard(raw);
}

export async function getPendingProviders(params = {}) {
  const mockList = mock_dashboard.data.pendingValidations.map(p => ({
    id:            p.id,
    name:          p.fullName,
    specialty:     p.specialty,
    submittedAt:   new Date(p.createdAt).toLocaleDateString('fr-FR'),
    dossierStatus: p.estCertifie ? 'ok' : 'missing_docs',
  }));
  return getMockList(
    { data: mockList, meta: { page: 1, limit: 20, total: mockList.length, totalPages: 1 } },
    () => apiClient.get('/admin/providers', { params: { status: 'pending', ...params } }),
  );
}

// ─── Validation Prestataire ─────────────────────────────────────────────────

export async function getDossiers() {
  const raw = await getMock(
    mockProviderDossier,
    () => apiClient.get('/admin/providers', { params: { status: 'pending_verification' } }),
  );
  return Array.isArray(raw) ? raw : [raw];
}

/**
 * FIX : en cas de non-correspondance dans le mock (array sans l'ID recherché),
 *       on lève une erreur explicite plutôt que de retourner silencieusement raw[0],
 *       ce qui aurait affiché le mauvais dossier sans avertissement.
 */
export async function getDossier(providerId) {
  const raw = await getMock(
    mockProviderDossier,
    () => apiClient.get(`/admin/providers/${providerId}`),
  );
  if (Array.isArray(raw)) {
    const found = raw.find(d => d.provider?.id === providerId);
    if (!found) {
      throw new Error(`[ServiLoc] Dossier introuvable dans les données mock : ${providerId}`);
    }
    return found;
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

function buildReminderMessage(documents = []) {
  const problematic = documents.filter(d => d.status !== 'valide');
  if (problematic.length === 0) {
    return 'Votre dossier ServiLoc est en cours de vérification. Merci de votre patience.';
  }
  const labels = problematic.map(d => d.label ?? d.type).join(', ');
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

export async function getManagedUsers(params = {}) {
  return getMockList(
    mockManagedUsers,
    () => apiClient.get('/admin/users', { params }),
  );
}

/**
 * Suspend un utilisateur.
 *
 * FIX : ajout du champ `duration` — SuspendUserRequest dans le swagger 8081
 *       le déclare required avec le pattern "24h|7d|indefinite".
 *       Sans lui, le backend retourne 400 VALIDATION_ERROR.
 *
 * @param {string} userId
 * @param {string} reason
 * @param {'24h'|'7d'|'indefinite'} duration — durée de suspension
 */
export async function suspendUser(userId, reason, duration = '24h') {
  return getMock(
    { data: { success: true, data: { userId, status: 'suspended', duration } } },
    () => apiClient.patch(`/admin/users/${userId}/suspend`, { reason, duration }),
  );
}

export async function reactivateUser(userId) {
  return getMock(
    { data: { success: true, data: { userId, status: 'active' } } },
    () => apiClient.patch(`/admin/users/${userId}/reactivate`),
  );
}

// ─── Litiges ────────────────────────────────────────────────────────────────
// Shape mock_litiges.json : { data: { metrics, litiges } } — objet, pas un tableau.
// getMock retourne raw.data → un objet { metrics, litiges }.
// Les consommateurs doivent accéder à result.litiges, pas itérer result directement.

export async function getLitiges(params = {}) {
  return getMock(
    mockLitiges,
    () => apiClient.get('/admin/litiges', { params }),
  );
}

export async function resolveLitige(litigeId, payload) {
  return getMock(
    { data: { success: true, litigeId, status: 'resolu', ...payload } },
    () => apiClient.post(`/admin/litiges/${litigeId}/resolve`, payload),
  );
}

export async function assignLitige(litigeId, agentId) {
  return getMock(
    { data: { success: true, litigeId, agentId, status: 'assigne' } },
    () => apiClient.post(`/admin/litiges/${litigeId}/assign`, { agentId }),
  );
}

/**
 * Stats commissions + paiements pour les pages admin.
 * Retourne AdminStats : { commissions: CommissionStat[], payments: PaymentStat[] }
 * — contrat swagger 8084 GET /admin/stats.
 *
 * FIX : remplacement des noms fictifs en clair par des identités génériques
 *       (évite les personnalités publiques dans les screenshots et démos).
 */
export async function getAdminStats() {
  return getMock(
    {
      data: {
        commissions: [
          {
            id:               'c1',
            reference:        'TRX-001',
            providerName:     'Alain Fopa',
            amount:            50_000,
            commissionRate:    10,
            commissionAmount:   5_000,
            date:             '2026-05-15',
          },
          {
            id:               'c2',
            reference:        'TRX-002',
            providerName:     'Sylvie Ngono',
            amount:            75_000,
            commissionRate:    10,
            commissionAmount:   7_500,
            date:             '2026-05-16',
          },
          {
            id:               'c3',
            reference:        'TRX-003',
            providerName:     'David Mengue',
            amount:           120_000,
            commissionRate:    10,
            commissionAmount:  12_000,
            date:             '2026-05-17',
          },
        ],
        payments: [
          {
            id:           'p1',
            reference:    'PAY-001',
            type:         'paiement',
            clientName:   'Alice Tchamba',
            providerName: 'Alain Fopa',
            amount:        50_000,
            status:       'debloque',
            date:         '2026-05-15',
          },
          {
            id:           'p2',
            reference:    'PAY-002',
            type:         'sequestre',
            clientName:   'Bernard Wamba',
            providerName: 'Sylvie Ngono',
            amount:        75_000,
            status:       'sequestre',
            date:         '2026-05-16',
          },
          {
            id:           'p3',
            reference:    'PAY-003',
            type:         'remboursement',
            clientName:   'Christine Awono',
            providerName: 'David Mengue',
            amount:        25_000,
            status:       'rembourse',
            date:         '2026-05-17',
          },
        ],
      },
    },
    () => apiClient.get('/admin/stats'),
  );
}