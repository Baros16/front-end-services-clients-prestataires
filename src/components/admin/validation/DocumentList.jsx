// src/components/admin/validation/DocumentList.jsx

const STATUS_CONFIG = {
  valide: {
    label: 'Valide',
    style: {
      background: 'var(--color-success-light)',
      color:      'var(--color-success)',
      border:     '1px solid var(--color-success)',
    },
  },
  manquant: {
    label: 'Manquant',
    style: {
      background: '#fff1f2',
      color:      'var(--color-error)',
      border:     '1px solid var(--color-error)',
    },
  },
  en_cours: {
    label: 'En cours',
    style: {
      background: '#fffbeb',
      color:      'var(--color-warning)',
      border:     '1px solid var(--color-warning)',
    },
  },
};

function IconDoc() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
    </svg>
  );
}

function DocumentRow({ doc }) {
  const config = STATUS_CONFIG[doc.status] ?? STATUS_CONFIG.manquant;

  return (
    <div
      className="flex items-center justify-between gap-4 py-4 border-b last:border-0"
      style={{ borderColor: 'var(--color-sl-100)' }}
    >
      <div className="flex items-start gap-3 min-w-0">
        <span className="mt-0.5 shrink-0" style={{ color: 'var(--color-sl-400)' }}>
          <IconDoc />
        </span>
        <div className="min-w-0">
          <p
            className="text-sm font-semibold truncate"
            style={{ color: 'var(--color-sl-800)', fontFamily: 'var(--font-display)' }}
          >
            {doc.label}
          </p>
          <p
            className="text-xs mt-0.5 truncate"
            style={{ color: 'var(--color-sl-400)', fontFamily: 'var(--font-body)' }}
          >
            {doc.reference ?? 'Document non fourni'}
          </p>
        </div>
      </div>

      <span
        className="shrink-0 px-3 py-1 rounded-full text-xs font-semibold"
        style={{ ...config.style, fontFamily: 'var(--font-body)' }}
      >
        {config.label}
      </span>
    </div>
  );
}

export function DocumentList({ documents }) {
  return (
    <div
      className="rounded-2xl p-6"
      style={{
        background: '#ffffff',
        border:     '1px solid var(--color-sl-200)',
        boxShadow:  'var(--shadow-card)',
      }}
    >
      <p
        className="text-[10px] font-semibold uppercase tracking-widest mb-4"
        style={{ color: 'var(--color-sl-400)', fontFamily: 'var(--font-display)' }}
      >
        Documents fournis
      </p>

      <div>
        {documents.map(doc => (
          <DocumentRow key={doc.id} doc={doc} />
        ))}
      </div>
    </div>
  );
}