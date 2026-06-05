// src/components/SearchInput.jsx
import { useState } from "react";

/**
 * SearchInput
 * Champ de recherche avec icône loupe préfixe et bouton × de reset.
 * Utilisé dans la gestion users admin et le filtre demandes prestataire.
 */
export function SearchInput({
  value,
  onChange,
  placeholder = "Rechercher…",
  onClear,
  className = "",
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div
      className={`
        relative flex items-center
        rounded-[var(--radius-md)] border transition-all duration-150
        ${
          focused
            ? "border-brand shadow-[0_0_0_3px_rgba(27,67,50,0.08)]"
            : "border-sl-200 hover:border-sl-300"
        }
        bg-white ${className}
      `}
    >
      {/* Icône loupe */}
      <span className="absolute left-3 text-sl-400 text-[14px] pointer-events-none select-none">
        🔍
      </span>

      {/* Input */}
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange?.(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="
          w-full pl-9 pr-8 py-[9px] text-[13px] bg-transparent outline-none
          font-[family-name:var(--font-body)] text-sl-900 placeholder:text-sl-300
        "
      />

      {/* Bouton clear */}
      {onClear && value && (
        <button
          onClick={onClear}
          className="
            absolute right-3 text-sl-400 hover:text-sl-600
            text-[16px] leading-none bg-transparent border-none
            cursor-pointer p-0 transition-colors
          "
        >
          ×
        </button>
      )}
    </div>
  );
}
