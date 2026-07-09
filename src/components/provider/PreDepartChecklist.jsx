import { useState } from "react";
import { Check } from "../commons";

const ITEMS_DEFAUT = [
  { id: "materiaux", label: "Matériaux préparés",               checked: true  },
  { id: "outils",    label: "Outils chargés dans le véhicule",  checked: true  },
  { id: "adresse",   label: "Adresse client confirmée",          checked: false },
  { id: "telephone", label: "Téléphone chargé",                  checked: false },
];

export function PreDepartChecklist({ items: itemsProp, onToggle: onToggleProp }) {
  const [items, setItems] = useState(ITEMS_DEFAUT);

  const toggle = (id) => {
    if (onToggleProp) { onToggleProp(id); return; }
    setItems(items.map((it) => it.id === id ? { ...it, checked: !it.checked } : it));
  };

  const liste = itemsProp ?? items;

  return (
    <div className="flex flex-col gap-2">
      {liste.map((item) => (
        <div
          key={item.id}
          onClick={() => toggle(item.id)}
          className={`flex items-center gap-3 p-3 rounded-[var(--radius-md)] cursor-pointer transition-colors duration-150
            ${item.checked ? "bg-success-light" : "bg-sl-50 hover:bg-sl-100"}`}
        >
          <div className={`w-5 h-5 min-w-[20px] rounded-md flex items-center justify-center transition-all duration-150
            ${item.checked ? "bg-success" : "border-[2px] border-sl-300 bg-white"}`}>
            {item.checked && <Check size={12} style={{ color: "white" }} />}
          </div>
          <span className={`text-[13px] font-medium transition-all duration-150
            ${item.checked ? "text-success line-through" : "text-sl-700"}`}>
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}

export default PreDepartChecklist;
