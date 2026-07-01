// src/components/Sidebar.jsx
import { NavLink } from "react-router-dom";

/**
 * Sidebar — navigation latérale collapsible
 *
 * Props métier (inchangées) :
 *   role         : "client" | "provider" | "admin" | "service_client"
 *   items        : { id, label, icon: ReactNode, href, count? }[]
 *   activeItemId : string   (conservé pour rétrocompat — NavLink gère l'actif)
 *   user         : { avatarInitial, name, subtitle }
 *   onNavigate   : (id) => void  (optionnel)
 *
 * Props injectées par AppShell via cloneElement :
 *   collapsed        : boolean   — mode icônes seules (desktop)
 *   onToggleCollapse : () => void
 *   onClose          : () => void — ferme le drawer mobile après clic nav
 */

// ── Thèmes par rôle ──────────────────────────────────────────────────────────
// w-full remplace w-60 : la largeur est désormais pilotée par AppShell
const ROLE_THEMES = {
  client: {
    wrapper:      "bg-white border-r border-sl-200",
    logo:         "text-brand",
    roleTagBg:    "bg-brand-xlight text-brand",
    itemBase:     "text-sl-500 hover:bg-sl-50 hover:text-sl-900",
    itemActive:   "bg-brand-xlight text-brand font-semibold",
    itemDot:      "bg-brand",
    countBadge:   "bg-sl-100 text-sl-600",
    countActive:  "bg-brand text-white",
    footerBorder: "border-sl-100",
    avatarBg:     "bg-sl-300 text-white",
    chevronBorder:"border-sl-200 bg-sl-50 hover:bg-sl-100",
    chevronStroke:"#64748B",
  },
  provider: {
    wrapper:      "bg-brand",
    logo:         "text-white",
    roleTagBg:    "bg-white/20 text-white",
    itemBase:     "text-white/60 hover:bg-white/10 hover:text-white",
    itemActive:   "bg-white/15 text-white font-semibold",
    itemDot:      "bg-white",
    countBadge:   "bg-white/20 text-white",
    countActive:  "bg-white text-brand",
    footerBorder: "border-white/10",
    avatarBg:     "bg-white/20 text-white",
    chevronBorder:"border-white/20 bg-white/10 hover:bg-white/20",
    chevronStroke:"#FFFFFF99",
  },
  admin: {
    wrapper:      "bg-sl-900",
    logo:         "text-white",
    roleTagBg:    "bg-white/10 text-sl-300",
    itemBase:     "text-sl-400 hover:bg-white/5 hover:text-white",
    itemActive:   "bg-white/10 text-white font-semibold",
    itemDot:      "bg-accent",
    countBadge:   "bg-white/10 text-sl-300",
    countActive:  "bg-accent text-sl-900",
    footerBorder: "border-white/10",
    avatarBg:     "bg-white/20 text-white",
    chevronBorder:"border-white/20 bg-white/10 hover:bg-white/20",
    chevronStroke:"#94A3B8",
  },
  service_client: {
    wrapper:      "bg-sl-800",
    logo:         "text-white",
    roleTagBg:    "bg-white/10 text-sl-300",
    itemBase:     "text-sl-400 hover:bg-white/5 hover:text-white",
    itemActive:   "bg-white/10 text-white font-semibold",
    itemDot:      "bg-info",
    countBadge:   "bg-white/10 text-sl-300",
    countActive:  "bg-info text-white",
    footerBorder: "border-white/10",
    avatarBg:     "bg-white/20 text-white",
    chevronBorder:"border-white/20 bg-white/10 hover:bg-white/20",
    chevronStroke:"#94A3B8",
  },
};

const ROLE_LABELS = {
  client:         "CLIENT",
  provider:       "PRESTATAIRE",
  admin:          "ADMIN",
  service_client: "SERVICE CLIENT",
};

// ── RoleTag ──────────────────────────────────────────────────────────────────
function RoleTag({ role, theme }) {
  return (
    <span
      className={`
        inline-block px-[10px] py-[3px] rounded-full text-[10px] font-bold
        tracking-[0.12em] uppercase font-[family-name:var(--font-body)]
        ${theme.roleTagBg}
      `}
    >
      {ROLE_LABELS[role]}
    </span>
  );
}

// ── UserAvatarFooter ─────────────────────────────────────────────────────────
function UserAvatarFooter({ initial, name, subtitle, collapsed, theme }) {
  return (
    <div
      className={`
        flex items-center border-t ${theme.footerBorder}
        transition-[padding] duration-[260ms] ease-[cubic-bezier(0.4,0,0.2,1)]
        ${collapsed ? "justify-center px-0 py-3" : "gap-3 px-4 py-4"}
      `}
    >
      <div
        className={`
          w-9 h-9 rounded-full flex items-center justify-center shrink-0
          text-[13px] font-bold font-[family-name:var(--font-display)]
          ${theme.avatarBg}
        `}
      >
        {initial?.toUpperCase()}
      </div>

      {!collapsed && (
        <div className="min-w-0 flex-1">
          <p className={`text-[13px] font-semibold truncate leading-tight ${theme.logo}`}>
            {name}
          </p>
          <p className="text-[11px] text-sl-400 truncate mt-[1px]">{subtitle}</p>
        </div>
      )}
    </div>
  );
}

// ── Sidebar principal ────────────────────────────────────────────────────────
export function Sidebar({
  items = [],
  activeItemId,
  role = "client",
  user,
  onNavigate,
  // Injectées par AppShell
  collapsed = false,
  onToggleCollapse,
  onClose,
}) {
  const t = ROLE_THEMES[role] ?? ROLE_THEMES.client;

  return (
    <nav
      className={`
        flex flex-col h-full w-full ${t.wrapper}
        font-[family-name:var(--font-body)]
        overflow-hidden
      `}
    >
      {/* ── En-tête : logo + bouton collapse ──────────────────────────── */}
      <div
        className={`
          flex items-start shrink-0
          transition-[padding] duration-[260ms] ease-[cubic-bezier(0.4,0,0.2,1)]
          ${collapsed ? "flex-col items-center pt-5 pb-3 px-0 gap-3" : "flex-col pt-6 pb-4 px-5"}
        `}
      >
        {/* Ligne logo + chevron */}
        <div className={`flex items-center w-full ${collapsed ? "justify-center" : "justify-between mb-3"}`}>
          {!collapsed && (
            <span
              className={`
                font-[family-name:var(--font-display)] font-extrabold text-[22px]
                tracking-[-0.03em] ${t.logo}
              `}
            >
              ServiLoc
            </span>
          )}

          {/* Bouton collapse / fermeture */}
          <button
            onClick={onToggleCollapse}
            aria-label={collapsed ? "Développer la navigation" : "Réduire la navigation"}
            className={`
              w-7 h-7 rounded-[var(--radius-sm)] border flex items-center justify-center
              shrink-0 cursor-pointer transition-colors ${t.chevronBorder}
            `}
          >
            <ChevronIcon collapsed={collapsed} stroke={t.chevronStroke} />
          </button>
        </div>

        {/* RoleTag — masqué en mode réduit */}
        {!collapsed && <RoleTag role={role} theme={t} />}
      </div>

      {/* ── Items de navigation ───────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-2 flex flex-col gap-[2px]">
        {items.map((item) => (
          <NavLink
            key={item.id}
            to={item.href}
            onClick={() => { onNavigate?.(item.id); onClose?.(); }}
            title={collapsed ? item.label : undefined}
            className={({ isActive }) => `
              flex items-center rounded-[var(--radius-md)]
              text-[13px] transition-all duration-150 cursor-pointer no-underline
              ${collapsed ? " relative justify-center px-0 py-[10px]" : "gap-3 px-3 py-[9px]"}
              ${isActive ? t.itemActive : t.itemBase}
            `}
          >
            {({ isActive }) => (
              <>
                {/* Dot actif (masqué en collapsed) */}
                {!collapsed && (
                  isActive
                    ? <span className={`w-[5px] h-[5px] rounded-full shrink-0 ${t.itemDot}`} />
                    : <span className="w-[5px] shrink-0" />
                )}

                {/* Icône */}
                <span className="text-[16px] leading-none shrink-0">{item.icon}</span>

                {/* Label + badge — masqués en collapsed */}
                {!collapsed && (
                  <>
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.count !== undefined && item.count > 0 && (
                      <span
                        className={`
                          text-[10px] font-bold px-[7px] py-[2px] rounded-full
                          min-w-[20px] text-center tabular-nums
                          ${isActive ? t.countActive : t.countBadge}
                        `}
                      >
                        {item.count > 99 ? "99+" : item.count}
                      </span>
                    )}
                  </>
                )}

                {/* Badge count repositionné en mode collapsed */}
                {collapsed && item.count !== undefined && item.count > 0 && (
                  <span className="absolute top-0.5 right-0.5 bg-danger text-white text-[8px] font-bold px-1 rounded-full leading-[1.4]">
                    {item.count > 9 ? "9+" : item.count}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>

      {/* ── Footer utilisateur ────────────────────────────────────────── */}
      {user && (
        <div className="shrink-0">
          <UserAvatarFooter
            initial={user.avatarInitial}
            name={user.name}
            subtitle={user.subtitle}
            collapsed={collapsed}
            theme={t}
          />
        </div>
      )}
    </nav>
  );
}

// ── Icône chevron animée ─────────────────────────────────────────────────────
function ChevronIcon({ collapsed, stroke }) {
  return (
    <svg
      width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"
      style={{
        transform: collapsed ? "rotate(180deg)" : "rotate(0deg)",
        transition: "transform 260ms cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      <path
        d="M9 3L5 7L9 11"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
