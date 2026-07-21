// src/services/agentService.js
import axios from "axios";
import { getMock } from "./mockSwitch.js";
import mockLitigeData from "../data/service-client/mock_litige_detail.json";

const BASE = "/agent";

export async function getLitigeDetail(litigeId) {
  return getMock(
    { data: mockLitigeData.litige },
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
