export function RoleSwitcher({ role, onChange }) {
  return (
    <div className="flex gap-2 mb-4">
      <button
        type="button"
        onClick={() => onChange("client")}
        className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
          role === "client"
            ? "bg-brand text-white shadow-md"
            : "bg-white text-sl-700 border border-sl-300 hover:bg-sl-100"
        }`}
      >
        Client
      </button>
      <button
        type="button"
        onClick={() => onChange("provider")}
        className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
          role === "provider"
            ? "bg-brand text-white shadow-md"
            : "bg-white text-sl-700 border border-sl-300 hover:bg-sl-100"
        }`}
      >
        Prestataire
      </button>
    </div>
  );
}