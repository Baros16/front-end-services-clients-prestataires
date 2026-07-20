// src/components/client/chat/MessageBubble.jsx

import { useState, useRef } from 'react';
import { formatTime }       from '../../../utils/formatters';
import { Trash2 }           from '../../commons';

export function MessageBubble({ message, isOwn, pending, onDelete }) {
  const [hovered,    setHovered]    = useState(false);
  const [confirming, setConfirming] = useState(false);
  const pressTimer                  = useRef(null);

  // ── Long press mobile ────────────────────────────────────────────────────
  const handleTouchStart = () => {
    if (!onDelete || message.deleted || pending) return;
    pressTimer.current = setTimeout(() => setConfirming(true), 500);
  };
  const handleTouchEnd = () => clearTimeout(pressTimer.current);

  const handleConfirmDelete = () => {
    setConfirming(false);
    setHovered(false);
    onDelete?.();
  };

  // ── Tombstone ────────────────────────────────────────────────────────────
  if (message.deleted) {
    return (
      <div
        className={`flex px-3 md:px-6 py-1 ${isOwn ? 'justify-end' : 'justify-start'}`}
        style={{ animation: 'slMsgIn 0.18s ease forwards' }}
      >
        <div
          className="flex items-center gap-1.5 px-3 py-2"
          style={{
            border:       '1px solid var(--color-sl-200)',
            borderRadius: 'var(--radius-lg)',
            background:   'var(--color-sl-50)',
          }}
        >
          <Trash2 size={12} style={{ color: 'var(--color-sl-300)', flexShrink: 0 }} />
          <span style={{
            color:      'var(--color-sl-400)',
            fontFamily: 'var(--font-body)',
            fontSize:    13,
            fontStyle:  'italic',
          }}>
            Ce message a été supprimé
          </span>
        </div>
      </div>
    );
  }

  // ── Bulle normale ────────────────────────────────────────────────────────
  return (
    <div
      className={`flex px-3 md:px-6 py-1 ${isOwn ? 'justify-end' : 'justify-start'}`}
      style={{ animation: 'slMsgIn 0.18s ease forwards' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchEnd}
    >
      <div className={`flex items-end gap-1.5 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>

        {/* ── Icône suppression (propres messages, desktop hover) ── */}
        {isOwn && onDelete && !pending && (
          <button
            onClick={() => setConfirming(v => !v)}
            title="Supprimer ce message"
            style={{
              opacity:       hovered || confirming ? 1 : 0,
              pointerEvents: hovered || confirming ? 'auto' : 'none',
              transition:    'opacity 0.15s ease',
              background:    'none', border: 'none', cursor: 'pointer',
              padding:        4, borderRadius: 6,
              color:         'var(--color-sl-400)',
              flexShrink:     0,
              marginBottom:   22,   // aligne avec le bas de la bulle, au-dessus du timestamp
              display:        'flex', alignItems: 'center',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color      = 'var(--color-danger)';
              e.currentTarget.style.background = 'var(--color-danger-light)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color      = 'var(--color-sl-400)';
              e.currentTarget.style.background = 'none';
            }}
          >
            <Trash2 size={13} />
          </button>
        )}

        {/* ── Contenu ── */}
        <div className={`flex flex-col gap-1 max-w-[82%] md:max-w-[58%] ${isOwn ? 'items-end' : 'items-start'}`}>

          {message.imageUrl && (
            <img
              src={message.imageUrl}
              alt="pièce jointe"
              className="rounded-[var(--radius-md)] mt-1"
              style={{
                maxWidth: 220, maxHeight: 200,
                display: 'block', objectFit: 'cover',
                border: '1px solid var(--color-sl-200)', cursor: 'pointer',
              }}
              onClick={() => window.open(message.imageUrl, '_blank')}
            />
          )}

          {message.content && (
            <div
              className="px-4 py-3 text-sm leading-relaxed"
              style={{
                background:   isOwn ? 'var(--color-sl-900)' : 'var(--color-sl-50)',
                color:        isOwn ? 'var(--color-sl-50)'  : 'var(--color-sl-800)',
                border:       isOwn ? 'none' : '1px solid var(--color-sl-200)',
                borderRadius: isOwn
                  ? 'var(--radius-lg) var(--radius-sm) var(--radius-lg) var(--radius-lg)'
                  : 'var(--radius-sm) var(--radius-lg) var(--radius-lg) var(--radius-lg)',
                fontFamily:   'var(--font-body)',
                boxShadow:    isOwn ? 'none' : 'var(--shadow-card)',
                wordBreak:    'break-word',
                opacity:      pending ? 0.6 : 1,
                transition:   'opacity 0.2s',
              }}
            >
              {message.content}
            </div>
          )}

          {/* ── Confirmation inline ── */}
          {confirming && (
            <div
              className="flex items-center gap-2 px-2 py-1.5"
              style={{
                background:   'var(--color-danger-light)',
                border:       '1px solid var(--color-danger)',
                borderRadius: 'var(--radius-sm)',
                whiteSpace:   'nowrap',
              }}
            >
              <span style={{ fontSize: 11, color: 'var(--color-danger)', fontFamily: 'var(--font-body)' }}>
                Supprimer pour tout le monde ?
              </span>
              <button
                onClick={handleConfirmDelete}
                style={{
                  fontSize: 11, fontWeight: 600, color: 'var(--color-danger)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontFamily: 'var(--font-body)', padding: '0 2px',
                }}
              >
                Oui
              </button>
              <button
                onClick={() => setConfirming(false)}
                style={{
                  fontSize: 11, color: 'var(--color-sl-500)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontFamily: 'var(--font-body)', padding: '0 2px',
                }}
              >
                Non
              </button>
            </div>
          )}

          {/* Horodatage */}
          <span className="text-xs px-1"
            style={{ color: 'var(--color-sl-400)', fontFamily: 'var(--font-body)' }}>
            {formatTime(message.sentAt)}
            {pending && (
              <span style={{ marginLeft: 4, color: 'var(--color-sl-300)' }}>· Envoi…</span>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}