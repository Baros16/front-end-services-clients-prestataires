// src/components/service-client/LitigeDetailsPanel.jsx
import { Card, Badge } from "../commons";
import { formatMotif, formatMotifUpper } from "../../utils/formatters";

export default function LitigeDetailsPanel({ litige }) {
  if (!litige) return null;

  return (
    <Card title="Details du litige">
      <p className="text-xs text-sl-500 mb-1">Motif selectionne</p>
      <div className="mb-4">
        <Badge label={formatMotifUpper(litige.motif)} variant="danger" />
      </div>

      <p className="text-xs text-sl-500 mb-1">Description du client</p>
      <div className="bg-sl-100 rounded-[var(--radius-md)] p-3 text-sm text-sl-700 mb-4">
        "{litige.clientDescription}"
      </div>

      {litige.attachments && litige.attachments.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-sl-500 mb-2">Pieces jointes</p>
          <div className="flex flex-row flex-nowrap gap-2 overflow-x-auto">
            {litige.attachments.map((att) => (
              <span
                key={att.id}
                onClick={() => window.open(att.url, "_blank")}
                className="inline-flex items-center gap-1 px-3 py-1 bg-sl-100 rounded-full text-xs text-sl-700 whitespace-nowrap cursor-pointer hover:bg-sl-200 transition-colors"
              >
                {att.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {litige.originalQuote && (
        <div>
          <p className="text-xs text-sl-500 mb-2 uppercase tracking-[0.06em]">Devis original</p>
          <div className="divide-y divide-sl-100 text-sm">
            <div className="flex justify-between py-2">
              <span className="text-sl-600">Main d'oeuvre</span>
              <span className="font-medium">{litige.originalQuote.labour.toLocaleString("fr-FR")} XAF</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-sl-600">Materiaux</span>
              <span className="font-medium">{litige.originalQuote.materials.toLocaleString("fr-FR")} XAF</span>
            </div>
            <div className="flex justify-between py-2 font-bold">
              <span>Total paye</span>
              <span>{litige.originalQuote.total.toLocaleString("fr-FR")} XAF</span>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
