// src/components/SectionCard.jsx
import React from "react";

/**
 * SectionCard — Conteneur visuel blanc à coins arrondis avec bordure subtile.
 * Sert d'enveloppe pour les grandes zones de contenu (formulaires, listes, tableaux).
 *
 * @prop {string}    [title]     — Titre de section affiché en uppercase letter-spaced
 * @prop {ReactNode} [actions]   — Slot aligné à droite du titre (boutons, liens…)
 * @prop {ReactNode} children    — Contenu principal de la carte (requis)
 * @prop {string}    [className] — Classes Tailwind additionnelles sur l'enveloppe
 * @prop {boolean}   [noPadding] — Désactive le padding interne (tableaux bord-à-bord)
 */
export function SectionCard({
  title,
  actions,
  children,
  className = "",
  noPadding = false,
}) {
  const hasHeader = title || actions;

  return (
    <div
      className={[
        "bg-white rounded-[var(--radius-lg)] border border-[var(--color-sl-border)]",
        "shadow-[var(--shadow-sm)]",
        "overflow-hidden",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* ── En-tête optionnel ── */}
      {hasHeader && (
        <div
          className={[
            "flex items-center justify-between gap-4",
            "px-5 py-3",
            "border-b border-[var(--color-sl-border)]",
          ].join(" ")}
        >
          {title && (
            <span
              className="
                text-xs font-semibold uppercase tracking-widest
                text-[var(--color-sl-text-muted)]
                select-none
              "
            >
              {title}
            </span>
          )}

          {/* Pousse les actions à droite même si title est absent */}
          {!title && <span aria-hidden="true" />}

          {actions && (
            <div className="flex items-center gap-2 shrink-0">{actions}</div>
          )}
        </div>
      )}

      {/* ── Corps ── */}
      <div className={noPadding ? "" : "p-5"}>{children}</div>
    </div>
  );
}

export default SectionCard;