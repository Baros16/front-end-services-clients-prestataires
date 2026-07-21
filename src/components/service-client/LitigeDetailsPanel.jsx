// src/components/service-client/LitigeDetailsPanel.jsx
import { Card, Badge, PriceDisplay, FileAttachment } from "../commons";

export default function LitigeDetailsPanel({ litige }) {
  if (!litige) return null;

  return (
    <Card title="Details du litige">
      <p className="text-xs text-sl-500 mb-1">Motif selectionne</p>
      <div className="mb-4">
        <Badge
          label={litige.motif.title}
          variant="danger"
          size="md"
          className="uppercase tracking-wide text-[13px] px-3 py-[6px]"
        />
      </div>

      <p className="text-xs text-sl-500 mb-1">Description du client</p>
      <div className="bg-sl-100 rounded-[var(--radius-md)] p-3 text-sm text-sl-700 mb-4">
        "{litige.clientDescription}"
      </div>

      {litige.attachments && litige.attachments.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-sl-500 mb-2">Pieces jointes</p>
          <div className="flex flex-row flex-wrap gap-2">
            {litige.attachments.map((att) => (
              <div key={att.id} className="inline-block w-auto">
                <FileAttachment
                  fileName={att.name}
                  fileUrl={att.url}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {litige.originalQuote && (
        <div>
          <p className="text-xs text-sl-500 mb-2 uppercase tracking-[0.06em]">Devis original</p>
          <div className="divide-y divide-sl-100 text-sm">
            <div className="flex justify-between items-center py-2">
              <span className="text-sl-600">Main d'oeuvre</span>
              <PriceDisplay amount={litige.originalQuote.labour} size="sm" />
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sl-600">Materiaux</span>
              <PriceDisplay amount={litige.originalQuote.materials} size="sm" />
            </div>
            <div className="flex justify-between items-center py-2 font-bold">
              <span>Total paye</span>
              <PriceDisplay amount={litige.originalQuote.total} size="md" />
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
