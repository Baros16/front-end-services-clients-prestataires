// src/services/apiClient.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080',
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
    'Accept':       'application/json',
  },
});

// ── Intercepteur requête : injection JWT ─────────────────────────────────────
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('serviloc_access');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ── Intercepteur réponse : gestion 401 ──────────────────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // v2.1 : on nettoie les 3 clés (access + refresh + profil utilisateur)
      localStorage.removeItem('serviloc_access');
      localStorage.removeItem('serviloc_refresh');
      localStorage.removeItem('serviloc_user');
      // Redirection hard : on sort du contexte React proprement
      window.location.replace('/auth/login');
    }
    return Promise.reject(error);
  },
);

export default apiClient;