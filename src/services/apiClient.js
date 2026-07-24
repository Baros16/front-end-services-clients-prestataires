import axios from 'axios';

// Si ton API backend utilise un préfixe global, garde /v1, sinon retire-le.
const DEFAULT_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://serviloc.store';

const apiClient = axios.create({
  baseURL: DEFAULT_BASE_URL,
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
    'Accept':       'application/json',
  },
});

// ── Intercepteur requête : injection JWT et X-User-Id ────────────────────────
apiClient.interceptors.request.use(
  (config) => {
    const isPublicAuthRoute = 
      config.url?.includes('auth/login') || 
      config.url?.includes('auth/register');

    if (!isPublicAuthRoute) {
      const token = localStorage.getItem('serviloc_access');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Injection automatique de X-User-Id si l'utilisateur est stocké
      const storedUser = localStorage.getItem('serviloc_user');
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          const userId = user?.id || user?.userId;
          if (userId) {
            config.headers['X-User-Id'] = userId;
          }
        } catch {
          // Ignorer en cas de JSON malformé
        }
      }
    } else {
      delete config.headers.Authorization;
      delete config.headers['X-User-Id'];
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// ── Intercepteur réponse : gestion 401 avec refresh token ──────────────────
apiClient.interceptors.response.use(
  (response) => {
    // Si le backend entoure tout dans { success: true, data: [...] }
    // On retourne directement response.data pour simplifier les services
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;

    // Ne pas tenter de refresh si la requête n'a pas de config ou était sur l'auth
    if (!originalRequest) return Promise.reject(error);

    const isAuthEndpoint = 
      originalRequest.url?.includes('auth/login') || 
      originalRequest.url?.includes('auth/refresh');

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true;

      const storedRefreshToken = localStorage.getItem('serviloc_refresh');

      if (storedRefreshToken) {
        try {
          const baseUrl = apiClient.defaults.baseURL.endsWith('/')
            ? apiClient.defaults.baseURL.slice(0, -1)
            : apiClient.defaults.baseURL;

          const refreshUrl = `${baseUrl}/auth/refresh`;

          // Appel HTTP isolé sans passer par les intercepteurs du client principal
          const { data } = await axios.post(
            refreshUrl,
            { refreshToken: storedRefreshToken },
            { headers: { 'Content-Type': 'application/json' } }
          );

          const newToken = data?.data?.accessToken ?? data?.accessToken ?? data?.token;

          if (newToken) {
            localStorage.setItem('serviloc_access', newToken);

            const newRefreshToken = data?.data?.refreshToken ?? data?.refreshToken;
            if (newRefreshToken) {
              localStorage.setItem('serviloc_refresh', newRefreshToken);
            }

            // Rejouer la requête d'origine avec le nouveau token
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return apiClient(originalRequest);
          }
        } catch (refreshError) {
          console.error(
            '[apiClient] ❌ Échec du refresh token :',
            refreshError?.response?.data || refreshError.message
          );
        }
      }

      // Nettoyage de la session
      localStorage.removeItem('serviloc_access');
      localStorage.removeItem('serviloc_refresh');
      localStorage.removeItem('serviloc_user');
      
      // Éviter la boucle si on est déjà sur la page de login
      if (!window.location.pathname.startsWith('/auth/')) {
        window.location.replace('/auth/login');
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;