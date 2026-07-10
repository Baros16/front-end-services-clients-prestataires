// src/services/agentService.js
import axios from "axios";
import { getMock } from "./mockSwitch.js";
import {
  mockLitigeDetail,
  mockParties,
  mockClientMessages,
  mockProviderMessages,
} from "../data/service-client/mockLitigeDetail.js";

const BASE = "/agent";

export async function getLitigeDetail(litigeId) {
  return getMock(
    { data: mockLitigeDetail },
    () => axios.get(`${BASE}/litiges/${litigeId}`)
  );
}

export async function submitResolution(litigeId, payload) {
  return getMock(
    { data: { litigeId, status: "resolu", ...payload } },
    () => axios.post(`${BASE}/litiges/${litigeId}/resolution`, payload)
  );
}

export async function closeLitige(litigeId) {
  return getMock(
    { data: { litigeId, status: "cloture" } },
    () => axios.post(`${BASE}/litiges/${litigeId}/close`)
  );
}
