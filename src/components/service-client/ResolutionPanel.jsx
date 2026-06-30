// src/components/service-client/ResolutionPanel.jsx
const RESOLUTION_OPTIONS = [
  { value: 'remboursement_partiel', label: 'Remboursement partiel' },
  { value: 'annulation_complete', label: 'Annulation complète' },
  { value: 'dedommagement_avoir', label: 'Dédommagement (avoir)' },
];

export default function ResolutionPanel({
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
      <h3 className="font-bold text-lg mb-3">Proposition de résolution</h3>

      <div className="space-y-2 mb-4">
        {RESOLUTION_OPTIONS.map((opt) => {
          const isSelected = selectedResolution === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onResolutionChange(opt.value)}
              className={`w-full text-left px-3 py-2 rounded border text-sm font-medium transition-colors ${
                isSelected
                  ? 'border-brand bg-brand-xlight text-brand'
                  : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-semibold mb-1">Montant remboursé (XAF)</label>
        <input
          type="text"
          value={refundAmount}
          onChange={(e) => onRefundAmountChange(e.target.value)}
          placeholder="Ex: 10 000"
          className="w-full border rounded px-2 py-1"
        />
      </div>

      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="bg-brand text-white py-2 rounded font-semibold hover:bg-brand-light transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Envoi...' : 'Soumettre la résolution →'}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="py-2 border border-gray-200 rounded font-semibold hover:bg-gray-50 transition-colors"
        >
          Clôturer le litige
        </button>
      </div>
    </div>
  );
}
