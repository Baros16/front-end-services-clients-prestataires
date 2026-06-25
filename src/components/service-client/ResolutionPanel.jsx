// src/components/service-client/ResolutionPanel.jsx
const RESOLUTION_OPTIONS = [
  { value: 'remboursement_partiel', label: 'Remboursement partiel' },
  { value: 'annulation_complete', label: 'Annulation complète' },
  { value: 'dedommagement_avoir', label: 'Dédommagement (avoir)' },
];

export default function ResolutionPanel({
  parties,
  selectedResolution,
  refundAmount,
  onResolutionChange,
  onRefundAmountChange,
  onSubmit,
  onClose,
  isSubmitting,
}) {
  return (
    <div className="border rounded-lg p-4 bg-white">
      <h3 className="font-bold text-lg mb-3 uppercase">Parties concernées</h3>

      {parties && (
        <div className="mb-4 space-y-2">
          {[parties.client, parties.provider].map((p) => (
            <div key={p.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                {p.avatarInitial}
              </div>
              <div>
                <p className="text-sm font-semibold">{p.name}</p>
                <p className="text-xs text-gray-500">⭐ {p.rating} · {p.role === 'client' ? 'Client' : 'Prestataire'}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <h3 className="font-bold text-lg mb-3">Résolution</h3>

      <div className="space-y-2 mb-3">
        {RESOLUTION_OPTIONS.map((opt) => (
          <label key={opt.value} className="flex items-center gap-2">
            <input
              type="radio"
              name="resolution"
              value={opt.value}
              checked={selectedResolution === opt.value}
              onChange={() => onResolutionChange(opt.value)}
            />
            {opt.label}
          </label>
        ))}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-semibold mb-1">Montant remboursé</label>
        <input
          type="text"
          value={refundAmount}
          onChange={(e) => onRefundAmountChange(e.target.value)}
          placeholder="0 FCFA"
          className="w-full border rounded px-2 py-1"
        />
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="flex-1 bg-blue-600 text-white py-2 rounded disabled:opacity-50"
        >
          {isSubmitting ? 'Envoi...' : 'Soumettre la résolution'}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="px-3 py-2 border rounded"
        >
          Clôturer le litige
        </button>
      </div>
    </div>
  );
}
