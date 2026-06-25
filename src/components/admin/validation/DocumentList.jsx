
// src/components/admin/validation/DocumentList.jsx

import { FileText } from '../../commons';
import { Card, StatusBadge }     from '../../commons';

const STATUS_CONFIG = {
  valide:   { label: 'Valide',    variant: 'dossier_ok' },
  manquant: { label: 'Manquant',  variant: 'manquant'   },
  en_cours: { label: 'En cours',  variant: 'en_attente' },
};

function DocumentRow({ doc }) {
  const config = STATUS_CONFIG[doc.status] ?? STATUS_CONFIG.manquant;

  return (
    <div className="flex items-center justify-between gap-4 py-4 border-b last:border-0"
      style={{ borderColor: 'var(--color-sl-100)' }}>

      <div className="flex items-start gap-3 min-w-0">
        <span className="mt-0.5 shrink-0" style={{ color: 'var(--color-sl-400)' }}>
          <FileText size={14} />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold truncate"
            style={{ color: 'var(--color-sl-800)', fontFamily: 'var(--font-display)' }}>
            {doc.label}
          </p>
          <p className="text-xs mt-0.5 truncate"
            style={{ color: 'var(--color-sl-400)', fontFamily: 'var(--font-body)' }}>
            {doc.reference ?? 'Document non fourni'}
          </p>
        </div>
      </div>

      <StatusBadge label={config.label} variant={config.variant} size="sm" />
    </div>
  );
}

export function DocumentList({ documents }) {
  return (
    <Card title="Documents fournis">
      <div>
        {documents.map(doc => (
          <DocumentRow key={doc.id} doc={doc} />
        ))}
      </div>
    </Card>
  );
}