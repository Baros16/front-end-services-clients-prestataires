// src/components/layout/_shared.jsx
import { useLocation } from "react-router-dom";
import { getCurrentUser } from "../../router/AuthGuard";


// ── Déduit l'item actif depuis l'URL ─────────────────────────────────────────
export function useActiveNavItem(navItems) {
  const { pathname } = useLocation();
  const match = navItems.find((item) => pathname.startsWith(item.href));
  return match?.id ?? navItems[0]?.id;
}

export function getMockUser() {
  return (
    getCurrentUser() ?? { name: "Utilisateur", role: "CLIENT", avatarInitial: "U" }
  );
}
