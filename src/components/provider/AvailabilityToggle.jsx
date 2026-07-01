export function AvailabilityToggle({ isAvailable, onToggle }) {
  return (
    <button
      onClick={() => onToggle(!isAvailable)}
      className={`flex items-center gap-2 rounded-[var(--radius-sm)] border px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
        isAvailable
          ? "border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
          : "border-sl-200 bg-white text-sl-500 hover:bg-sl-50"
      }`}
    >
      <span className={`h-2 w-2 rounded-full ${isAvailable ? "bg-green-500" : "bg-sl-300"}`} />
      {isAvailable ? "Disponible" : "Indisponible"}
    </button>
  );
}
