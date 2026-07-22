// src/config/apiToggle.js
// Bascule API réelle / mock par service.
// NE JAMAIS COMMITER AVEC `true` — toujours repasser à `false` avant PR.
export const API_TOGGLE = {
  client:   false,   // true → appels réels vers localhost:8080
  provider: false,
  admin:    false,
  auth:     false,
};

/**
 * Vérifie si un service donné doit utiliser l'API réelle ou le mock.
 * @param {'client'|'provider'|'admin'|'auth'} service
 * @returns {boolean}
 */
export const isApiEnabled = (service) => API_TOGGLE[service] ?? false;

/**
 * Active un service pour les tests (console uniquement, pas de persistance).
 * Utilisation : isApiEnabled.toggle('client') dans la console navigateur
 */
export const toggleApi = (service, enabled) => {
  if (service in API_TOGGLE) {
    API_TOGGLE[service] = enabled;
    console.info(`[apiToggle] ${service} → ${enabled ? 'API RÉELLE' : 'MOCK'}`);
  }
};