// src/components/layout/ProviderLayout.jsx
import { Outlet } from "react-router-dom";
import { AppShell } from "../commons/AppShell";
import { Sidebar }  from "../commons/Sidebar";
import { useActiveNavItem, getMockUser } from "./_shared";

// ── Items de navigation ───────────────────────────────────────────────────────
const PROVIDER_NAV = [
  { id: "dashboard", label: "Tableau de bord",     icon: "🏠", href: "/provider/dashboard" },
  { id: "demandes",  label: "Demandes disponibles", icon: "🔍", href: "/provider/demandes" },
  { id: "devis",     label: "Mes devis",            icon: "📄", href: "/provider/devis" },
  { id: "missions",  label: "Mes missions",          icon: "🎯", href: "/provider/missions" },
  { id: "gains",     label: "Gains",                icon: "💰", href: "/provider/gains" },
];

// ── Layout ────────────────────────────────────────────────────────────────────
export function ProviderLayout() {
  const activeId = useActiveNavItem(PROVIDER_NAV);
  const user     = getMockUser();

  return (
    <AppShell role="provider" sidebar={
      <Sidebar
        role="provider"
        items={PROVIDER_NAV}
        activeItemId={activeId}
        user={{
          avatarInitial: user.name?.[0] ?? "P",
          name:          user.name,
          subtitle:      "Prestataire",
        }}
      />
    }>
      <Outlet />
    </AppShell>
  );
}
