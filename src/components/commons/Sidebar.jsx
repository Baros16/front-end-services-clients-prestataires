// src/components/Sidebar.jsx
import { NavLink } from "react-router-dom";

/**
 * Sidebar
 * Navigation latérale verticale fixe.
 * Le thème (fond, textes, item actif) change selon le rôle.
 *
 * roles : client | provider | admin | service_client
 *
 * NavItem : { id, label, icon: ReactNode, href, count? }
 */

// ── Thèmes par rôle ──────────────────────────────────────────
const ROLE_THEMES = {
  client: {
    wrapper:     "bg-white border-r border-sl-200 w-60",
    logo:        "text-brand",
    itemBase:    "text-sl-500 hover:bg-sl-50 hover:text-sl-900",
    itemActive:  "bg-brand-xlight text-brand font-semibold",
    itemDot:     "bg-brand",
    countBadge:  "bg-sl-100 text-sl-600",
    countActive: "bg-brand text-white",
    footerBorder:"border-sl-100",
  },
  provider: {
    wrapper:     "bg-brand w-60",
    logo:        "text-white",
    itemBase:    "text-white/60 hover:bg-white/10 hover:text-white",
    itemActive:  "bg-white/15 text-white font-semibold",
    itemDot:     "bg-white",
    countBadge:  "bg-white/20 text-white",
    countActive: "bg-white text-brand",
    footerBorder:"border-white/10",
  },
  admin: {
    wrapper:     "bg-sl-900 w-60",
    logo:        "text-white",
    itemBase:    "text-sl-400 hover:bg-white/5 hover:text-white",
    itemActive:  "bg-white/10 text-white font-semibold",
    itemDot:     "bg-accent",
    countBadge:  "bg-white/10 text-sl-300",
    countActive: "bg-accent text-sl-900",
    footerBorder:"border-white/10",
  },
  service_client: {
    wrapper:     "bg-sl-800 w-60",
    logo:        "text-white",
    itemBase:    "text-sl-400 hover:bg-white/5 hover:text-white",
    itemActive:  "bg-white/10 text-white font-semibold",
    itemDot:     "bg-info",
    countBadge:  "bg-white/10 text-sl-300",
    countActive: "bg-info text-white",
    footerBorder:"border-white/10",
  },
};

// ── Labels des rôles ─────────────────────────────────────────
const ROLE_LABELS = {
  client:         "CLIENT",
  provider:       "PRESTATAIRE",
  admin:          "ADMIN",
  service_client: "SERVICE CLIENT",
};

// ── RoleTag interne ──────────────────────────────────────────
function RoleTag({ role, theme }) {
  const tagStyles = {
    client:         "bg-brand-xlight text-brand",
    provider:       "bg-white/20 text-white",
    admin:          "bg-white/10 text-sl-300",
    service_client: "bg-white/10 text-sl-300",
  };

  return (
    <span
      className={`
        inline-block px-[10px] py-[3px] rounded-full text-[10px] font-bold
        tracking-[0.12em] uppercase font-[family-name:var(--font-body)]
        ${tagStyles[role]}
      `}
    >
      {ROLE_LABELS[role]}
    </span>
  );
}

// ── UserAvatarFooter interne ─────────────────────────────────
function UserAvatarFooter({ initial, name, subtitle, theme }) {
  return (
    <div className={`flex items-center gap-3 px-4 py-4 border-t ${theme.footerBorder}`}>
      <div
        className="w-9 h-9 rounded-full bg-sl-300 flex items-center justify-center
                   text-white text-[13px] font-bold font-[family-name:var(--font-display)] shrink-0"
      >
        {initial?.toUpperCase()}
      </div>
      <div className="min-w-0 flex-1">
        <p className={`text-[13px] font-semibold truncate leading-tight
          ${theme.logo}`}
        >
          {name}
        </p>
        <p className="text-[11px] text-sl-400 truncate mt-[1px]">{subtitle}</p>
      </div>
    </div>
  );
}

// ── Sidebar principal ────────────────────────────────────────
export function Sidebar({ items = [], activeItemId, role = "client", user, onNavigate }) {
  const t = ROLE_THEMES[role] ?? ROLE_THEMES.client;

  return (
    <nav
      className={`
        flex flex-col h-full ${t.wrapper}
        font-[family-name:var(--font-body)]
      `}
    >
      {/* Logo + RoleTag */}
      <div className="px-5 pt-6 pb-4 shrink-0">
        <div className="flex items-center gap-2 mb-3">
          <span
            className={`
              font-[family-name:var(--font-display)] font-extrabold text-[22px]
              tracking-[-0.03em] ${t.logo}
            `}
          >
            ServiLoc
          </span>
        </div>
        <RoleTag role={role} theme={t} />
      </div>

      {/* Items de navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-2 flex flex-col gap-[2px]">
        {items.map((item) => {
          const isActive = item.id === activeItemId;

          return (
            <NavLink
              key={item.id}
              to={item.href}
              onClick={() => onNavigate?.(item.id)}
              className={`
                flex items-center gap-3 px-3 py-[9px] rounded-[var(--radius-md)]
                text-[13px] transition-all duration-150 cursor-pointer
                no-underline
                ${isActive ? t.itemActive : t.itemBase}
              `}
            >
              {/* Dot actif */}
              {isActive && (
                <span className={`w-[5px] h-[5px] rounded-full shrink-0 ${t.itemDot}`} />
              )}
              {!isActive && <span className="w-[5px] shrink-0" />}

              {/* Icône */}
              <span className="text-[16px] leading-none shrink-0">{item.icon}</span>

              {/* Label */}
              <span className="flex-1 truncate">{item.label}</span>

              {/* Badge count */}
              {item.count !== undefined && item.count > 0 && (
                <span
                  className={`
                    text-[10px] font-bold px-[7px] py-[2px] rounded-full min-w-[20px]
                    text-center tabular-nums
                    ${isActive ? t.countActive : t.countBadge}
                  `}
                >
                  {item.count > 99 ? "99+" : item.count}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Footer utilisateur */}
      {user && (
        <div className="shrink-0">
          <UserAvatarFooter
            initial={user.avatarInitial}
            name={user.name}
            subtitle={user.subtitle}
            theme={t}
          />
        </div>
      )}
    </nav>
  );
}
