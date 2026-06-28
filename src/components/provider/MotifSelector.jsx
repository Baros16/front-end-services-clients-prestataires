export function MotifSelector({ motifs, selectedId, onChange }) {
  return (
    <div className="space-y-2">
      {motifs.map((m) => (
        <button
          key={m.id}
          onClick={() => onChange(m.id)}
          className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
            selectedId === m.id
              ? 'border-sl-900 bg-sl-50'
              : 'border-sl-100 bg-white hover:border-sl-300'
          }`}
        >
          <p className="font-semibold text-sm text-sl-900">{m.title}</p>
          <p className="text-xs text-sl-400 mt-0.5">{m.description}</p>
        </button>
      ))}
    </div>
  );
}
