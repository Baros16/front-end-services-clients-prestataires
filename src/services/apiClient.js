import axios from 'axios';

const DEFAULT_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://serviloc.store/v1';

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
    // Exclure uniquement les routes publiques qui n'ont pas besoin de token
    const isPublicAuthRoute = config.url?.includes('auth/login') || config.url?.includes('auth/register');

    if (!isPublicAuthRoute) {
      const token = localStorage.getItem('serviloc_access');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } else {
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

    // Ne pas tenter de refresh si la requête d'origine était DÉJÀ un login ou un refresh
    const isAuthEndpoint = originalRequest.url?.includes('auth/login') || originalRequest.url?.includes('auth/refresh');

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true;

      const storedRefreshToken = localStorage.getItem('serviloc_refresh');
      
      if (!storedRefreshToken) {
        console.warn('[apiClient] Aucun refresh token trouvé dans le localStorage.');
      } else {
        try {
          // Résolution propre de l'URL absolue pour Axios brut
          const baseUrl = apiClient.defaults.baseURL.endsWith('/')
            ? apiClient.defaults.baseURL.slice(0, -1)
            : apiClient.defaults.baseURL;

          const refreshUrl = `${baseUrl}/auth/refresh`;

          console.log('[apiClient] Tentative de Refresh Token sur :', refreshUrl);

          // Appel HTTP sans passer par les intercepteurs pour éviter toute boucle
          const { data } = await axios.post(
            refreshUrl,
            { refreshToken: storedRefreshToken },
            { headers: { 'Content-Type': 'application/json' } }
          );

          // Extraction selon le format de ton DTO (ajuster si nécessaire)
          const newToken = data?.data?.accessToken ?? data?.accessToken ?? data?.token;

          if (newToken) {
            console.log('[apiClient] ✅ Refresh réussi ! Nouveau token injecté.');
            localStorage.setItem('serviloc_access', newToken);

            // Si le backend renvoie aussi un nouveau refresh token (Refresh Token Rotation)
            const newRefreshToken = data?.data?.refreshToken ?? data?.refreshToken;
            if (newRefreshToken) {
              localStorage.setItem('serviloc_refresh', newRefreshToken);
            }

            // Met à jour la requête originale et la relance
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return apiClient(originalRequest);
          }
        } catch (refreshError) {
          console.error('[apiClient] ❌ Erreur lors de la tentative de refresh :', refreshError?.response?.data || refreshError.message);
        }
      }

      // Échec du refresh ou pas de refresh token → Nettoyage et redirection
      console.warn('[apiClient] Redirection vers /auth/login...');
      localStorage.removeItem('serviloc_access');
      localStorage.removeItem('serviloc_refresh');
      localStorage.removeItem('serviloc_user');
      window.location.replace('/auth/login');
    }

    return Promise.reject(error);
  },
);

export default apiClient;