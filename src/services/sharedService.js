
import { getMock } from "./mockSwitch.js";
import apiClient from "./apiClient.js";
import { mockCategories } from "../data/shared/mock_categories.js";
import { mockLitigeMotifs } from "../data/shared/mock_litige_motifs.js";
export async function getCategories() {
  return getMock(
    mockCategories,
    () => apiClient.get(`/client/categories`).then(r => r.data.data),
  );
}

export async function getLitigeMotifs() {
  return getMock(
    mockLitigeMotifs,
    () => apiClient.get(`/shared/litige-motifs`).then(r => r.data.data),
  );
}