// src/components/common/Sidebar.jsx

import { NavLink }          from 'react-router-dom';
import { Avatar }           from './Avatar';
import { UserAvatarFooter } from './UserAvatarFooter';
import { RoleTag }          from './RoleTag';
import { ChevronLeft }      from './Icons';

// ── Thèmes par rôle ───────────────────────────────────────────────────────────
const ROLE_THEMES = {
  client: {
    wrapper:      'bg-white border-r border-sl-200',
    logo:         'text-brand',
    itemBase:     'text-sl-500 hover:bg-sl-50 hover:text-sl-900',
    itemActive:   'bg-brand-xlight text-brand font-semibold',
    itemDot:      'bg-brand',
    countBadge:   'bg-sl-100 text-sl-600',
    countActive:  'bg-brand text-white',
    footerBorder: 'border-sl-100',
    chevronBorder:'border-sl-200 bg-sl-50 hover:bg-sl-100',
    chevronColor: '#64748B',
  },
  provider: {
    wrapper:      'bg-brand',
    logo:         'text-white',
    itemBase:     'text-white/60 hover:bg-white/10 hover:text-white',
    itemActive:   'bg-white/15 text-white font-semibold',
    itemDot:      'bg-white',
    countBadge:   'bg-white/20 text-white',
    countActive:  'bg-white text-brand',
    footerBorder: 'border-white/10',
    chevronBorder:'border-white/20 bg-white/10 hover:bg-white/20',
    chevronColor: '#FFFFFF99',
  },
  admin: {
    wrapper:      'bg-sl-900',
    logo:         'text-white',
    itemBase:     'text-sl-400 hover:bg-white/5 hover:text-white',
    itemActive:   'bg-white/10 text-white font-semibold',
    itemDot:      'bg-accent',
    countBadge:   'bg-white/10 text-sl-300',
    countActive:  'bg-accent text-sl-900',
    footerBorder: 'border-white/10',
    chevronBorder:'border-white/20 bg-white/10 hover:bg-white/20',
    chevronColor: '#94A3B8',
  },
  service_client: {
    wrapper:      'bg-sl-800',
    logo:         'text-white',
    itemBase:     'text-sl-400 hover:bg-white/5 hover:text-white',
    itemActive:   'bg-white/10 text-white font-semibold',
    itemDot:      'bg-info',
    countBadge:   'bg-white/10 text-sl-300',
    countActive:  'bg-info text-white',
    footerBorder: 'border-white/10',
    chevronBorder:'border-white/20 bg-white/10 hover:bg-white/20',
    chevronColor: '#94A3B8',
  },
};

// ── Sidebar ───────────────────────────────────────────────────────────────────
export function Sidebar({
  items = [],
  activeItemId,
  role = 'client',
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
        flex flex-col h-full w-full overflow-hidden
        font-[family-name:var(--font-body)]
        ${t.wrapper}
      `}
    >
      {/* ── En-tête : logo + bouton collapse ──────────────────────────── */}
      <div
        className={`
          flex flex-col shrink-0
          transition-[padding] duration-[260ms] ease-[cubic-bezier(0.4,0,0.2,1)]
          ${collapsed ? 'items-center pt-5 pb-3 px-0 gap-3' : 'pt-6 pb-4 px-5'}
        `}
      >
        <div className={`flex items-center w-full ${collapsed ? 'justify-center' : 'justify-between mb-3'}`}>
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

          {/* Bouton collapse — ChevronLeft Lucide avec rotation CSS */}
          <button
            onClick={onToggleCollapse}
            aria-label={collapsed ? 'Développer la navigation' : 'Réduire la navigation'}
            className={`
              w-7 h-7 rounded-[var(--radius-sm)] border flex items-center justify-center
              shrink-0 cursor-pointer transition-colors ${t.chevronBorder}
            `}
          >
            <ChevronLeft
              size={14}
              color={t.chevronColor}
              style={{
                transform:  collapsed ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 260ms cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            />
          </button>
        </div>

        {/* RoleTag commun — masqué en mode collapsed */}
        {!collapsed && <RoleTag role={role} />}
      </div>

      {/* ── Items de navigation ───────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-2 flex flex-col gap-[2px]">
        {items.map(item => (
          <NavLink
            key={item.id}
            to={item.href}
            onClick={() => { onNavigate?.(item.id); onClose?.(); }}
            title={collapsed ? item.label : undefined}
            className={({ isActive }) => `
              flex items-center rounded-[var(--radius-md)]
              text-[13px] transition-all duration-150 cursor-pointer no-underline
              ${collapsed ? 'relative justify-center px-0 py-[10px]' : 'gap-3 px-3 py-[9px]'}
              ${isActive ? t.itemActive : t.itemBase}
            `}
          >
            {({ isActive }) => (
              <>
                {/* Dot actif — masqué en collapsed */}
                {!collapsed && (
                  isActive
                    ? <span className={`w-[5px] h-[5px] rounded-full shrink-0 ${t.itemDot}`} />
                    : <span className="w-[5px] shrink-0" />
                )}

                {/* Icône Lucide */}
                <span className="leading-none shrink-0">{item.icon}</span>

                {/* Label + badge count — masqués en collapsed */}
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
                        {item.count > 99 ? '99+' : item.count}
                      </span>
                    )}
                  </>
                )}

                {/* Badge count repositionné en collapsed */}
                {collapsed && item.count !== undefined && item.count > 0 && (
                  <span
                    className="absolute top-0.5 right-0.5 text-white text-[8px]
                               font-bold px-1 rounded-full leading-[1.4]"
                    style={{ background: 'var(--color-danger)' }}
                  >
                    {item.count > 9 ? '9+' : item.count}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>

      {/* ── Footer utilisateur ────────────────────────────────────────── */}
      {user && (
        <div className={`shrink-0 border-t ${t.footerBorder}`}>
          {collapsed
            ? (
              /* Mode collapsed : Avatar seul centré */
              <div className="flex justify-center py-3">
                <Avatar
                  initial={user.avatarInitial}
                  size="sm"
                  bgClass="bg-white/20"
                />
              </div>
            )
            : (
              /* Mode expanded : UserAvatarFooter commun */
              <UserAvatarFooter
                initial={user.avatarInitial}
                name={user.name}
                subtitle={user.subtitle}
              />
            )
          }
        </div>
      )}
    </nav>
  );
}