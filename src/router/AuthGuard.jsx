// src/router/AuthGuard.jsx
import { Navigate, useLocation } from "react-router-dom";

/**
 * AuthGuard
 * Protège une route selon le rôle requis.
 *
 * Fonctionnement :
 *  S1/S2 → lit un mock token dans localStorage (clé "sl_mock_user")
 *  S3    → M1 remplace getMockUser() par une vraie vérification JWT
 *
 * allowedRoles : string[] — ex: ["CLIENT"] ou ["ADMIN", "SERVICE_CLIENT"]
 */

// ─── Lecture du token ────────────────────────────────────────────────────────
// S1/S2 : mock token stocké manuellement pour tester la navigation
// S3    : remplacer cette fonction par une vraie vérification JWT
function getCurrentUser() {
  try {
    const raw = localStorage.getItem("sl_mock_user");
    if (!raw) return null;
    return JSON.parse(raw);
    // S3 — décommenter et remplacer le bloc ci-dessus par :
    // const token = localStorage.getItem("sl_token");
    // if (!token) return null;
    // const payload = JSON.parse(atob(token.split(".")[1]));
    // if (payload.exp * 1000 < Date.now()) return null;  // token expiré
    // return { role: payload.role, id: payload.sub, name: payload.name };
  } catch {
    return null;
  }
}

// ─── Redirections par rôle ───────────────────────────────────────────────────
const ROLE_HOME = {
  CLIENT:         "/client/dashboard",
  PROVIDER:       "/provider/dashboard",
  ADMIN:          "/admin/dashboard",
  SERVICE_CLIENT: "/admin/dashboard",
};

// ─── Composant ───────────────────────────────────────────────────────────────
export function AuthGuard({ allowedRoles, children }) {
  const location = useLocation();
  const user = getCurrentUser();

  // Pas de token → login
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

// ─── Helpers pour les tests S1/S2 ───────────────────────────────────────────
// Appeler depuis la console navigateur pour simuler une connexion :
//   setMockUser("CLIENT")      → connecte en tant que client
//   setMockUser("PROVIDER")    → connecte en tant que prestataire
//   setMockUser("ADMIN")       → connecte en tant qu'admin
//   clearMockUser()            → déconnecte

export function setMockUser(role, name = "Test User") {
  localStorage.setItem(
    "sl_mock_user",
    JSON.stringify({ role, name, id: `mock-${role.toLowerCase()}` })
  );
  window.location.reload();
}

export function clearMockUser() {
  localStorage.removeItem("sl_mock_user");
  window.location.href = "/auth/login";
}

// Exposer dans window pour les tests console (S1/S2 uniquement)
  window.__sl = { setMockUser, clearMockUser };
  console.info(
    "%c[ServiLoc Mock] " +
    "Connecte-toi via : __sl.setMockUser('CLIENT') | __sl.setMockUser('PROVIDER') | __sl.setMockUser('ADMIN')",
    "color:#1B4332;font-weight:bold"
  );

