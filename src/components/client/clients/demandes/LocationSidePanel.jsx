// src/components/client/clients/demandes/LocationSidePanel.jsx
import {MapEmbed} from '../../../../components/commons/MapEmbed';

/**
 * LocationSidePanel — Panneau carte + adresse avec bouton Modifier
 * Props:
 *   address: string
 *   lat, lng: number — coordonnées pour MapEmbed (MapEmbed n'a pas de prop `address`)
 *   onModify: () => void
 */
export default function LocationSidePanel({ address, lat, lng, onModify }) {
  return (
    <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-sl-200)] overflow-hidden shadow-[var(--shadow-card)]">
      <div className="px-4 pt-4">
        <p className="text-[11px] font-semibold tracking-widest text-[var(--color-sl-500)] uppercase mb-3">
          Localisation de la mission
        </p>
      </div>

      <MapEmbed
        lat={lat}
        lng={lng}
        label="📍 Carte interactive"
        interactive={false}
        height="180px"
      />

      <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--color-sl-100)]">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-[var(--color-brand)]" fill="currentColor" viewBox="0 0 24 24">
            <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
          </svg>
          <span className="text-[13px] text-[var(--color-sl-700)] font-medium truncate max-w-[160px]">
            {address || 'Adresse non définie'}
          </span>
        </div>
        <button
          onClick={onModify}
          className="text-[13px] font-semibold text-[var(--color-sl-900)] hover:text-[var(--color-brand)] transition-colors"
        >
          Modifier
        </button>
      </div>
    </div>
  );
}