// src/services/validationService.js

import { getMock }  from './mockSwitch.js';
import mockDossier  from '../data/admin/mock_provider_dossier.json';
import apiClient    from './apiClient.js';

/**
 * Dossier complet d'un prestataire en attente de validation.
 * En S2 : ignore providerId, retourne toujours le mock.
 * En S3 : GET /admin/providers/:providerId/dossier
 */
export async function getDossier(providerId) {
  return getMock(
    mockDossier.data,
    () => apiClient
      .get(`/admin/providers/${providerId}/dossier`)
      ,
  );
}

/**
 * Valider un prestataire → statut passe à "active".
 * En S2 : résolution immédiate (simulation).
 */
export async function validerPrestataire(providerId) {
  return getMock(
    { success: true, message: 'Prestataire validé avec succès.' },
    () => apiClient
      .post(`/admin/providers/${providerId}/validate`)
      .then(r => r.data),
  );
}

/**
 * Refuser un dossier → statut passe à "rejected".
 */
export async function refuserDossier(providerId, motif = '') {
  return getMock(
    { success: true, message: 'Dossier refusé.' },
    () => apiClient
      .post(`/admin/providers/${providerId}/reject`, { motif })
      .then(r => r.data),
  );
}

/**
 * Envoyer un rappel SMS au prestataire pour documents manquants.
 */
export async function envoyerRappelSMS(providerId) {
  return getMock(
    { success: true, message: 'SMS de rappel envoyé.' },
    () => apiClient
      .post(`/admin/providers/${providerId}/notify-sms`)
      .then(r => r.data),
  );
}