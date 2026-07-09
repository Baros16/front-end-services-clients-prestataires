

const STATUS_CONFIG = {
  en_cours:       { label: "En cours",        classes: "bg-info-light text-info" },
  terminee:       { label: "Terminée",         classes: "bg-success-light text-success" },
  annulee:        { label: "Annulée",          classes: "bg-danger-light text-danger" },
  en_attente:     { label: "En attente",       classes: "bg-accent-light text-warning" },
  ouvert:         { label: "Ouvert",           classes: "bg-success-light text-successr" },
  traitement:     { label: "En traitement",    classes: "bg-accent-light text-warning" },
  resolu:         { label: "Résolu",           classes: "bg-success-light text-success" },
  disponible:     { label: "Disponible",       classes: "bg-success-light text-success" },
  indisponible:   { label: "Indisponible",     classes: "bg-danger-light text-danger" },
  urgent:         { label: "Urgent",           classes: "bg-[#FEE2E2] text-[#991B1B]" },
  sequestre:      { label: "Séquestré",        classes: "bg-accent-light text-warning" },
  libere:         { label: "Libéré",           classes: "bg-success-light text-success" },
  litige:         { label: "Litige",           classes: "bg-danger-light text-danger" },
  dossier_ok:     { label: "Dossier OK",       classes: "bg-success-light text-success" },
  manquant:       { label: "Manquant",         classes: "bg-danger-light text-danger" },
  actif:          { label: "Actif",            classes: "bg-success-light text-success" },
  suspendu:       { label: "Suspendu",         classes: "bg-danger-light text-danger" },
  paye_sequestre: { label: "Payé / Séq.",      classes: "bg-accent-light text-warning" },
};

export function StatusBadge({ variant, withDot = false, size = "md", className = "" }) {
  const config = STATUS_CONFIG[variant] ?? STATUS_CONFIG.en_attente;

  const sizes = {
    sm: "px-2 py-[2px] text-[10px]",
    md: "px-[10px] py-1 text-[12px]",
  };

  return (
    <span
      className={`
        inline-flex items-center gap-[5px] rounded-full font-semibold
        tracking-[0.04em] uppercase font-[family-name:var(--font-body)]
        ${sizes[size]} ${config.classes} ${className}
      `}
    >
      {withDot && (
        <span className="w-[6px] h-[6px] rounded-full bg-current sl-animate-pulse-dot" />
      )}
      {config.label}
    </span>
  );
}


export { STATUS_CONFIG };
