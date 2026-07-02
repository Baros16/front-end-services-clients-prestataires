// src/components/service-client/ResolutionPanel.jsx
import { Card } from "../commons/Card";
import { Button } from "../commons/Button";

const RESOLUTION_OPTIONS = [
  { value: "remboursement_partiel", label: "Remboursement partiel" },
  { value: "annulation_complete", label: "Annulation complete" },
  { value: "dedommagement_avoir", label: "Dedommagement / avoir" },
];

export default function ResolutionPanel({
  selectedResolution,
  refundAmount,
  maxAmount,
  onResolutionChange,
  onRefundAmountChange,
  onSubmit,
  onClose,
  isSubmitting,
}) {
  const isMontantDisabled = selectedResolution === "annulation_complete";
  const numericAmount = Number(String(refundAmount).replace(/\s/g, "")) || 0;
  const isAmountTooHigh = maxAmount != null && numericAmount > maxAmount;

  const canSubmit =
    !!selectedResolution &&
    !isSubmitting &&
    (isMontantDisabled || (refundAmount !== "" && !isAmountTooHigh));

  const handleResolutionChange = (value) => {
    onResolutionChange(value);
    if (value === "annulation_complete") {
      onRefundAmountChange("0");
    }
  };

  return (
    <Card title="Proposer une resolution">
      <div className="space-y-2 mb-4">
        {RESOLUTION_OPTIONS.map((opt) => (
          <Button
            key={opt.value}
            variant="ghost"
            size="md"
            fullWidth
            onClick={() => handleResolutionChange(opt.value)}
            className={`justify-start !bg-white !text-gray-900 ${
              selectedResolution === opt.value
                ? '!border-2 !border-black font-bold'
                : '!border !border-gray-200'
            }`}
          >
            {opt.label}
          </Button>
        ))}
      </div>

      <div className="mb-4">
        <label className="block text-xs text-sl-500 uppercase tracking-[0.06em] mb-1">
          Montant rembourse (XAF)
        </label>
        <input
          type="text"
          value={refundAmount}
          onChange={(e) => onRefundAmountChange(e.target.value)}
          placeholder="Ex: 10 000"
          disabled={isMontantDisabled}
          className="w-full border border-sl-200 rounded-[var(--radius-md)] px-3 py-2 text-sm outline-none focus:border-brand disabled:bg-sl-100 disabled:text-sl-400"
        />
        {isAmountTooHigh && (
          <p className="text-xs text-danger mt-1">
            Le montant ne peut pas depasser {maxAmount.toLocaleString("fr-FR")} XAF.
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Button
          variant="primary"
          fullWidth
          onClick={onSubmit}
          disabled={!canSubmit}
          className="!bg-black hover:!bg-gray-900 disabled:!bg-gray-400"
        >
          {isSubmitting ? "Envoi..." : "Soumettre la resolution"}
        </Button>
        <Button
          variant="ghost"
          fullWidth
          onClick={onClose}
        >
          Cloтurer le litige
        </Button>
      </div>
    </Card>
  );
}
