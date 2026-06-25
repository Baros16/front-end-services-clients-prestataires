// src/components/admin/validation/ActionPanel.jsx

function IconWarning() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16
               a2 2 0 0 0 1.73-3Z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  );
}

export function ActionPanel({
  provider,
  documents,
  onValider,
  onRefuser,
  onEnvoyerSMS,
  loading,
}) {
  const missingDocs = documents.filter(d => d.status === 'manquant');
  const hasMissing  = missingDocs.length > 0;

  return (
    <div className="flex flex-col gap-4" style={{ width: 340, flexShrink: 0 }}>

      {/* Profil */}
      <div
        className="rounded-2xl p-6 flex flex-col items-center text-center gap-3"
        style={{
          background: '#ffffff',
          border:     '1px solid var(--color-sl-200)',
          boxShadow:  'var(--shadow-card)',
        }}
      >
        <p
          className="text-[10px] font-semibold uppercase tracking-widest self-start"
          style={{ color: 'var(--color-sl-400)', fontFamily: 'var(--font-display)' }}
        >
          Photo de profil
        </p>

        <div
          className="w-16 h-16 rounded-full flex items-center justify-center
                     text-white text-2xl font-bold select-none"
          style={{ background: 'var(--color-sl-300)', fontFamily: 'var(--font-display)' }}
        >
          {provider.avatarInitial}
        </div>

        {/* Étoiles vides */}
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="var(--color-sl-300)" strokeWidth="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02
                               12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          ))}
          <span
            className="text-xs ml-1"
            style={{ color: 'var(--color-sl-400)', fontFamily: 'var(--font-body)' }}
          >
            0
          </span>
        </div>

        <p
          className="text-xs"
          style={{ color: 'var(--color-sl-400)', fontFamily: 'var(--font-body)' }}
        >
          Nouveau prestataire
        </p>
      </div>

      {/* Actions */}
      <button
        onClick={onValider}
        disabled={loading || hasMissing}
        className="w-full py-3 rounded-xl text-sm font-semibold flex items-center
                   justify-center gap-2 transition-all duration-150
                   active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          background: 'var(--color-brand)',
          color:      '#ffffff',
          fontFamily: 'var(--font-body)',
        }}
      >
        Valider le prestataire
      </button>

      <button
        onClick={onRefuser}
        disabled={loading}
        className="w-full py-3 rounded-xl text-sm font-semibold flex items-center
                   justify-center gap-2 transition-all duration-150
                   active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          background: '#fff1f2',
          color:      'var(--color-error)',
          border:     '1px solid var(--color-error)',
          fontFamily: 'var(--font-body)',
        }}
      >
        Refuser le dossier
      </button>

      {/* Alerte document manquant */}
      {hasMissing && (
        <div
          className="rounded-xl p-4"
          style={{
            background: '#fffbeb',
            border:     '1px solid var(--color-warning)',
          }}
        >
          <p
            className="text-sm font-semibold flex items-center gap-2 mb-1"
            style={{ color: 'var(--color-warning)', fontFamily: 'var(--font-display)' }}
          >
            <IconWarning />
            Document manquant
          </p>
          <p
            className="text-xs mb-3"
            style={{ color: 'var(--color-sl-600)', fontFamily: 'var(--font-body)' }}
          >
            {missingDocs.map(d => d.label).join(', ')} est requis.
            Notifier le prestataire ?
          </p>
          <button
            onClick={onEnvoyerSMS}
            disabled={loading}
            className="w-full py-2 rounded-lg text-sm font-semibold
                       transition-all duration-150 active:scale-95
                       disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: '#ffffff',
              color:      'var(--color-sl-800)',
              border:     '1px solid var(--color-sl-300)',
              fontFamily: 'var(--font-body)',
            }}
          >
            Envoyer un rappel SMS
          </button>
        </div>
      )}
    </div>
  );
}