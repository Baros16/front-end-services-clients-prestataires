import { useState, useRef } from "react";
import { Input } from "../../components/commons"

// Pays supportés (uniquement Cameroun pour l'instant)
const COUNTRIES = {
  CM: {
    code: "+237",
    flag: "🇨🇲",
    name: "Cameroun",
    mask: "6X XX XX XX",
  },
};

export function PhoneInput({
  value,
  onChange,
  label = "Téléphone",
  placeholder = "6 XX XX XX XX",
  required = false,
  error = "",
  disabled = false,
  className = "",
}) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  // Préfixe fixe pour le Cameroun
  const prefix = COUNTRIES.CM.code; // "+237"
  const flag = COUNTRIES.CM.flag; // "🇨🇲"

  // Nettoyer la valeur (garder uniquement les chiffres après le préfixe)
  const getRawNumber = (val) => {
    if (!val) return "";
    // Enlever le préfixe si présent
    if (val.startsWith(prefix)) {
      return val.slice(prefix.length).replace(/\D/g, "");
    }
    return val.replace(/\D/g, "");
  };

  const rawNumber = getRawNumber(value);
  const displayValue = rawNumber ? rawNumber : "";

  const handleChange = (e) => {
    const input = e.target.value;
    // Garder uniquement les chiffres
    const digits = input.replace(/\D/g, "");
    
    // Limiter à 9 chiffres (pour +237 6XXXXXXXX)
    const limited = digits.slice(0, 9);
    
    // Reconstruire avec le préfixe
    const fullValue = limited ? `${prefix}${limited}` : "";
    onChange(fullValue);
  };

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  return (
    <div className={`${className}`}>
      {label && (
        <label className="block text-sm font-medium text-sl-700 mb-1">
          {label}
          {required && <span className="text-danger ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {/* Banderole pays */}
        <div 
          className={`
            absolute left-0 top-0 h-full flex items-center gap-1 px-3
            bg-sl-100 border-r border-sl-200 rounded-l-md
            text-sl-600 text-sm font-medium
            ${isFocused ? "border-brand" : ""}
          `}
          style={{ zIndex: 5 }}
        >
          <span>{flag}</span>
          <span>{prefix}</span>
        </div>
        
        <input
          ref={inputRef}
          type="tel"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder={placeholder}
          value={displayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          className={`
            w-full pl-[100px] pr-3 py-2.5
            border border-sl-200 rounded-md
            text-sl-900 text-sm
            placeholder:text-sl-400
            focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand
            disabled:bg-sl-50 disabled:text-sl-400 disabled:cursor-not-allowed
            ${error ? "border-danger focus:ring-danger/20 focus:border-danger" : ""}
          `}
        />
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-danger">{error}</p>
      )}

    </div>
  );
}