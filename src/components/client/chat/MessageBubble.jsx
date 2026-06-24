// src/components/client/chat/MessageBubble.jsx

function formatTime(isoString) {
  return new Date(isoString).toLocaleTimeString('fr-CM', {
    hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Douala',
  });
}

export function MessageBubble({ message, isOwn }) {
  return (
    <div className={`flex px-6 py-1 ${isOwn ? 'justify-end' : 'justify-start'}`}
      style={{ animation: 'slMsgIn 0.18s ease forwards' }}>

      <div className={`flex flex-col gap-1 max-w-[58%] ${isOwn ? 'items-end' : 'items-start'}`}>

        {message.imageUrl && (
          <img src={message.imageUrl} alt="Photo jointe"
            className="rounded-2xl object-cover w-full" style={{ maxHeight: 180 }} />
        )}

        {message.content && (
          <div className="px-4 py-3 text-sm leading-relaxed"
            style={{
              background:   isOwn ? 'var(--color-sl-900)' : '#ffffff',
              color:        isOwn ? '#ffffff' : 'var(--color-sl-800)',
              border:       isOwn ? 'none' : '1px solid var(--color-sl-200)',
              borderRadius: isOwn
                ? 'var(--radius-lg) var(--radius-sm) var(--radius-lg) var(--radius-lg)'
                : 'var(--radius-sm) var(--radius-lg) var(--radius-lg) var(--radius-lg)',
              fontFamily:   'var(--font-body)',
              boxShadow:    isOwn ? 'none' : 'var(--shadow-card)',
            }}>
            {message.content}
          </div>
        )}

        <span className="text-xs px-1"
          style={{ color: 'var(--color-sl-400)', fontFamily: 'var(--font-body)' }}>
          {formatTime(message.sentAt)}
        </span>
      </div>
    </div>
  );
}