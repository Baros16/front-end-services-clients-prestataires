// src/components/layout/AdminLayout.jsx
import { useState }  from "react";
import { Outlet }    from "react-router-dom";
import { AppShell }  from "../commons/AppShell";
import { Sidebar }   from "../commons/Sidebar";
import { useActiveNavItem, getMockUser } from "./_shared";

// ── Items de navigation ───────────────────────────────────────────────────────
const ADMIN_NAV = [
  { id: "dashboard",    label: "Dashboard",              icon: "📊", href: "/admin/dashboard" },
  { id: "utilisateurs", label: "Utilisateurs",           icon: "👥", href: "/admin/utilisateurs" },
  { id: "validation",   label: "Validation prestataire", icon: "✅", href: "/admin/validation" },
  { id: "litiges",      label: "Litiges",                icon: "⚖️", href: "/admin/litiges", count: 7 },
  { id: "statistiques", label: "Statstiques",            icon: "📊", href: "/admin/statistiques"}
];

// ── Layout ────────────────────────────────────────────────────────────────────
export function AdminLayout() {
  // count dynamique sur les litiges — alimenté par l'API en S3
  const [litigesCount] = useState(7);
  const activeId = useActiveNavItem(ADMIN_NAV);
  const user     = getMockUser();

  const navWithCount = ADMIN_NAV.map((item) =>
    item.id === "litiges" ? { ...item, count: litigesCount } : item
  );

  return (
    <AppShell role="admin" sidebar={
      <Sidebar
        role="admin"
        items={navWithCount}
        activeItemId={activeId}
        user={{
          avatarInitial: user.name?.[0] ?? "A",
          name:          user.name,
          subtitle:      "Administrateur",
        }}
      />
    }>
      <Outlet />
    </AppShell>
  );
}
