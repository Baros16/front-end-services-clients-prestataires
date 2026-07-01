// src/components/client/chat/MessageInput.jsx

import { useState } from 'react';

function IconPaperclip() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57
               A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
    </svg>
  );
}

function IconSend() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>
    </svg>
  );
}

export function MessageInput({ onSend, disabled }) {
  const [text, setText] = useState('');

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const canSend = text.trim().length > 0 && !disabled;

  return (
    <div className="flex items-center gap-3 px-6 py-4 bg-white border-t shrink-0"
      style={{ borderColor: 'var(--color-sl-200)' }}>

      <input
        type="text"
        value={text}
        onChange={e => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Votre message..."
        disabled={disabled}
        className="flex-1 px-4 py-3 text-sm rounded-xl outline-none transition-all duration-150"
        style={{
          background: 'var(--color-sl-50)',
          border:     '1.5px solid var(--color-sl-200)',
          color:      'var(--color-sl-900)',
          fontFamily: 'var(--font-body)',
        }}
        onFocus={e => e.target.style.borderColor = 'var(--color-brand-light)'}
        onBlur={e  => e.target.style.borderColor = 'var(--color-sl-200)'}
      />

      <button
        className="w-10 h-10 rounded-xl flex items-center justify-center
                   transition-all duration-150 active:scale-95 hover:bg-slate-100"
        style={{ color: 'var(--color-sl-400)' }}
        title="Joindre une image">
        <IconPaperclip />
      </button>

      <button
        onClick={handleSend}
        disabled={!canSend}
        className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold
                   transition-all duration-150 active:scale-95
                   disabled:opacity-40 disabled:cursor-not-allowed"
        style={{
          background: canSend ? 'var(--color-sl-900)' : 'var(--color-sl-300)',
          color:      '#ffffff',
          fontFamily: 'var(--font-body)',
        }}>
        Envoyer
        <IconSend />
      </button>
    </div>
  );
}