// src/components/MapEmbed.jsx
import { useState } from "react";

/**
 * MapEmbed
 * Zone carte placeholder (en attendant l'intégration Leaflet/Mapbox).
 * Mode interactif : clic pour sélectionner une position (simulé).
 * Mode lecture : affichage d'une adresse avec marqueur.
 *
 * En production S3/S4 : remplacer le div placeholder par un composant Leaflet.
 */
export function MapEmbed({
  address,
  label = "Localisation",
  interactive = false,
  onLocationChange,
  height = "200px",
  className = "",
}) {
  const [selected, setSelected] = useState(false);

  function handleClick(e) {
    if (!interactive) return;
    // Simulation de sélection — en prod : extraire lat/lng depuis l'event Leaflet
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width).toFixed(4);
    const y = ((e.clientY - rect.top) / rect.height).toFixed(4);
    // Coordonnées simulées centrées sur Bafoussam
    const coords = {
      lat: parseFloat((5.4764 - (y - 0.5) * 0.05).toFixed(6)),
      lng: parseFloat((10.4176 + (x - 0.5) * 0.05).toFixed(6)),
    };
    setSelected(true);
    onLocationChange?.(coords);
  }

  return (
    <div className={`flex flex-col gap-2 font-[family-name:var(--font-body)] ${className}`}>
      {/* Zone carte */}
      <div
        onClick={handleClick}
        style={{ height }}
        className={`
          relative w-full rounded-[var(--radius-lg)] overflow-hidden
          bg-info-light border-2 transition-all duration-150
          ${interactive
            ? selected
              ? "border-success cursor-default"
              : "border-info border-dashed cursor-crosshair hover:border-brand"
            : "border-sl-200"
          }
        `}
      >
        {/* Grille de fond simulant une carte */}
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(var(--color-info) 1px, transparent 1px), " +
              "linear-gradient(90deg, var(--color-info) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Marqueur centré */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
          <span className="text-[28px] drop-shadow-sm">
            {selected ? "📍" : interactive ? "🗺️" : "📍"}
          </span>
          <span className="text-[12px] font-medium text-info bg-white/80
                           px-3 py-1 rounded-full backdrop-blur-sm">
            {interactive && !selected
              ? "Cliquez pour sélectionner la position"
              : label}
          </span>
        </div>

        {/* Badge succès si sélectionné */}
        {selected && (
          <div className="absolute top-2 right-2 bg-success text-white text-[11px]
                          font-bold px-2 py-[2px] rounded-full">
            ✓ Sélectionné
          </div>
        )}
      </div>

      {/* Adresse sous la carte */}
      {address && (
        <div className="flex items-center gap-2">
          <span className="text-[14px]">📌</span>
          <span className="text-[13px] text-sl-600">{address}</span>
        </div>
      )}
    </div>
  );
}
