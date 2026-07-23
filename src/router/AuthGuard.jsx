// src/router/AuthGuard.jsx
import { Navigate, useLocation } from "react-router-dom";

// ─── Clés localStorage (alignées avec apiClient.js / authService.js) ───────
const ACCESS_KEY = "serviloc_access";
const REFRESH_KEY = "serviloc_refresh";
const USER_KEY = "serviloc_user";

// ─── Décodage du token réel (API_CONTRACT v2.1) ─────────────────────────────
// Payload JWT : { userId, role: "CLIENT"|"PROVIDER"|"ADMIN"|"AGENT", type, sub: <email>, iss, iat, exp }
// ⚠️ `role` ici est en MAJUSCULES (convention de routing). C'est différent du
// `role` en minuscules qu'on trouve dans les objets `User` renvoyés par l'API —
// ne jamais comparer les deux directement sans normaliser la casse.
function decodeToken(token) {
  const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
  return JSON.parse(atob(base64));
}

export function getCurrentUser() {
  try {
    const token = localStorage.getItem(ACCESS_KEY);
    if (!token) return null;

    const payload = decodeToken(token);
    if (!payload.exp || payload.exp * 1000 < Date.now()) {
      // Token expiré → on nettoie pour éviter un état incohérent
      localStorage.removeItem(ACCESS_KEY);
      localStorage.removeItem(REFRESH_KEY);
      localStorage.removeItem(USER_KEY);
      return null;
    }

    const storedUser = JSON.parse(localStorage.getItem(USER_KEY) ?? "null");

    return {
      ...storedUser,
      id: payload.userId,
      role: payload.role, // toujours la version MAJUSCULE du token (routing)
      name: storedUser?.fullName ?? storedUser?.firstName ?? "Utilisateur",
      email: storedUser?.email ?? payload.sub,
    };
  } catch {
    return null;
  }
}

// ─── Redirections par rôle ───────────────────────────────────────────────────
const ROLE_HOME = {
  CLIENT:         "/client/dashboard",
  PROVIDER:       "/provider/dashboard",
  ADMIN:          "/admin/dashboard",
  AGENT:          "/service-client/dashboard",
  SERVICE_CLIENT: "/service-client/dashboard",
};

// ─── Composant ───────────────────────────────────────────────────────────────
export function AuthGuard({ allowedRoles, children }) {
  const location = useLocation();
  const user = getCurrentUser();

  // Pas de token / token expiré → login
  if (!user) {
    return (
      <Navigate
        to="/auth/login"
        state={{ from: location }}   // pour rediriger après login
        replace
      />
    );
  }

  // Rôle non autorisé → renvoyer vers le bon espace
  if (!allowedRoles.includes(user.role)) {
    const home = ROLE_HOME[user.role] ?? "/auth/login";
    return <Navigate to={home} replace />;
  }

  return children;
}

// ─── Helpers de dev — S3/S4 ──────────────────────────────────────────────────
// Génèrent un vrai token (structure JWT) + un profil, pour que getCurrentUser()
// ci-dessus fonctionne EXACTEMENT comme avec un vrai backend, sans code séparé.
//   setMockUser("CLIENT")   setMockUser("PROVIDER")
//   setMockUser("ADMIN")    setMockUser("AGENT")
//   clearMockUser()
function base64UrlEncode(obj) {
  return btoa(JSON.stringify(obj))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export function buildDevToken(userId, role) {
  const header = { alg: "none", typ: "JWT" };
  const payload = {
    userId,
    role,
    type: "access",
    sub: `${role.toLowerCase()}@dev.local`,
    iss: "serviloc-dev",
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 8 * 3600, // session de dev : 8h
  };
  return `${base64UrlEncode(header)}.${base64UrlEncode(payload)}.dev-signature`;
}

export function setMockUser(role, name = "Test User") {
  const userId = `dev-${role.toLowerCase()}`;
  localStorage.setItem(ACCESS_KEY, buildDevToken(userId, role));
  localStorage.setItem(
    USER_KEY,
    JSON.stringify({
      id: userId,
      role: role.toLowerCase(),
      firstName: name,
      lastName: "",
      fullName: name,
      email: `${role.toLowerCase()}@dev.local`,
      avatarInitial: name.charAt(0).toUpperCase(),
    })
  );
  window.location.reload();
}

export function clearMockUser() {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(USER_KEY);
  window.location.href = "/auth/login";
}

// Exposer dans window pour les tests console
window.__sl = { setMockUser, clearMockUser };
console.info(
  "%c[ServiLoc Dev] " +
  "Connecte-toi via : __sl.setMockUser('CLIENT') | __sl.setMockUser('PROVIDER') | __sl.setMockUser('ADMIN') | __sl.setMockUser('AGENT') | __sl.setMockUser('SERVICE_CLIENT')",
  "color:#1B4332;font-weight:bold"
);
