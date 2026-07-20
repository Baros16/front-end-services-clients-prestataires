// src/components/common/MapEmbed.jsx
import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// ─── Centre par défaut : Bafoussam ───────────────────────────────────────────
const BAFOUSSAM = [5.4764, 10.4176];
const DEFAULT_ZOOM = 14;

// ─── Icône custom : SVG MapPin inline ────────────────────────────────────────
// Évite la dépendance aux fichiers PNG de Leaflet (souvent cassés avec Vite).
function makeIcon(color = 'var(--color-brand)') {
  return L.divIcon({
    className: '',
    iconSize:    [28, 36],
    iconAnchor:  [14, 36],
    popupAnchor: [0, -36],
    html: `
      <svg width="28" height="36" viewBox="0 0 28 36"
           xmlns="http://www.w3.org/2000/svg">
        <path
          d="M14 0C6.27 0 0 6.27 0 14c0 9.33 14 22 14 22S28 23.33 28 14C28 6.27 21.73 0 14 0z"
          fill="${color}" />
        <circle cx="14" cy="14" r="6" fill="white" />
      </svg>
    `,
  });
}

// ─── Sous-composant : repositionne la carte quand lat/lng changent ───────────
function RecenterMap({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    if (lat != null && lng != null) {
      map.setView([lat, lng], map.getZoom(), { animate: true });
    }
  }, [lat, lng, map]);
  return null;
}

// ─── Sous-composant : capture les clics en mode interactif ───────────────────
function ClickHandler({ onLocationChange }) {
  useMapEvents({
    click(e) {
      onLocationChange?.({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

// ─── MapEmbed ─────────────────────────────────────────────────────────────────
/**
 * Carte Leaflet + OpenStreetMap.
 *
 * @prop {number}   lat               - Latitude du marqueur
 * @prop {number}   lng               - Longitude du marqueur
 * @prop {string}   label             - Texte affiché sous le marqueur (popup)
 * @prop {boolean}  interactive       - Mode sélection : clic déplace le marqueur
 * @prop {function} onLocationChange  - ({ lat, lng }) => void  (mode interactif)
 * @prop {string}   height            - Hauteur CSS, ex : "200px"
 * @prop {string}   markerColor       - Couleur SVG du marqueur (défaut : brand)
 * @prop {string}   className         - Classes Tailwind supplémentaires
 */
export function MapEmbed({
  lat,
  lng,
  label       = '',
  interactive = false,
  onLocationChange,
  height      = '200px',
  markerColor = 'var(--color-brand)',
  className   = '',
}) {
  const center  = (lat != null && lng != null) ? [lat, lng] : BAFOUSSAM;
  const hasMarker = lat != null && lng != null;
  const icon    = makeIcon(markerColor);

  return (
    <div
      className={`w-full overflow-hidden rounded-[var(--radius-lg)] ${className}`}
      style={{
        height,
        border: `1.5px solid var(--color-sl-200)`,
        cursor: interactive ? 'crosshair' : 'default',
      }}
    >
      <MapContainer
        center={center}
        zoom={DEFAULT_ZOOM}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
        scrollWheelZoom={false}   // évite le zoom accidentel en scrollant la page
        attributionControl={true}
      >
        {/* Tuiles OpenStreetMap — gratuites, sans clé API */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          maxZoom={19}
        />

        {/* Recentre la carte si les coordonnées changent */}
        <RecenterMap lat={lat} lng={lng} />

        {/* Marqueur — affiché seulement si on a des coordonnées */}
        {hasMarker && (
          <Marker
            position={[lat, lng]}
            icon={icon}
            draggable={interactive}
            eventHandlers={interactive ? {
              dragend: (e) => {
                const { lat: la, lng: lo } = e.target.getLatLng();
                onLocationChange?.({ lat: la, lng: lo });
              },
            } : {}}
          />
        )}

        {/* Capture les clics en mode interactif */}
        {interactive && <ClickHandler onLocationChange={onLocationChange} />}
      </MapContainer>
    </div>
  );
}