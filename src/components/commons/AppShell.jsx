// src/components/AppShell.jsx
import { useState, useEffect, cloneElement, isValidElement } from "react";


const ROLE_THEMES = {
  client:         { bg: "bg-sl-50",  mainBg: "bg-sl-50",  topbarBg: "bg-white",   darkTopbar: false },
  provider:       { bg: "bg-sl-50",  mainBg: "bg-sl-50",  topbarBg: "bg-brand",   darkTopbar: true  },
  admin:          { bg: "bg-sl-900", mainBg: "bg-sl-100", topbarBg: "bg-sl-900",  darkTopbar: true  },
  service_client: { bg: "bg-sl-800", mainBg: "bg-sl-100", topbarBg: "bg-sl-800",  darkTopbar: true  },
};

const STORAGE_KEY = "sl_sidebar_collapsed";

export function AppShell({ children, sidebar, role = "client" }) {
  const theme = ROLE_THEMES[role] ?? ROLE_THEMES.client;

  // ── État desktop : sidebar réduite (icônes seules) ───────────────────
  const [collapsed, setCollapsed] = useState(() => {
    try { return localStorage.getItem(STORAGE_KEY) === "true"; }
    catch { return false; }
  });

  // ── État mobile : drawer ouvert ──────────────────────────────────────
  const [mobileOpen, setMobileOpen] = useState(false);

  // Ferme le drawer au passage desktop
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const handler = (e) => { if (e.matches) setMobileOpen(false); };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Bloque le scroll body quand drawer ouvert
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const handleToggleCollapse = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try { localStorage.setItem(STORAGE_KEY, String(next)); } catch {}
      return next;
    });
  };

  const handleOpenMobile  = () => setMobileOpen(true);
  const handleCloseMobile = () => setMobileOpen(false);

  // Injection des props de contrôle dans le Sidebar via cloneElement
  // → layouts.jsx reste inchangé
  const sidebarWithProps = isValidElement(sidebar)
    ? cloneElement(sidebar, {
        collapsed,
        onToggleCollapse: handleToggleCollapse,
        onClose: handleCloseMobile,
      })
    : sidebar;

  return (
    <div className={`flex h-screen overflow-hidden ${theme.bg}`}>

      {/* ── Sidebar desktop — sticky, toujours dans le flux ─────────── */}
      <aside
        className={`
          hidden md:block shrink-0 h-full overflow-y-auto
          transition-[width] duration-[260ms] ease-[cubic-bezier(0.4,0,0.2,1)]
          ${collapsed ? "w-16" : "w-60"}
        `}
      >
        {sidebarWithProps}
      </aside>

      {/* ── Backdrop mobile ──────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        onClick={handleCloseMobile}
        className={`
          md:hidden fixed inset-0 bg-black/45 z-40
          transition-opacity duration-[260ms]
          ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
      />

      {/* ── Drawer mobile — fixed, hors flux ─────────────────────────── */}
      <aside
        className={`
          md:hidden fixed inset-y-0 left-0 w-60 z-50
          transition-transform duration-[280ms] ease-[cubic-bezier(0.4,0,0.2,1)]
          ${mobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}
        `}
      >
        {/* En mobile, collapsed = false (toujours plein dans le drawer) */}
        {isValidElement(sidebar)
          ? cloneElement(sidebar, { collapsed: false, onToggleCollapse: handleCloseMobile, onClose: handleCloseMobile })
          : sidebar}
      </aside>

      {/* ── Zone de contenu principale ───────────────────────────────── */}
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">

        {/* Topbar mobile */}
        <header
          className={`
            md:hidden shrink-0 h-14 flex items-center gap-3 px-4 sticky top-0 z-20
            border-b ${theme.darkTopbar ? "border-white/10" : "border-sl-200"}
            ${theme.topbarBg}
          `}
        >
          {/* Bouton hamburger */}
          <button
            onClick={handleOpenMobile}
            aria-label="Ouvrir le menu"
            aria-expanded={mobileOpen}
            className={`
              w-9 h-9 rounded-[var(--radius-sm)] flex items-center justify-center shrink-0
              border transition-colors
              ${theme.darkTopbar
                ? "border-white/20 bg-white/10 hover:bg-white/20"
                : "border-sl-200 bg-sl-50 hover:bg-sl-100"}
            `}
          >
            <HamburgerIcon dark={theme.darkTopbar} />
          </button>

          {/* Logo */}
          <span
            className={`
              font-[family-name:var(--font-display)] font-extrabold text-[18px]
              tracking-[-0.03em]
              ${theme.darkTopbar ? "text-white" : "text-brand"}
            `}
          >
            ServiLoc
          </span>
        </header>

        {/* Contenu de la page */}
        <main
          className={`
            flex-1 overflow-y-auto ${theme.mainBg}
            font-[family-name:var(--font-body)]
          `}
        >
          {children}
        </main>
      </div>
    </div>
  );
}

// ── Icône hamburger ─────────────────────────────────────────────────────────
function HamburgerIcon({ dark = false }) {
  const s = dark ? "#E2E8F0" : "#475569";
  return (
    <svg width="18" height="14" viewBox="0 0 18 14" fill="none" aria-hidden="true">
      <path d="M1 1H17"  stroke={s} strokeWidth="1.75" strokeLinecap="round" />
      <path d="M1 7H17"  stroke={s} strokeWidth="1.75" strokeLinecap="round" />
      <path d="M1 13H11" stroke={s} strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}
