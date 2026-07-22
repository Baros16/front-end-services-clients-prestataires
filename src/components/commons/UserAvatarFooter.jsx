// src/components/UserAvatarFooter.jsx
import { LogOut } from './Icons';

/**
 * UserAvatarFooter
 * Bloc complet affiché en bas de Sidebar :
 * cercle initiale + nom complet + sous-titre (rôle, spécialité, note…)
 * + bouton de déconnexion optionnel.
 */
export function UserAvatarFooter({
  initial,
  name,
  subtitle,
  collapse = false,
  avatarColor = "bg-sl-300",
  className = "",
  onLogout,
}) {
  return (
    <div
      className={`
        flex items-center gap-2 px-4 py-4
        font-[family-name:var(--font-body)]
        ${className}
      `}
    >
      <UserAvatarCircle
        initial={initial}
        size="md"
        bgClass={avatarColor}
      />
      {!collapse && (
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-semibold text-sl-900 truncate leading-tight m-0">
            {name}
          </p>
          <p className="text-[11px] text-sl-400 truncate mt-[1px] m-0">
            {subtitle}
          </p>
        </div>
      )}
      {onLogout && (
        <button
          onClick={onLogout}
          aria-label="Se déconnecter"
          title="Se déconnecter"
          className="shrink-0 w-8 h-8 rounded-[var(--radius-sm)] flex items-center justify-center
                     text-sl-400 hover:text-danger hover:bg-danger-light
                     transition-colors cursor-pointer"
        >
          <LogOut size={16} />
        </button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────

/**
 * UserAvatarCircle
 * Cercle léger avec initiale ou image.
 * Utilisé dans les listes, cards, panels "parties concernées".
 *
 * sizes : sm | md | lg
 */

const SIZES = {
  sm: "w-7 h-7 text-[11px]",
  md: "w-9 h-9 text-[13px]",
  lg: "w-12 h-12 text-[18px]",
};

export function UserAvatarCircle({
  initial,
  size = "md",
  bgClass = "bg-sl-300",
  imageUrl,
  className = "",
}) {
  return (
    <div
      className={`
        ${SIZES[size]} ${bgClass}
        rounded-full flex items-center justify-center shrink-0
        overflow-hidden font-bold font-[family-name:var(--font-display)]
        text-white
        ${className}
      `}
    >
      {imageUrl ? (
        <img src={imageUrl} alt={initial} className="w-full h-full object-cover" />
      ) : (
        initial?.toUpperCase()
      )}
    </div>
  );
}