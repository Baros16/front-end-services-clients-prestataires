// src/components/provider/mission-start/PreDepartureChecklist.jsx
import { useState } from "react";
import { Card, Check} from "../../commons";

const CHECKLIST_ITEMS = [
  { id: "materiaux", label: "Matériaux préparés" },
  { id: "outils", label: "Outils chargés dans le véhicule" },
  { id: "adresse", label: "Adresse client confirmée" },
  { id: "telephone", label: "Téléphone chargé" },
];

export function PreDepartureChecklist({ className = "" }) {
  const [checked, setChecked] = useState({});

  function toggle(itemId) {
    setChecked((prev) => ({ ...prev, [itemId]: !prev[itemId] }));
  }

  return (
    <Card title="Checklist avant départ" className={className}>
      <ul className="flex flex-col gap-3 list-none m-0 p-0">
        {CHECKLIST_ITEMS.map((item) => {
          const isChecked = !!checked[item.id];
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => toggle(item.id)}
                className="flex items-center gap-3 w-full text-left bg-transparent border-none cursor-pointer p-0"
              >
                <span
                  className={`
                    flex items-center justify-center shrink-0 w-5 h-5 rounded-[6px]
                    border-[1.5px] transition-colors duration-150
                    ${isChecked
                      ? "bg-success border-success"
                      : "bg-white border-sl-300"}
                  `}
                >
                  {isChecked && (
                    <Check size={14} strokeWidth={3} className="text-white" />
                  )}
                </span>
                <span
                  className={`text-[14px] font-[family-name:var(--font-body)] transition-colors duration-150 ${
                    isChecked ? "text-sl-400 line-through" : "text-sl-700"
                  }`}
                >
                  {item.label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}