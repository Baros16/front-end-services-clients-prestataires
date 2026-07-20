// src/components/common/FileAttachment.jsx
import { FileText, Image, FileType, Paperclip, X } from './Icons';

// ─── Icône selon l'extension ──────────────────────────────────────────────────
function FileIcon({ ext }) {
  const size  = 15;
  const color = 'var(--color-sl-500)';
  const style = { color, flexShrink: 0 };

  if (ext === 'pdf')                              return <FileText  size={size} style={style} />;
  if (['jpg','jpeg','png','webp'].includes(ext))  return <Image     size={size} style={style} />;
  if (['doc','docx'].includes(ext))               return <FileType  size={size} style={style} />;
  return                                                 <Paperclip size={size} style={style} />;
}

/**
 * Capsule représentant un fichier joint (justificatif, pièce jointe, image chat).
 *
 * @prop {string}    fileName  - Nom du fichier affiché
 * @prop {string}    fileUrl   - URL de téléchargement (optionnel)
 * @prop {function}  onRemove  - Callback suppression (optionnel)
 * @prop {function}  onClick   - Callback clic sur la capsule (optionnel)
 * @prop {string}    className
 */
export function FileAttachment({
  fileName,
  fileUrl,
  onRemove,
  onClick,
  className = '',
}) {
  const ext = fileName?.split('.').pop()?.toLowerCase() ?? '';

  return (
    <div
      onClick={onClick}
      className={`
        inline-flex items-center gap-2 px-3 py-2
        border rounded-[var(--radius-md)]
        font-[family-name:var(--font-body)]
        transition-colors duration-150
        ${onClick ? 'cursor-pointer hover:border-sl-300' : ''}
        ${className}
      `}
      style={{
        background:   'var(--color-sl-50)',
        borderColor:  'var(--color-sl-200)',
        maxWidth:     260,
      }}
    >
      {/* Icône type fichier */}
      <FileIcon ext={ext} />

      {/* Nom fichier */}
      <span
        className="text-[13px] font-medium truncate flex-1"
        style={{ color: 'var(--color-sl-700)' }}
      >
        {fileUrl ? (

          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--color-info)' }}
            className="hover:underline"
            onClick={e => e.stopPropagation()}
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
          onClick={e => { e.stopPropagation(); onRemove(); }}
          className="transition-colors duration-150 shrink-0"
          style={{
            background:  'none',
            border:      'none',
            cursor:      'pointer',
            padding:     2,
            color:       'var(--color-sl-400)',
            display:     'flex',
            alignItems:  'center',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--color-danger)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--color-sl-400)'}
          title="Retirer le fichier"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}