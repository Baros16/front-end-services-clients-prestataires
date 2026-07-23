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

// ── Intercepteur réponse : gestion 401 avec refresh token ──────────────────
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Éviter les boucles infinies
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const storedRefreshToken = localStorage.getItem('serviloc_refresh');
      if (storedRefreshToken) {
        try {
          // Tentative de refresh via l'endpoint dédié
          const { data } = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'}/users/refresh`,
            { refreshToken: storedRefreshToken },
          );

          const newToken = data?.data?.accessToken ?? data?.accessToken;
          if (newToken) {
            localStorage.setItem('serviloc_access', newToken);
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return apiClient(originalRequest); // Réessayer la requête originale
          }
        } catch (refreshError) {
          console.error('[apiClient] Refresh token échoué:', refreshError);
        }
      }

      // Échec du refresh → nettoyage et redirection
      localStorage.removeItem('serviloc_access');
      localStorage.removeItem('serviloc_refresh');
      localStorage.removeItem('serviloc_user');
      window.location.replace('/auth/login');
    }

    return Promise.reject(error);
  },
);

export default apiClient;