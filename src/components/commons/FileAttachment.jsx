// src/components/FileAttachment.jsx

/**
 * FileAttachment
 * Capsule représentant un fichier joint (justificatif, pièce jointe).
 * Cliquable pour prévisualiser ou télécharger.
 */
export function FileAttachment({
  fileName,
  fileUrl,
  onRemove,
  onClick,
  className = "",
}) {
  // Déterminer l'extension pour l'icône
  const ext = fileName?.split(".").pop()?.toLowerCase();
  const icon =
    ext === "pdf" ? "📄" :
    ["jpg","jpeg","png","webp"].includes(ext) ? "🖼️" :
    ["doc","docx"].includes(ext) ? "📝" :
    "📎";

  return (
    <div
      className={`
        inline-flex items-center gap-2 px-3 py-2
        bg-sl-50 border border-sl-200 rounded-[var(--radius-md)]
        font-[family-name:var(--font-body)] transition-colors duration-150
        ${onClick ? "cursor-pointer hover:bg-sl-100 hover:border-sl-300" : ""}
        ${className}
      `}
      onClick={onClick}
    >
      {/* Icône */}
      <span className="text-[16px] leading-none shrink-0">{icon}</span>

      {/* Nom fichier */}
      <span className="text-[13px] text-sl-700 font-medium truncate max-w-[160px]">
        {fileUrl ? (
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-info hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            {fileName}
          </a>
        ) : (
          fileName
        )}
      </span>

      {/* Bouton suppression */}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="
            text-sl-400 hover:text-danger text-[16px] leading-none
            bg-transparent border-none cursor-pointer p-0 ml-1
            transition-colors duration-150 shrink-0
          "
        >
          ×
        </button>
      )}
    </div>
  );
}
