// src/router/layouts.jsx
import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { AppShell } from "../components/commons/AppShell";
import { Sidebar } from "../components/commons/Sidebar";

/**
 * Layouts — un par espace applicatif
 * ClientLayout | ProviderLayout | AdminLayout
 *
 * Chaque layout :
 *  1. Définit les items de navigation de sa Sidebar
 *  2. Monte AppShell (Sidebar fixe + zone main)
 *  3. Laisse <Outlet /> injecter la page active
 */

// ─── Items de navigation ─────────────────────────────────────────────────────

const CLIENT_NAV = [
  { id: "dashboard",        label: "Tableau de bord",  icon: "🏠", href: "/client/dashboard" },
  { id: "demandes",         label: "Mes demandes",      icon: "📋", href: "/client/demandes" },
  { id: "nouvelle-demande", label: "Nouvelle demande",  icon: "➕", href: "/client/nouvelle-demande" },
  { id: "missions",         label: "Mes missions",      icon: "🎯", href: "/client/missions" },
  { id: "notation",         label: "Notation",          icon: "⭐", href: "/client/notation" },
];

const PROVIDER_NAV = [
  { id: "dashboard",   label: "Tableau de bord",    icon: "🏠", href: "/provider/dashboard" },
  { id: "demandes",    label: "Demandes disponibles",icon: "🔍", href: "/provider/demandes" },
  { id: "devis",       label: "Mes devis",           icon: "📄", href: "/provider/devis" },
  { id: "missions",    label: "Mes missions",         icon: "🎯", href: "/provider/missions" },
  { id: "gains",       label: "Gains",               icon: "💰", href: "/provider/gains" },
];

const ADMIN_NAV = [
  { id: "dashboard",    label: "Dashboard",           icon: "📊", href: "/admin/dashboard" },
  { id: "utilisateurs", label: "Utilisateurs",        icon: "👥", href: "/admin/utilisateurs" },
  { id: "validation",   label: "Validation prestataire", icon: "✅", href: "/admin/validation" },
  { id: "litiges",      label: "Litiges",             icon: "⚖️", href: "/admin/litiges",  count: 7 },
];

// ─── Utilitaire : déduire l'item actif depuis l'URL ──────────────────────────
function useActiveNavItem(navItems) {
  const { pathname } = useLocation();
  const match = navItems.find((item) => pathname.startsWith(item.href));
  return match?.id ?? navItems[0]?.id;
}

// ─── Mock user (à remplacer par un vrai hook useAuth en S3) ──────────────────
function getMockUser() {
  try {
    const raw = localStorage.getItem("sl_mock_user");
    return raw ? JSON.parse(raw) : { name: "Utilisateur", role: "CLIENT" };
  } catch {
    return { name: "Utilisateur", role: "CLIENT" };
  }
}

// ─── CLIENT LAYOUT ───────────────────────────────────────────────────────────
export function ClientLayout() {
  const navigate = useNavigate();
  const activeId = useActiveNavItem(CLIENT_NAV);
  const user = getMockUser();

  const sidebar = (
    <Sidebar
      role="client"
      items={CLIENT_NAV}
      activeItemId={activeId}
      onNavigate={(id) => {
        const item = CLIENT_NAV.find((i) => i.id === id);
        if (item) navigate(item.href);
      }}
      user={{
        avatarInitial: user.name?.[0] ?? "U",
        name: user.name,
        subtitle: "Client",
      }}
    />
  );

  return (
    <AppShell role="client" sidebar={sidebar}>
      <Outlet />
    </AppShell>
  );
}

// ─── PROVIDER LAYOUT ─────────────────────────────────────────────────────────
export function ProviderLayout() {
  const navigate = useNavigate();
  const activeId = useActiveNavItem(PROVIDER_NAV);
  const user = getMockUser();

  const sidebar = (
    <Sidebar
      role="provider"
      items={PROVIDER_NAV}
      activeItemId={activeId}
      onNavigate={(id) => {
        const item = PROVIDER_NAV.find((i) => i.id === id);
        if (item) navigate(item.href);
      }}
      user={{
        avatarInitial: user.name?.[0] ?? "P",
        name: user.name,
        subtitle: "Prestataire",
      }}
    />
  );

  return (
    <AppShell role="provider" sidebar={sidebar}>
      <Outlet />
    </AppShell>
  );
}

// ─── ADMIN LAYOUT ────────────────────────────────────────────────────────────
export function AdminLayout() {
  const navigate = useNavigate();
  const [litigesCount, setLitigesCount] = useState(7);
  const activeId = useActiveNavItem(ADMIN_NAV);
  const user = getMockUser();

  // Inject count dynamique sur les litiges
  const navWithCount = ADMIN_NAV.map((item) =>
    item.id === "litiges" ? { ...item, count: litigesCount } : item
  );

  const sidebar = (
    <Sidebar
      role="admin"
      items={navWithCount}
      activeItemId={activeId}
      onNavigate={(id) => {
        const item = navWithCount.find((i) => i.id === id);
        if (item) navigate(item.href);
      }}
      user={{
        avatarInitial: user.name?.[0] ?? "A",
        name: user.name,
        subtitle: "Administrateur",
      }}
    />
  );

  return (
    <AppShell role="admin" sidebar={sidebar}>
      <Outlet />
    </AppShell>
  );
}
