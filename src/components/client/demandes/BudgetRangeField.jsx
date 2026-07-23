import { Input } from '../../commons';

export function BudgetRangeField({ value, onChange, error, required = false }) {
  const handleMinChange = (v) => onChange({ ...value, min: v });
  const handleMaxChange = (v) => onChange({ ...value, max: v });

  return (
    <div className="flex flex-col gap-2">
      <span className="text-[13px] font-semibold text-sl-700 font-[family-name:var(--font-body)]">
        Budget estimé (FCFA)
        {required && <span className="text-danger ml-0.5">*</span>}
      </span>
      <div className="flex items-start gap-3">
        <Input
          type="number"
          placeholder="Min"
          value={value.min}
          onChange={handleMinChange}
        />
        <span className="text-sl-400 text-[13px] mt-2.5">—</span>
        <Input
          type="number"
          placeholder="Max"
          value={value.max}
          onChange={handleMaxChange}
        />
      </div>
      {error && (
        <span className="text-[12px] text-danger font-medium">⚠ {error}</span>
      )}
    </div>
  );
}