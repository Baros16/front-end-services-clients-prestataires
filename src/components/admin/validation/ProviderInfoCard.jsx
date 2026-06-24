// src/components/admin/validation/ProviderInfoCard.jsx

function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString('fr-CM', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
}

const ROWS = [
  { label: 'Nom complet',   key: p => p.fullName },
  { label: 'Téléphone',     key: p => p.phone },
  { label: 'Email',         key: p => p.email },
  { label: 'Spécialité',    key: p => p.specialty },
  { label: 'Tarif horaire', key: p => `${p.hourlyRate.toLocaleString('fr-CM')} XAF/h` },
  { label: 'Zone',          key: p => `${p.serviceZone.city} · ${p.serviceZone.radiusKm} km` },
  { label: 'Inscrit le',    key: p => formatDate(p.createdAt) },
];

export function ProviderInfoCard({ provider }) {
  return (
    <div
      className="rounded-2xl p-6"
      style={{
        background:  '#ffffff',
        border:      '1px solid var(--color-sl-200)',
        boxShadow:   'var(--shadow-card)',
      }}
    >
      <p
        className="text-[10px] font-semibold uppercase tracking-widest mb-5"
        style={{ color: 'var(--color-sl-400)', fontFamily: 'var(--font-display)' }}
      >
        Informations personnelles
      </p>

      <div className="divide-y" style={{ borderColor: 'var(--color-sl-100)' }}>
        {ROWS.map(({ label, key }) => (
          <div key={label} className="flex items-center justify-between py-3">
            <span
              className="text-sm"
              style={{ color: 'var(--color-sl-400)', fontFamily: 'var(--font-body)' }}
            >
              {label}
            </span>
            <span
              className="text-sm font-semibold text-right"
              style={{ color: 'var(--color-sl-900)', fontFamily: 'var(--font-body)' }}
            >
              {key(provider)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}