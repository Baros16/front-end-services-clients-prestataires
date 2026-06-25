// src/components/client/chat/MessageSkeleton.jsx

const SKELETON_WIDTHS = [220, 280, 190, 260, 200];

export function MessageSkeleton() {
  return (
    <div className="px-6 py-3 space-y-4">
      {SKELETON_WIDTHS.map((width, i) => {
        const isOwn = i % 2 !== 0;
        return (
          <div key={i} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
            <div className="h-10 rounded-2xl sl-animate-shimmer"
              style={{ width, background: 'var(--color-sl-200)' }} />
          </div>
        );
      })}
    </div>
  );
}