// src/components/common/LocationPicker.jsx
import { useState, useRef, useCallback, useEffect } from 'react';
import { MapEmbed }    from './MapEmbed';
import { Button }      from './Button';
import { Navigation, MapPin, Loader } from './Icons';
import { forwardGeocode, reverseGeocode } from '../../utils/geocoder';

const DEBOUNCE_MS = 1000;

// ─── Spinner inline ───────────────────────────────────────────────────────────
// Pas de composant Spinner dédié dans le barrel — on le reproduit ici en CSS
function InlineSpinner() {
  return (
    <div
      style={{
        width: 16, height: 16, borderRadius: '50%',
        border: '2px solid var(--color-sl-200)',
        borderTopColor: 'var(--color-brand)',
        animation: 'sl-spin 0.7s linear infinite',
        flexShrink: 0,
      }}
    />
  );
}

// ─── LocationPicker ───────────────────────────────────────────────────────────
/**
 * Champ de saisie de localisation : texte libre + bouton géolocalisation + carte interactive.
 *
 * Trois chemins utilisateur :
 *   A) Saisie texte  → debounce 1s → forwardGeocode  → centre la carte
 *   B) "Ma position" → navigator.geolocation         → reverseGeocode → remplit le texte
 *   C) Clic carte    → reverseGeocode                → remplit le texte
 *
 * @prop {{ lat: number|null, lng: number|null, address: string }} value
 * @prop {function}  onChange   - ({ lat, lng, address }) => void
 * @prop {string}    label      - Label affiché au-dessus du champ
 * @prop {boolean}   required
 * @prop {boolean}   disabled
 * @prop {string}    placeholder
 * @prop {string}    mapHeight  - Hauteur de la carte (défaut: '220px')
 */
export function LocationPicker({
  value       = { lat: null, lng: null, address: '' },
  onChange,
  label       = 'Localisation',
  required    = false,
  disabled    = false,
  placeholder = 'Ex : Quartier Ngoa-Ekele, Yaoundé',
  mapHeight   = '220px',
}) {
  // Valeur locale du champ texte (peut diverger temporairement de value.address)
  const [inputText, setInputText]   = useState(value?.address ?? '');
  const [geocoding, setGeocoding]   = useState(false);
  const [geoError,  setGeoError]    = useState(null); // 'PERMISSION_DENIED' | 'NOT_SUPPORTED'
  const debounceRef = useRef(null);

  // Sync depuis l'extérieur si value.address change (reset du formulaire, etc.)
  useEffect(() => {
    if (value?.address !== undefined && value.address !== inputText) {
      setInputText(value.address ?? '');
    }
    // Intentionnellement pas inputText dans les deps — on ne veut pas de boucle
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value?.address]);

  // ── Chemin A : saisie texte avec debounce ────────────────────────────────
  const handleInputChange = useCallback((e) => {
    const text = e.target.value;
    setInputText(text);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!text.trim()) {
      onChange?.({ lat: null, lng: null, address: '' });
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setGeocoding(true);
      const coords = await forwardGeocode(text);
      setGeocoding(false);
      if (coords) {
        onChange?.({ lat: coords.lat, lng: coords.lng, address: text });
      }
      // Si pas de résultat, on garde les coordonnées précédentes — l'utilisateur
      // voit simplement que la carte n'a pas bougé
    }, DEBOUNCE_MS);
  }, [onChange]);

  // ── Chemin B : bouton "Ma position" ──────────────────────────────────────
  const handleGeoClick = useCallback(() => {
    if (!navigator.geolocation) {
      setGeoError('NOT_SUPPORTED');
      return;
    }
    setGeocoding(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const { latitude: lat, longitude: lng } = coords;
        const addr = await reverseGeocode(lat, lng);
        setInputText(addr);
        onChange?.({ lat, lng, address: addr });
        setGeocoding(false);
      },
      (err) => {
        setGeoError(
          err.code === err.PERMISSION_DENIED ? 'PERMISSION_DENIED' : 'NOT_SUPPORTED'
        );
        setGeocoding(false);
      },
      { enableHighAccuracy: true, timeout: 10_000, maximumAge: 60_000 },
    );
  }, [onChange]);

  // ── Chemin C : clic ou drag sur la carte ─────────────────────────────────
  const handleMapChange = useCallback(async ({ lat, lng }) => {
    setGeocoding(true);
    const addr = await reverseGeocode(lat, lng);
    setGeocoding(false);
    setInputText(addr);
    onChange?.({ lat, lng, address: addr });
  }, [onChange]);

  const isLoading   = geocoding;
  const hasCoords   = value?.lat != null && value?.lng != null;

  return (
    <div
      className="flex flex-col gap-3"
      style={{ fontFamily: 'var(--font-body)' }}
    >
      {/* ── Label ── */}
      {label && (
        <label
          className="text-[13px] font-semibold"
          style={{ color: 'var(--color-sl-700)' }}
        >
          {label}
          {required && (
            <span style={{ color: 'var(--color-danger)', marginLeft: 2 }}>*</span>
          )}
        </label>
      )}

      {/* ── Input + bouton géolocalisation ── */}
      <div className="flex gap-2 items-center">
        {/* Champ texte */}
        <div className="relative flex-1">
          <input
            type="text"
            value={inputText}
            onChange={handleInputChange}
            placeholder={placeholder}
            disabled={disabled || isLoading}
            className="w-full px-3 py-[10px] text-[14px] rounded-[var(--radius-md)]
                       outline-none transition-all duration-150"
            style={{
              border:      `1.5px solid var(--color-sl-200)`,
              color:       'var(--color-sl-900)',
              background:  disabled ? 'var(--color-sl-50)' : '#ffffff',
              paddingRight: isLoading ? 36 : 12,
            }}
            onFocus={e  => { e.target.style.borderColor = 'var(--color-brand)'; }}
            onBlur={e   => { e.target.style.borderColor = 'var(--color-sl-200)'; }}
          />
          {/* Spinner dans le champ si geocoding en cours */}
          {isLoading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <InlineSpinner />
            </div>
          )}
        </div>

        {/* Bouton géolocalisation */}
        <Button
          variant="secondary"
          size="md"
          onClick={handleGeoClick}
          disabled={disabled || isLoading}
        >
          {isLoading
            ? <Loader size={15} style={{ animation: 'sl-spin 0.7s linear infinite' }} />
            : <Navigation size={15} />
          }
          <span className="hidden sm:inline">Ma position</span>
        </Button>
      </div>

      {/* ── Carte interactive ── */}
      <MapEmbed
        lat={value?.lat}
        lng={value?.lng}
        label={inputText || 'Cliquez pour sélectionner'}
        interactive={!disabled}
        onLocationChange={handleMapChange}
        height={mapHeight}
      />

      {/* ── Confirmation de position ── */}
      {hasCoords && !isLoading && (
        <div
          className="flex items-center gap-1.5"
          style={{ color: 'var(--color-success)', fontSize: 12 }}
        >
          <MapPin size={12} />
          <span className="truncate">{inputText || 'Position sélectionnée'}</span>
        </div>
      )}

      {/* ── Erreur géolocalisation ── */}
      {geoError && (
        <p style={{ color: 'var(--color-warning)', fontSize: 12 }}>
          {geoError === 'PERMISSION_DENIED'
            ? 'Accès à la position refusé — saisissez l\'adresse manuellement ou cliquez sur la carte.'
            : 'Géolocalisation non disponible sur cet appareil.'
          }
        </p>
      )}

      {/* Keyframes spinner — injectés une seule fois */}
      <style>{`@keyframes sl-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}