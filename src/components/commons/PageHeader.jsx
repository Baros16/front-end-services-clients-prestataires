// src/components/PageHeader.jsx
import { StatusBadge } from "./StatusBadge";

/**
 * PageHeader
 * Barre de titre en haut du contenu principal.
 * title    : requis
 * subtitle : optionnel
 * badge    : { label, variant } — StatusBadge à droite du titre
 * actions  : ReactNode — slot boutons à droite
 */
export function PageHeader({ title, subtitle, badge, actions, className = "" }) {
  return (
    <div
      className={`
        flex items-start justify-between gap-4
        px-6 py-5 border-b border-sl-200 bg-white
        font-[family-name:var(--font-body)]
        ${className}
      `}
    >
      {/* Gauche — titre + sous-titre */}
      <div className="flex flex-col gap-1 min-w-0">
        <div className="flex items-center gap-3 flex-wrap">
          <h1
            className="
              font-[family-name:var(--font-display)] font-bold text-[20px]
              text-sl-900 leading-tight m-0
            "
          >
            {title}
          </h1>
          {badge && (
            <StatusBadge variant={badge.variant} label={badge.label} />
          )}
        </div>
        {subtitle && (
          <p className="text-[13px] text-sl-500 m-0">{subtitle}</p>
        )}
      </div>

      {/* Droite — actions */}
      {actions && (
        <div className="flex items-center gap-2 shrink-0 mt-[2px]">
          {actions}
        </div>
      )}
    </div>
  );
}
