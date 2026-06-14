// src/components/admin/dashboard/ActiveLitigesPanel.jsx

import { Card, StatusBadge, AmountDisplay, EmptyState } from "../../commons";

/**
 * ActiveLitigesPanel
 *
 * Section "Litiges en cours" — lecture seule, cliquable pour naviguer
 * vers la page de détail.
 *
 * status attendu (après toDashboard) : "traitement" | "ouvert" | "resolu"
 * — tous sont des StatusVariant valides.
 *
 * @param {{
 *   litiges: LitigeSummary[],
 *   onLitigeClick: (id: string) => void,
 * }} props
 *
 * @typedef {{ id: string, reference: string, motif: string, amount: number, status: string }} LitigeSummary
 */
export default function ActiveLitigesPanel({ litiges, onLitigeClick }) {
  return (
    <Card title="Litiges en cours">
      {litiges.length === 0 ? (
        <EmptyState icon="⚖️" title="Aucun litige actif" />
      ) : (
        litiges.map((l) => (
          <button
            key={l.id}
            type="button"
            onClick={() => onLitigeClick(l.id)}
            className="
              w-full text-left flex items-start justify-between gap-3
              py-3 border-b border-sl-100 last:border-0
              hover:bg-sl-50 rounded transition-colors cursor-pointer
            "
          >
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-sl-900">{l.reference}</p>
              <p className="text-[12px] text-sl-500 truncate">{l.motif}</p>
              <div className="mt-0.5">
                <AmountDisplay amount={l.amount} />
              </div>
            </div>
            <StatusBadge variant={l.status} size="sm" />
          </button>
        ))
      )}
    </Card>
  );
}
