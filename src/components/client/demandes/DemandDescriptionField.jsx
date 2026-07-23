// src/components/client/demand/DemandDescriptionField.jsx
import  { Input }  from '../../commons/Input';
//import Input  from "../../commons/Input";

/**
 * DemandDescriptionField — Textarea description détaillée
 * Props:
 *   value: string
 *   onChange: (value: string) => void
 *   error: string | undefined
 *   minLength: number (défaut: 30)
 */
export default function DemandDescriptionField({ value, onChange, error, minLength = 30 }) {
  const charCount = value.length;
  const isUnderMin = charCount < minLength && charCount > 0;

  return (
    <div>
      <Input
        label="Description détaillée"
        type="textarea"
        placeholder="Décrivez précisément votre problème…"
        value={value}
        onChange={onChange}
        error={error}
        required
      />
      <div className="flex justify-between mt-1">
        <span
          className={`text-[11px] ${
            isUnderMin
              ? 'text-[var(--color-warning)]'
              : charCount >= minLength
              ? 'text-[var(--color-success)]'
              : 'text-[var(--color-sl-400)]'
          }`}
        >
          {charCount < minLength
            ? `Minimum recommandé : ${minLength} caractères (${charCount}/${minLength})`
            : `✓ Description suffisante (${charCount} caractères)`}
        </span>
      </div>
    </div>
  );
}