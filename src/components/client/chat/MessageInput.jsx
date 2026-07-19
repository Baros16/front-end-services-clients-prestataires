// src/components/client/chat/MessageInput.jsx
import { useState, useRef }from 'react';
import { Paperclip, Send } from '../../commons';
import { Button }          from '../../commons';
import { FileAttachment }  from '../../commons';
import { uploadPhotos }    from '../../../services/uploadService';

const MAX_ATTACHMENTS = 4;

export function MessageInput({ onSend, disabled }) {
  const [text,        setText]        = useState('');
  const [attachments, setAttachments] = useState([]);   // [{ id, url, name }]
  const [uploading,   setUploading]   = useState(false);
  const [uploadErr,   setUploadErr]   = useState(null);

  const fileInputRef = useRef(null);
  const textInputRef = useRef(null);

  // ── Envoi ────────────────────────────────────────────────────────────────
  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed && !attachments.length) return;

    if (attachments.length === 0) {
      onSend(trimmed, null, null);
    } else {
      // Texte + première image dans le même message
      onSend(trimmed, attachments[0].id ?? null, attachments[0].url ?? null);
      // Images supplémentaires : un message séparé par image
      for (let i = 1; i < attachments.length; i++) {
        const att = attachments[i];
        onSend('', att.id ?? null, att.url ?? null);
      }
    }

    setText('');
    setAttachments([]);
    setUploadErr(null);
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (text.trim().length > 0 || attachments.length > 0) handleSend();
    }
  };

  // ── Upload (multiple) ────────────────────────────────────────────────────
  const handleFileChange = async e => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    e.target.value = ''; // reset pour re-sélection

    const oversized = files.find(f => f.size > 5 * 1024 * 1024);
    if (oversized) {
      setUploadErr(`"${oversized.name}" dépasse 5 Mo.`);
      return;
    }

    const remaining = MAX_ATTACHMENTS - attachments.length;
    const toUpload  = files.slice(0, remaining);
    if (!toUpload.length) {
      setUploadErr(`Maximum ${MAX_ATTACHMENTS} images par message.`);
      return;
    }

    setUploading(true);
    setUploadErr(null);

    try {
      const result      = await uploadPhotos(toUpload, 'chat');
      const uploadsList = result?.data?.uploads ?? result?.uploads ?? [];
      if (!uploadsList.length) throw new Error('Fichiers non retournés.');

      setAttachments(prev => [...prev, ...uploadsList]);
      setTimeout(() => textInputRef.current?.focus(), 50);

    } catch (err) {
      console.error('[MessageInput] upload:', err);
      setUploadErr("Impossible d'envoyer ce fichier. Réessayez.");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveAttachment = idx => {
    setAttachments(prev => prev.filter((_, i) => i !== idx));
    setUploadErr(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const canAttach = !disabled && !uploading && attachments.length < MAX_ATTACHMENTS;
  const canSend   = (text.trim().length > 0 || attachments.length > 0) && !disabled && !uploading;

  return (
    <div
      className="flex flex-col gap-2 px-4 py-3 shrink-0"
      style={{ borderTop: '1px solid var(--color-sl-200)', background: '#ffffff' }}
    >

      {/* ── Prévisualisation pièces jointes ── */}
      {(uploading || attachments.length > 0 || uploadErr) && (
        <div className="px-1 flex flex-col gap-2">

          {uploading && (
            <div
              className="inline-flex items-center gap-2 px-3 py-2 rounded-[var(--radius-md)]"
              style={{
                background: 'var(--color-sl-50)',
                border:     '1px solid var(--color-sl-200)',
                color:      'var(--color-sl-400)',
                fontSize:    13,
                fontFamily: 'var(--font-body)',
              }}
            >
              <div style={{
                width: 14, height: 14, flexShrink: 0, borderRadius: '50%',
                border: '2px solid var(--color-sl-200)',
                borderTopColor: 'var(--color-brand)',
                animation: 'sl-spin 0.7s linear infinite',
              }} />
              Envoi des fichiers…
            </div>
          )}

          {/* Galerie thumbnails */}
          {attachments.length > 0 && !uploading && (
            <div className="flex flex-wrap items-center gap-2">
              {attachments.map((att, idx) => {
                const isImage = ['jpg', 'jpeg', 'png', 'webp'].some(
                  ext => att.name?.toLowerCase().endsWith(ext)
                );
                return isImage ? (
                  <div key={att.id ?? idx} className="relative inline-block">
                    <img
                      src={att.url}
                      alt={att.name}
                      className="rounded-[var(--radius-md)] object-cover"
                      style={{ width: 72, height: 72, display: 'block',
                               border: '1px solid var(--color-sl-200)' }}
                    />
                    <button
                      onClick={() => handleRemoveAttachment(idx)}
                      style={{
                        position: 'absolute', top: -6, right: -6,
                        background: 'var(--color-sl-700)', border: 'none',
                        borderRadius: '50%', width: 18, height: 18,
                        cursor: 'pointer', color: '#fff', fontSize: 11,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <FileAttachment
                    key={att.id ?? idx}
                    fileName={att.name}
                    fileUrl={att.url}
                    onRemove={() => handleRemoveAttachment(idx)}
                  />
                );
              })}
              <span style={{
                fontSize: 11, color: 'var(--color-sl-400)', fontFamily: 'var(--font-body)',
              }}>
                {attachments.length}/{MAX_ATTACHMENTS}
              </span>
            </div>
          )}

          {uploadErr && (
            <p style={{ margin: 0, fontSize: 12, color: 'var(--color-danger)',
                        fontFamily: 'var(--font-body)' }}>
              {uploadErr}
            </p>
          )}
        </div>
      )}

      {/* ── Barre de saisie ── */}
      <div className="flex items-center gap-2">
        <input
          ref={textInputRef}
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={attachments.length ? 'Ajoutez un message (optionnel)…' : 'Votre message…'}
          disabled={disabled || uploading}
          className="flex-1 px-4 py-[10px] text-sm rounded-xl outline-none transition-all duration-150"
          style={{
            background: 'var(--color-sl-50)',
            border:     '1.5px solid var(--color-sl-200)',
            color:      'var(--color-sl-900)',
            fontFamily: 'var(--font-body)',
          }}
          onFocus={e => e.target.style.borderColor = 'var(--color-brand-light)'}
          onBlur={e  => e.target.style.borderColor = 'var(--color-sl-200)'}
        />

        {/* Bouton Paperclip */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={!canAttach}
          title={
            attachments.length >= MAX_ATTACHMENTS
              ? `Maximum ${MAX_ATTACHMENTS} images par message`
              : 'Joindre des images (plusieurs autorisées)'
          }
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-150"
          style={{
            background: 'none', border: 'none',
            cursor: canAttach ? 'pointer' : 'not-allowed',
            color:  canAttach ? 'var(--color-sl-400)' : 'var(--color-sl-200)',
          }}
          onMouseEnter={e => { if (canAttach) e.currentTarget.style.background = 'var(--color-sl-100)'; }}
          onMouseLeave={e => e.currentTarget.style.background = 'none'}
        >
          <Paperclip size={18} />
        </button>

        {/* ✅ multiple activé */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,application/pdf"
          multiple
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />

        <Button variant="primary" size="md" onClick={handleSend} disabled={!canSend}>
          <Send size={14} />
          Envoyer
        </Button>
      </div>

      <style>{`@keyframes sl-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}