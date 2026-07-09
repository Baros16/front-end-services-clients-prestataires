export default function TabBar({ tabs, activeKey, onChange }) {
  return (
    <div className="flex gap-2 mb-4 flex-wrap">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`px-3 py-1 rounded-full text-[12px] font-semibold border-none cursor-pointer transition-all duration-150
          ${
            activeKey === tab.key
              ? "bg-brand text-white"
              : "bg-sl-100 text-sl-500 hover:bg-sl-200"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}