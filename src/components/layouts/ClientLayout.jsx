// src/components/layout/ClientLayout.jsx
import { Outlet } from "react-router-dom";
import { AppShell } from "../commons/AppShell";
import { Sidebar }  from "../commons/Sidebar";
import { useActiveNavItem, getMockUser } from "./_shared";

// ── Items de navigation ───────────────────────────────────────────────────────
const CLIENT_NAV = [
  { id: "dashboard",        label: "Tableau de bord", icon: "🏠", href: "/client/dashboard" },
  { id: "demandes",         label: "Mes demandes",     icon: "📋", href: "/client/demandes" },
  { id: "nouvelle-demande", label: "Nouvelle demande", icon: "➕", href: "/client/nouvelle-demande" },
  { id: "missions",         label: "Mes missions",     icon: "🎯", href: "/client/missions" },
  { id: "notation",         label: "Notation",         icon: "⭐", href: "/client/notation" },
];

// ── Layout ────────────────────────────────────────────────────────────────────
export function ClientLayout() {
  const activeId = useActiveNavItem(CLIENT_NAV);
  const user     = getMockUser();

  return (
    <AppShell role="client" sidebar={
      <Sidebar
        role="client"
        items={CLIENT_NAV}
        activeItemId={activeId}
        user={{
          avatarInitial: user.name?.[0] ?? "U",
          name:          user.name,
          subtitle:      "Client",
        }}
      />
    }>
      <Outlet />
    </AppShell>
  );
}
