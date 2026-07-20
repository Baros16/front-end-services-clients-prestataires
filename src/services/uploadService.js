// src/services/uploadService.js
// Upload générique — accessible à tous les rôles authentifiés (API_CONTRACT §10).
import { getMock } from "./mockSwitch.js";
import apiClient from "./apiClient.js";

function buildMockUpload(prefix, file) {
  return {
    success: true,
    data: {
      uploads: [
        {
          id: `${prefix}_${Date.now()}`,
          url: URL.createObjectURL(file),
          name: file.name,
          sizeBytes: file.size,
        },
      ],
    },
  };
}

/**
 * Upload d'une ou plusieurs photos.
 * @param {File[]} files
 * @param {"demand"|"litige"|"profile"|"chat"} context
 */
export async function uploadPhotos(files, context) {
  const formData = new FormData();
  files.forEach((file) => formData.append("photos", file));
  formData.append("context", context);

  return getMock(
    buildMockUpload("photo", files[0]),
    () => apiClient
      .post(`/uploads/photos`, formData, { headers: { "Content-Type": "multipart/form-data" } })
      .then(r => r.data.data),
  );
}

/**
 * Upload d'un document officiel.
 * @param {File} file
 * @param {"carte_professionnelle"|"cni"|"casier_judiciaire"|"assurance"} type
 */
export async function uploadDocument(file, type) {
  const formData = new FormData();
  formData.append("document", file);
  formData.append("type", type);

  return getMock(
    buildMockUpload("doc", file),
    () => apiClient
      .post(`/uploads/documents`, formData, { headers: { "Content-Type": "multipart/form-data" } })
      .then(r => r.data.data),
  );
}