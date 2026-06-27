// src/components/client/chat/MessageInput.jsx

import { useState }          from 'react';
import { Paperclip, Send }   from '../../commons';
import { Button }            from '../../commons';

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
        title="Joindre une image"
      >
        <Paperclip size={18} />
      </button>

      <Button onClick={handleSend} disabled={!canSend}>
        Send<Send size={14} />
      </Button>
    </div>
  );
}