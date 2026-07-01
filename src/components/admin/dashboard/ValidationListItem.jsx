// src/components/admin/dashboard/ValidationListItem.jsx

import { Avatar, StatusBadge, Button } from "../../commons";

/**
 * ValidationListItem
 *
 * Ligne d'un prestataire en attente dans PendingValidationPanel.
 * Affiche : avatar · nom + spécialité + date · StatusBadge dossier · boutons ✓ / ×
 *
 * @param {{ provider: PendingProvider, onApprove: () => void, onReject: () => void }} props
 *
 * @typedef {{ id: string, name: string, specialty: string, submittedAt: string, dossierStatus: 'ok' | 'missing_docs' }} PendingProvider
 */
export default function ValidationListItem({ provider, onApprove, onReject }) {
  const dossierVariant = provider.dossierStatus === "ok" ? "dossier_ok" : "manquant";

  return (
    <div className="flex items-center gap-3 py-3 border-b border-sl-100 last:border-0">
      {/* Avatar */}
      <Avatar
        initial={provider.name[0]}
        name={provider.name}
        size="md"
        bgClass="bg-sl-200"
      />

      {/* Identité */}
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-semibold text-sl-900 truncate">
          {provider.name}
        </p>
        <p className="text-[12px] text-sl-400">
          {provider.specialty} · {provider.submittedAt}
        </p>
      </div>

      {/* Statut dossier */}
      <StatusBadge variant={dossierVariant} size="sm" />

      {/* Actions inline */}
      <div className="flex gap-1 shrink-0">
        <Button variant="secondary" size="sm" onClick={onApprove} title="Valider">
          ✓
        </Button>
        <Button variant="danger" size="sm" className="bg-danger-light border-danger text-sl-600 shadow-none" onClick={onReject} title="Refuser">
          ×
        </Button>
      </div>
    </div>
  );
}
