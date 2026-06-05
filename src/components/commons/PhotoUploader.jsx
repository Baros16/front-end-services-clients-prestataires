// src/components/PhotoUploader.jsx
import { useRef } from "react";

/**
 * PhotoUploader
 * Zone de dépôt photo avec miniatures.
 * Affiche les photos déjà ajoutées + slots "+" pour en ajouter.
 * Utilisé dans Nouvelle Demande et Signalement Litige.
 *
 * UploadedPhoto : { id, url, name }
 */
export function PhotoUploader({
  photos = [],
  onAdd,
  onRemove,
  maxPhotos = 4,
  label = "PHOTOS (OPTIONNEL)",
  className = "",
}) {
  const fileInputRef = useRef(null);
  const remaining = maxPhotos - photos.length;

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (file) {
      onAdd?.(file);
      // Reset input pour permettre re-sélection du même fichier
      e.target.value = "";
    }
  }

  return (
    <div className={`flex flex-col gap-3 font-[family-name:var(--font-body)] ${className}`}>
      {label && (
        <span className="text-[11px] font-bold tracking-[0.1em] uppercase text-sl-500">
          {label}
        </span>
      )}

      <div className="flex flex-wrap gap-3">
        {/* Photos déjà ajoutées */}
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="relative w-20 h-20 rounded-[var(--radius-md)] overflow-hidden
                       border-2 border-success group"
          >
            <img
              src={photo.url}
              alt={photo.name}
              className="w-full h-full object-cover"
            />
            {/* Bouton suppression au hover */}
            {onRemove && (
              <button
                onClick={() => onRemove(photo.id)}
                className="
                  absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100
                  flex items-center justify-center transition-opacity duration-150
                  text-white text-[20px] border-none cursor-pointer
                "
              >
                ×
              </button>
            )}
            {/* Check vert */}
            <span className="absolute top-1 right-1 text-[12px] bg-success text-white
                             rounded-full w-4 h-4 flex items-center justify-center font-bold">
              ✓
            </span>
          </div>
        ))}

        {/* Slots d'ajout */}
        {remaining > 0 && (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="
              w-20 h-20 rounded-[var(--radius-md)] border-2 border-dashed border-sl-200
              flex flex-col items-center justify-center gap-1
              text-sl-400 hover:border-brand hover:text-brand
              transition-colors duration-150 cursor-pointer bg-sl-50
            "
          >
            <span className="text-[22px] leading-none">+</span>
            <span className="text-[10px] font-medium">
              {photos.length === 0 ? "Ajouter" : "Autre"}
            </span>
          </button>
        )}
      </div>

      {/* Input fichier caché */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Compteur */}
      <span className="text-[11px] text-sl-400">
        {photos.length} / {maxPhotos} photo{maxPhotos > 1 ? "s" : ""}
      </span>
    </div>
  );
}
