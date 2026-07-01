// src/components/index.js
// Barrel — un seul import pour tous les composants ServiLoc

// ── Layout ──────────────────────────────────────────────────
export { AppShell }          from "./AppShell";
export { Sidebar }           from "./Sidebar";
export { PageHeader }        from "./PageHeader";

// ── Identité ────────────────────────────────────────────────
export { RoleTag }           from "./RoleTag";
export { UserAvatarFooter, UserAvatarCircle } from "./UserAvatarFooter";
export { Avatar }            from "./Avatar";

// ── Boutons ─────────────────────────────────────────────────
export { Button }            from "./Button";

// ── Formulaires ─────────────────────────────────────────────
export { Input }             from "./Input";
export { SearchInput }       from "./SearchInput";
export { PhotoUploader }     from "./PhotoUploader";
export { FileAttachment }    from "./FileAttachment";

// ── Contenu & mise en page ───────────────────────────────────
export { Card }              from "./Card";
export { Modal }             from "./Modal";
export { TabBar }            from "./TabBar";
export { DataTable }         from "./DataTable";
export { ServiceCategoryCard } from "./ServiceCategoryCard";
export { MapEmbed }          from "./MapEmbed";

// ── Données & métriques ──────────────────────────────────────
export { StatCard }          from "./StatCard";
export { AmountDisplay }     from "./AmountDisplay";
export { PriceDisplay }      from "./PriceDisplay";
export { ProgressBar }       from "./ProgressBar";
export { RatingStars }       from "./RatingStars";

// ── Statuts & badges ────────────────────────────────────────
export { Badge }             from "./Badge";
export { StatusBadge }       from "./StatusBadge";

// ── Feedback & états ────────────────────────────────────────
export { Spinner }           from "./Spinner";
export { AlertBanner }       from "./AlertBanner";
export { EmptyState }        from "./EmptyState";
export { SkeletonLoader }    from "./SkeletonLoader";

// Ajouter à src/components/common/index.js
export * from './Icons';
