// src/components/client/demand/RecapSidePanel.jsx
import { Button } from '../../../../components/commons/Button';
import { AlertBanner } from '../../../../components/commons/AlertBanner';

export default function RecapSidePanel({ recap, onCancel, onSubmit, isSubmitting, feedback, onDismissFeedback }) {
  const rows = [
    { label: 'Catégorie',    value: recap.category  || '—' },
    { label: 'Localisation', value: recap.location  || '—' },
    { label: 'Photos',       value: recap.photoCount > 0 ? `${recap.photoCount} photo${recap.photoCount > 1 ? 's' : ''}` : 'Aucune' },
    { label: 'Statut',       value: recap.status    || 'Ouverte' },
  ];

  return (
    <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-sl-200)] shadow-[var(--shadow-card)] overflow-hidden">
      <div className="px-4 pt-4 pb-3 border-b border-[var(--color-sl-100)]">
        <p className="text-[11px] font-semibold tracking-widest text-[var(--color-sl-500)] uppercase">
          Récapitulatif
        </p>
      </div>
      <div className="px-4 py-3 space-y-3">
        {rows.map(({ label, value }) => (
          <div key={label} className="flex items-center justify-between">
            <span className="text-[13px] text-[var(--color-sl-400)]">{label}</span>
            <span className="text-[13px] font-semibold text-[var(--color-sl-800)] text-right max-w-[140px] truncate">
              {value}
            </span>
          </div>
        ))}
      </div>

      {feedback && (
        <div className="px-4 pb-1">
          <AlertBanner
            type={feedback.type}
            message={feedback.message}
            onClose={onDismissFeedback}
            size="sm"
          />
        </div>
      )}

      <div className="px-4 pb-4 pt-2 border-t border-[var(--color-sl-100)] flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <Button variant="ghost" onClick={onCancel}>
          Annuler
        </Button>
        <Button variant="primary" onClick={onSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Publication…" : "Publier la demande →"}
        </Button>
      </div>
    </div>
  );
}