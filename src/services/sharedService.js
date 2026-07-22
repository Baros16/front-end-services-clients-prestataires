
import { getMock } from "./mockSwitch.js";
import apiClient from "./apiClient.js";
import  mockCategories from "../data/shared/mock_categories.json";
import  mockLitigeMotifs from "../data/shared/mock_litige_motifs.json";

export async function getCategories() {
  return getMock(
    mockCategories,
    () => apiClient.get(`/client/categories`),
  );
}

export async function getLitigeMotifs() {
  return getMock(
    mockLitigeMotifs,
    () => apiClient.get(`/shared/litige-motifs`),
  );
}
// /src/services/sharedService.js

// Vos exports existants (ex: getLitigeMotifs)...

export const signalerLitige = async (data) => {
  // Simule un délai réseau de 500ms
  await new Promise((resolve) => setTimeout(resolve, 500));

  console.log("Litige envoyé avec succès (Mock):", data);

  return { success: true, id: "litige-" + Date.now() };
};