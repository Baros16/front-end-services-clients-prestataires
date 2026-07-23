// src/services/serviceClientService.js
import { getMock, getMockList } from "./mockSwitch.js";
import apiClient from "./apiClient.js";
import mockDashboard from "../data/agent/mock_agent_dashboard.json";
import mockLitigeDetail from "../data/agent/mock_litige_detail.json";
import mockLitigeMessages from "../data/agent/mock_litige_messages.json";
import mockLitigeHistory from "../data/agent/mock_litige_history.json";
import mockAgentLitiges from "../data/agent/mock_agent_litiges.json";

function normalizeStatus(obj) {
  if (!obj) return obj;
  return {
    ...obj,
    status: typeof obj.status === "string" ? obj.status.toLowerCase() : obj.status,
  };
}

/**
 * Récupère le dashboard de l'agent Service Client
 */
export async function getSCDashboard() {
  const result = await getMock(
    mockDashboard,
    () => apiClient.get("/service-client/dashboard"),
  );
  return result.data ?? result;
}

/**
 * Récupère la liste des litiges assignés
 */
export async function getAssignedLitiges() {
  const result = await getMock(
    mockAgentLitiges,
    () => apiClient.get("/service-client/litiges"),
  );
  return result.data ?? result;
}

/**
 * Récupère le détail d'un litige
 */
export async function getLitigeDetail(litigeId) {
  const result = await getMock(
    mockLitigeDetail,
    () => apiClient.get(`/service-client/litiges/${litigeId}`),
  );
  return normalizeStatus(result.data ?? result);
}

/**
 * Récupère les messages de médiation d'un litige
 */
export async function getLitigeMessages(litigeId) {
  return getMock(
    mockLitigeMessages,
    () => apiClient.get(`/service-client/litiges/${litigeId}/messages`),
  );
}

/**
 * Récupère l'historique d'un litige
 */
export async function getLitigeHistory(litigeId) {
  return getMock(
    mockLitigeHistory,
    () => apiClient.get(`/service-client/litiges/${litigeId}/history`),
  );
}

/**
 * Envoyer un message dans la médiation
 */
export async function sendMediationMessage(litigeId, content) {
  return getMock(
    { success: true, data: { id: `msg_${Date.now()}`, content, senderId: "agent", createdAt: new Date().toISOString() } },
    () => apiClient.post(`/service-client/litiges/${litigeId}/messages`, { content }),
  );
}

/**
 * Résoudre un litige (décision finale)
 */
export async function resolveLitige(litigeId, decision) {
  return getMock(
    { success: true, data: { status: "resolu" } },
    () => apiClient.post(`/service-client/litiges/${litigeId}/resolve`, decision),
  );
}

/**
 * Escalader un litige vers l'admin
 */
export async function escalateLitige(litigeId, reason) {
  return getMock(
    { success: true, data: { status: "escalade" } },
    () => apiClient.post(`/service-client/litiges/${litigeId}/escalate`, { reason }),
  );
}