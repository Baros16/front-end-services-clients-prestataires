// src/services/apiClient.js
import axios from 'axios';

const DEFAULT_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/v1';

const apiClient = axios.create({
  baseURL: DEFAULT_BASE_URL,
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
    'Accept':       'application/json',
  },
});

// ── Intercepteur requête : injection JWT conditionnelle ─────────────────────
apiClient.interceptors.request.use(
  (config) => {
    // Ne JAMAIS envoyer de header Authorization sur les endpoints d'authentification
    // (login, register, otp, refresh, etc.)
    const isAuthRoute = config.url?.includes('auth/');

    if (!isAuthRoute) {
      const token = localStorage.getItem('serviloc_access');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } else {
      // Supprime le header s'il a été hérité ou mis par erreur
      delete config.headers.Authorization;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// ── Intercepteur réponse : gestion 401 avec refresh token ──────────────────
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Éviter les boucles infinies sur les requêtes 401
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const storedRefreshToken = localStorage.getItem('serviloc_refresh');
      if (storedRefreshToken) {
        try {
          // Utilisation d'axios brut pour le refresh sans passer par l'intercepteur apiClient
          const refreshUrl = DEFAULT_BASE_URL.endsWith('/') 
            ? `${DEFAULT_BASE_URL}auth/refresh` 
            : `${DEFAULT_BASE_URL}/auth/refresh`;

          const { data } = await axios.post(refreshUrl, {
            refreshToken: storedRefreshToken,
          });

          const newToken = data?.data?.accessToken ?? data?.accessToken;
          if (newToken) {
            localStorage.setItem('serviloc_access', newToken);
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return apiClient(originalRequest); // Rejouer la requête originale
          }
        } catch (refreshError) {
          console.error('[apiClient] Refresh token échoué:', refreshError);
        }
      }

      // Échec du refresh → nettoyage et redirection vers le login
      localStorage.removeItem('serviloc_access');
      localStorage.removeItem('serviloc_refresh');
      localStorage.removeItem('serviloc_user');
      window.location.replace('/auth/login');
    }

    return Promise.reject(error);
  },
);

export default apiClient;