// src/components/RoleTag.jsx

/**
 * RoleTag
 * Capsule affichée sous le logo ServiLoc dans la Sidebar.
 * Peut aussi être utilisée indépendamment dans d'autres contextes.
 *
 * roles : CLIENT | PRESTATAIRE | ADMIN | SERVICE CLIENT
 */

const ROLE_STYLES = {
  CLIENT:           "bg-brand-xlight text-brand",
  PRESTATAIRE:      "bg-accent-light text-[#B45309]",
  ADMIN:            "bg-sl-800 text-white",
  "SERVICE CLIENT": "bg-info-light text-info",
};

export function RoleTag({ role, className = "" }) {
  const styles = ROLE_STYLES[role] ?? "bg-sl-100 text-sl-600";

  return (
    <span
      className={`
        inline-block px-[10px] py-[3px] rounded-full
        text-[10px] font-bold tracking-[0.12em] uppercase
        font-[family-name:var(--font-body)]
        ${styles} ${className}
      `}
    >
      {role}
    </span>
  );
}
