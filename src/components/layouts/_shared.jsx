// src/components/layout/_shared.jsx
import { useLocation } from "react-router-dom";

/**
 * Utilitaires partagés entre les layouts.
 * Fichier interne — ne pas importer hors du dossier layout/.
 */

// ── Déduit l'item actif depuis l'URL ─────────────────────────────────────────
export function useActiveNavItem(navItems) {
  const { pathname } = useLocation();
  const match = navItems.find((item) => pathname.startsWith(item.href));
  return match?.id ?? navItems[0]?.id;
}

// ── Lit le mock user dans localStorage ───────────────────────────────────────
// S3 : remplacer par un vrai hook useAuth basé sur JWT
export function getMockUser() {
  try {
    const raw = localStorage.getItem("sl_mock_user");
    return raw ? JSON.parse(raw) : { name: "Utilisateur", role: "CLIENT" };
  } catch {
    return { name: "Utilisateur", role: "CLIENT" };
  }
}
