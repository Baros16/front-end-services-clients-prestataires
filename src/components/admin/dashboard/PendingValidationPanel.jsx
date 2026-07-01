// src/components/admin/dashboard/PendingValidationPanel.jsx

import { Card, Badge, EmptyState } from "../../commons";
import ValidationListItem from "./ValidationListItem";

/**
 * PendingValidationPanel
 *
 * Section "Prestataires en attente de validation".
 * Badge numérique sur le titre + liste de ValidationListItem.
 *
 * @param {{
 *   pendingProviders: PendingProvider[],
 *   onApprove: (id: string) => void,
 *   onReject:  (id: string) => void,
 * }} props
 */
export default function PendingValidationPanel({ pendingProviders, onApprove, onReject }) {
  return (
    <Card
      title="Prestataires en attente de validation"
      actions={
        pendingProviders.length > 0 ? (
          <Badge
            label={`${pendingProviders.length} DOSSIERS`}
            variant="warning"
            size="sm"
          />
        ) : null
      }
    >
      {pendingProviders.length === 0 ? (
        <EmptyState
          icon="✅"
          title="Aucun dossier en attente"
          subtitle="Tous les dossiers ont été traités."
        />
      ) : (
        pendingProviders.map((p) => (
          <ValidationListItem
            key={p.id}
            provider={p}
            onApprove={() => onApprove(p.id)}
            onReject={() => onReject(p.id)}
          />
        ))
      )}
    </Card>
  );
}
